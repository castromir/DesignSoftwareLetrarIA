# Scripts CLI

Este diretório contém scripts de linha de comando para auxiliar no desenvolvimento e uso da aplicação.

## transcribe_cli.py

Script CLI para transcrever arquivos de áudio usando Whisper local (sem necessidade de API externa).

### Requisitos

Antes de usar o script, certifique-se de ter instalado a biblioteca `openai-whisper`:

```bash
pip install openai-whisper
```

Ou instale diretamente do repositório GitHub:

```bash
pip install git+https://github.com/openai/whisper.git
```

### Uso Básico

```bash
python3 scripts/transcribe_cli.py <caminho_audio>
```

### Parâmetros

#### Argumentos Posicionais

- `audio_path` (obrigatório): Caminho do arquivo de áudio a ser transcrito

#### Opções

- `--output-dir <diretorio>`: Diretório onde salvar a transcrição (padrão: `transcriptions`)
- `--language <codigo>`: Código do idioma do áudio (padrão: `pt`)
- `--model <tamanho>`: Tamanho do modelo Whisper a ser usado (padrão: `base`)

### Modelos Disponíveis

O Whisper oferece diferentes modelos com diferentes trade-offs entre velocidade e qualidade:

| Modelo | Tamanho | Velocidade | Qualidade | Uso Recomendado |
|--------|---------|------------|-----------|-----------------|
| `tiny` | 39M | Mais rápido | Menos preciso | Testes rápidos |
| `base` | 74M | Rápido | Balanceado | **Padrão recomendado** |
| `small` | 244M | Médio | Boa qualidade | Produção |
| `medium` | 769M | Lento | Muito boa | Alta qualidade |
| `large` | 1550M | Mais lento | Melhor qualidade | Máxima precisão |

**Nota:** Na primeira execução, o modelo será baixado automaticamente, o que pode demorar alguns minutos dependendo do tamanho escolhido.

### Formatos de Áudio Suportados

O Whisper suporta diversos formatos de áudio, incluindo:
- MP3
- WAV
- M4A
- FLAC
- OGG
- E outros formatos comuns

### Exemplos de Uso

#### Transcrição simples

```bash
python3 scripts/transcribe_cli.py audio.mp3
```

#### Especificar diretório de saída

```bash
python3 scripts/transcribe_cli.py audio.mp3 --output-dir ./resultados
```

#### Usar modelo de maior qualidade

```bash
python3 scripts/transcribe_cli.py audio.mp3 --model small
```

#### Transcrição com caminho completo

```bash
python3 scripts/transcribe_cli.py /caminho/completo/audio.wav --model large
```

#### Transcrição em outro idioma

```bash
python3 scripts/transcribe_cli.py audio.mp3 --language en
```

#### Exemplo completo com todas as opções

```bash
python3 scripts/transcribe_cli.py audio.mp3 \
    --output-dir ./transcricoes \
    --model small \
    --language pt
```

### Saída

O script gera um arquivo de texto com a transcrição no diretório especificado (ou no diretório padrão `transcriptions`). O nome do arquivo segue o padrão:

```
<nome_original>_transcription_<timestamp>.txt
```

Exemplo: `audio_transcription_20241102_143022.txt`

A transcrição também é exibida no terminal durante a execução.

### Solução de Problemas

#### Erro: Biblioteca 'openai-whisper' não instalada

Instale a biblioteca com:

```bash
pip install openai-whisper
```

#### Erro: Arquivo não encontrado

Verifique se o caminho do arquivo está correto e se o arquivo existe.

#### Erro ao carregar modelo

Certifique-se de ter conexão com a internet na primeira execução para baixar o modelo. Verifique também se há espaço suficiente em disco.

#### Performance lenta

Para melhorar a performance:
- Use modelos menores (`tiny`, `base`) para testes
- Use modelos maiores (`small`, `medium`, `large`) apenas quando necessário
- Considere usar GPU para processamento mais rápido (requer configuração adicional)

