# Agente Pedagogo Sênior Avaliador de Leitura

## Visão Geral

O **Agente Pedagogo Sênior** é o componente de inteligência artificial central da plataforma LetrarIA, responsável por analisar gravações de leitura de alunos em processo de alfabetização e produzir insights pedagógicos acionáveis para o profissional de educação.

O agente opera como um especialista em alfabetização com amplo repertório de avaliação de leitura oral, capaz de interpretar métricas objetivas (acurácia, velocidade, fluência, prosódia) combinadas com o contexto longitudinal do aluno (observações do professor, diagnósticos anteriores, histórico de gravações) para emitir pareceres pedagógicos personalizados.

---

## Responsabilidades

| Responsabilidade | Descrição |
|---|---|
| **Avaliar leituras** | Analisar a transcrição da leitura em relação ao texto de referência |
| **Contextualizar o aluno** | Considerar histórico, diagnósticos e observações do professor |
| **Classificar o insight** | Categorizar a situação como progresso, atenção necessária ou sugestão |
| **Priorizar intervenções** | Indicar urgência (baixa, média, alta) para orientar a agenda do profissional |
| **Produzir orientação prática** | Gerar texto pedagógico encorajador e diretamente aplicável em sala |
| **Responder perguntas** | Responder perguntas livres do profissional sobre o aluno com base no contexto disponível |

---

## Fluxo de Ativação

```
Aluno realiza gravação
        │
        ▼
Whisper transcreve o áudio → texto
        │
        ▼
analyze_reading() compara transcrição com texto de referência
  ├── acurácia, WPM, fluência, prosódia
  └── lista de erros (substituições, omissões, inserções)
        │
        ▼
POST /recordings/ salva gravação + análise
        │
        ▼
FastAPI BackgroundTask dispara o agente (assíncrono)
        │
        ▼
BaseAIService._create_ai_insight_for_recording()
  ├── busca dados do aluno
  ├── busca diagnósticos recentes (últimos 3)
  ├── busca gravações anteriores (últimas 5)
  ├── monta prompt com contexto completo
  ├── chama _call_model() → LLM escolhido
  └── salva AIInsight no banco de dados
        │
        ▼
Insight disponível no painel do profissional
```

O agente é disparado **em background** após a gravação ser salva, de modo que o profissional recebe a resposta da API imediatamente enquanto o insight é gerado em paralelo.

---

## Contexto Fornecido ao Agente

O agente recebe um prompt estruturado com todas as informações disponíveis sobre o aluno:

### 1. Dados do Aluno
- Nome e idade
- Observações livres registradas pelo professor (campo `observations` do modelo `Student`)

### 2. Diagnósticos Recentes (até 3)
Para cada diagnóstico:
- Tipo de diagnóstico
- Data de aplicação
- Pontuação geral
- Nível de leitura avaliado
- Pontos fortes identificados
- Dificuldades identificadas
- Recomendações registradas

### 3. Histórico de Gravações (até 5 mais recentes)
Para cada gravação anterior:
- Título da história lida
- Data da gravação
- Métricas técnicas: acurácia, erros, total de palavras, palavras corretas, WPM, fluência, prosódia, pontos de melhoria
- Transcrição completa

### 4. Gravação Atual
- ID da história
- Data e hora
- Duração em segundos
- Transcrição completa
- Métricas calculadas em tempo real

---

## Análise Técnica de Leitura (Pré-processamento)

Antes de acionar o LLM, o sistema executa `analyze_reading()` — uma análise algorítmica determinística que processa a transcrição e extrai métricas objetivas. Esses dados enriquecem o contexto do agente.

### Métricas Calculadas

| Métrica | Cálculo | Referência |
|---|---|---|
| **Acurácia** | `(palavras corretas / palavras faladas) × 100` | — |
| **Velocidade (WPM)** | `palavras faladas / minutos de gravação` | — |
| **Fluência** | `min(100, (WPM / 120) × 100)` | 120 WPM = fluência plena |
| **Prosódia** | `(pontuações faladas / pontuações esperadas) × 100` | Baseado em `.!?` |
| **Score geral** | Média de acurácia + fluência + prosódia | — |

### Classificação de Erros

O algoritmo usa `difflib.SequenceMatcher` para comparar palavra a palavra entre o texto de referência e a transcrição:

| Tipo de Erro | Definição |
|---|---|
| **Substituição** | Palavra diferente da esperada foi lida |
| **Omissão** | Palavra esperada não foi lida |
| **Inserção** | Palavra não prevista foi lida |

### Pontos de Melhoria (Gerados Algoritmicamente)
- Até 5 palavras únicas com erro são listadas para revisão
- Prosódia < 60: sugere praticar entonação e pausas
- Fluência < 60: sugere praticar ritmo constante

Esses pontos compõem uma camada de **fallback**: se o LLM falhar, o insight é gerado exclusivamente com base nessas métricas, garantindo que o profissional sempre receba algum retorno.

---

## Estrutura do Insight Gerado

O agente produz um insight estruturado com quatro campos obrigatórios:

```json
{
  "type": "progress | attention_needed | suggestion",
  "priority": "low | medium | high",
  "title": "Frase curta e descritiva (≤ 60 caracteres)",
  "description": "Parágrafo com orientação pedagógica prática"
}
```

### Tipos de Insight

| Tipo | Quando usar | Cor no painel |
|---|---|---|
| `progress` | Aluno demonstrou evolução clara | Verde |
| `attention_needed` | Aluno apresenta dificuldades que requerem intervenção | Vermelho |
| `suggestion` | Situação neutra com oportunidade de melhoria | Azul |

### Regras de Prioridade (Fallback Algorítmico)

Quando o LLM não está disponível, a prioridade é definida por:

| Condição | Tipo | Prioridade |
|---|---|---|
| Acurácia ≥ 85% e erros ≤ 1 | `progress` | `low` |
| Acurácia < 60% | `attention_needed` | `high` |
| Erros ≥ 5 | `attention_needed` | `high` |
| Demais casos | `suggestion` | `medium` |

---

## Prompt do Agente

O prompt enviado ao LLM segue o template abaixo (gerado dinamicamente em `BaseAIService`):

```
Você é um especialista em alfabetização auxiliando um profissional da educação.
Avalie a nova gravação do aluno com base no contexto e produza um insight pedagógico útil.
Mantenha um tom encorajador e prático.

Aluno: {nome} (idade: {idade})

Nova gravação:
- História ID: {story_id}
- Data/hora: {recorded_at}
- Duração: {duration_seconds} segundos
- Transcrição completa:
{transcription}

Contexto adicional:
{observações do professor}
{diagnósticos recentes}
{leituras anteriores com métricas}
{métricas da leitura atual}

Responda exclusivamente em JSON com os campos obrigatórios:
{"type": "progress|attention_needed|suggestion",
 "priority": "low|medium|high",
 "title": "frase curta",
 "description": "parágrafo breve com orientação prática"}
Não inclua texto fora do JSON.
```

O formato JSON é obrigatório para garantir parsing estruturado da resposta. O agente tenta extrair JSON tanto de respostas limpas quanto de respostas encapsuladas em blocos de código markdown (` ```json ... ``` `).

---

## Providers de LLM Suportados

O agente é agnóstico ao modelo de linguagem. A troca é feita via variável de ambiente `AI_PROVIDER`:

### Google Gemini (padrão)
```env
AI_PROVIDER=gemini
GOOGLE_GENAI_API_KEY=sua-chave
GOOGLE_GENAI_MODEL=gemini-2.5-flash
```
- SDK: `google-genai`
- Comunicação: API REST via SDK oficial
- Vantagem: alta qualidade, contexto longo, sem infraestrutura

### Ollama (local/self-hosted)
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://gpu-l40s-1.w3b.inf:11434
OLLAMA_MODEL=llama3.2
```
- Protocolo: `POST /api/generate` (API nativa do Ollama)
- Comunicação: `httpx` assíncrono, timeout de 120s
- Vantagem: privacidade total dos dados, sem custo por requisição, execução em GPU local

### Adicionando Novo Provider
1. Criar classe que estende `BaseAIService` em `backend/app/services/genai/`
2. Implementar o método `async def _call_model(self, prompt: str) -> str`
3. Registrar no factory em `factory.py`

---

## Estratégia de Resiliência

O agente foi projetado com múltiplas camadas de proteção para garantir que o profissional sempre receba algum feedback:

```
1. Chama o LLM configurado (Gemini ou Ollama)
        │
        ├── Sucesso → retorna insight do LLM
        │
        └── Falha (API indisponível, timeout, JSON inválido)
                │
                └── Fallback algorítmico com base nas métricas de analyze_reading()
                        │
                        ├── Há métricas → retorna insight baseado em acurácia/erros/fluência
                        │
                        └── Sem métricas → não cria insight (log de warning)
```

Erros são capturados silenciosamente com log detalhado para não impactar o fluxo principal da gravação.

---

## Modelo de Dados

O insight gerado é persistido na tabela `ai_insights`:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único |
| `professional_id` | UUID | Profissional que receberá o alerta |
| `insight_type` | Enum | `progress`, `attention_needed`, `suggestion` |
| `priority` | Enum | `low`, `medium`, `high` |
| `title` | String | Título curto |
| `description` | Text | Orientação pedagógica completa |
| `related_students` | UUID[] | Lista de alunos relacionados |
| `is_read` | Boolean | Marcador de leitura |
| `created_at` | DateTime | Data de criação |

---

## Feedback no Frontend

Após a gravação ser salva, o frontend exibe um toast de loading `"Gerando insight pedagógico com IA..."` e faz polling no endpoint `GET /ai-insights/?student_id={id}&limit=5` a cada 3 segundos por até 30 segundos.

Quando um insight com `created_at` posterior ao momento da gravação é detectado, o toast é atualizado para `"Insight de IA gerado!"` exibindo o título do insight. O profissional pode então consultar o painel de alertas para ler a orientação completa.

---

## Localização no Código

| Arquivo | Responsabilidade |
|---|---|
| `backend/app/services/genai/base.py` | Classe base abstrata: busca de dados, formatação, prompts, parsing |
| `backend/app/services/genai/service.py` | Provider Gemini |
| `backend/app/services/genai/ollama.py` | Provider Ollama |
| `backend/app/services/genai/factory.py` | Seleção de provider por configuração |
| `backend/app/services/reading_analysis.py` | Análise algorítmica de leitura (pré-processamento) |
| `backend/app/services/recording_service.py` | Orquestração: análise → insight → persistência |
| `backend/app/api/routes/recording.py` | Endpoint que dispara o background task |
| `frontend/src/components/ReadingStory.tsx` | Polling e feedback visual para o profissional |
