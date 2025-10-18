HU 1   
**Como professor,**

quero visualizar uma lista com todos os meus alunos cadastrados,para poder escolher rapidamente qual aluno terá sua trilha de leitura acessada.

Critérios de aceitação:

* Exibir todos os alunos salvos.  
* Cada card deve mostrar nome e (se disponível) foto/avatar.  
* Deve existir um botão ou link de acesso à trilha de leitura do aluno.  
* Possibilidade de remover ou editar um aluno (opcional).

HU 2  
**Como professor,**

quero acessar a trilha de leitura de um aluno específico,para acompanhar seu progresso e aplicar os exercícios de leitura, sem precisar seguir a ordem obrigatória da trilha.

Critérios de aceitação:

* Exibir uma linha do tempo vertical (trilha).  
* Cada card da trilha deve conter:  
  * Título do trecho.  
  * Texto a ser lido.  
  * Letras/fonemas trabalhados.  
* O professor pode selecionar qualquer card, independente da posição na trilha.  
* A navegação entre cards deve ser manual (não forçada pela ordem).  
* Ainda assim, deve haver um indicador de progresso sugerido (ex.: cards já lidos podem ficar marcados, com cor diferente ou check).

HU 3  
**Como aluno,**  
quero ler um trecho de texto exibido na tela do celular da professora,para praticar minha leitura em voz alta e ser gravado para que a professora veja meu progresso.  
Como professora,quero controlar a gravação e escolher qual card da trilha o aluno deve ler,para acompanhar a leitura do aluno sem que ele precise mexer no aparelho.

Critérios de aceitação:

* O aluno vê o título do trecho e o texto completo em destaque, com fonte grande e fácil de ler.  
* O aluno lê o texto em voz alta, seguindo seu próprio ritmo, podendo pausar naturalmente sem que a gravação seja interrompida.  
* A professora inicia e finaliza a gravação clicando no botão grande e visível na parte inferior da tela.  
* Durante a gravação, há indicação clara de que a gravação está acontecendo (ícone pulsante ou contagem de tempo).  
* A gravação é salva automaticamente, vinculada ao aluno e ao card selecionado.  
* O aluno sente que está sendo acompanhado e que a gravação serve para melhorar sua leitura e pronúncia.  
* O professor pode escolher qual card trabalhar, sem necessidade de seguir a ordem da trilha.

HU 4  
**Como professor**,

quero cadastrar um novo aluno no sistema,  
para adicionar rapidamente perfis de estudantes e iniciar o acompanhamento de sua trilha de leitura.

Critérios de aceitação:

Formulário simples com campos obrigatórios: nome, idade, faixa etária e (opcional) foto/avatar ou condições especiais (ex.: TDAH, dislexia).  
Integração automática com uma trilha de leitura inicial adaptada à idade do aluno.  
Validação de dados para evitar duplicatas ou erros de entrada.  
Confirmação visual após cadastro, com o aluno aparecendo imediatamente na lista de alunos.  
Opção para importar dados de fontes externas, como listas de turma (opcional).

HU 5  
**Como professor,**

**quero** visualizar os resultados da análise automática da gravação de leitura de um aluno,  
para identificar métricas de fluência, prosódia e velocidade e planejar intervenções personalizadas.

Critérios de aceitação:

* Exibir métricas detalhadas pós-gravação: acurácia, velocidade (palavras por minuto), prosódia (entonação e pausas) e pontuação geral.  
* Integração com IA para diagnóstico preliminar, destacando possíveis dificuldades (ex.: dislexia ou TDAH).  
* Gráfico ou indicadores visuais para comparar com avaliações anteriores do mesmo aluno.  
* Botão para acessar recomendações automáticas de atividades de literacia baseadas nos resultados.  
* Os resultados devem ser vinculados ao card específico da trilha e salvos no histórico do aluno.

HU 6

**Como professor,**

**quero** gerar e visualizar relatórios de progresso geral de um aluno ao longo da trilha de leitura,

para monitorar o desenvolvimento ao longo do tempo e compartilhar com famílias ou especialistas.

Critérios de aceitação:

* Relatório inclui resumo de todas as gravações: métricas agregadas, cards completados e evolução (ex.: gráficos de linha para fluência).  
* Filtros por período (ex.: mensal ou por fase da trilha).  
* Opção para exportar o relatório em PDF ou compartilhar via e-mail/link seguro.  
* Destaque para áreas de melhoria, com links para cards recomendados.  
* Indicadores de progresso sugerido, como porcentagem da trilha concluída.

HU 7  
**Como professor,**

quero criar uma trilha de leitura personalizável para um aluno, com o auxílio de IA,

para adaptar os trechos de texto e fonemas trabalhados às necessidades específicas do estudante.

Critérios de aceitação:

* Acesso à edição de cards existentes: alterar título, texto, letras/fonemas ou adicionar novos cards.  
* Sugestões automáticas de textos e fonemas adaptados por faixa etária e dificuldade, gerados por IA e baseadas em bases de dados compiladas.  
* Manutenção da estrutura vertical da trilha, com possibilidade de reordenar cards.  
* Salvar alterações sem afetar gravações anteriores.  
* Notificação se a edição impactar o progresso sugerido pela IA (ex.: reset de indicadores).  
* A IA deve aprender e refinar as sugestões com base no progresso e desempenho do aluno.

HU 8  
**Como professor,**

Como professor, quero acessar o app com uma conta minha personalizada (do Google ou própria) para gerenciar minhas aulas e interagir com os alunos de forma segura e organizada.

**Critérios de Aceitação:**

* **Dado** que sou um professor, **quando** acesso o aplicativo, **então** devo conseguir fazer login usando minha conta Google.  
* **Dado** que sou um professor, **quando** acesso o aplicativo, **então** devo conseguir fazer login usando uma conta de e-mail e senha cadastrada na plataforma (conta própria).  
* **Dado** que estou logado com minha conta personalizada, **então** devo ter acesso a um painel que me permita gerenciar minhas turmas e atividades.  
* **Dado** que estou logado com minha conta personalizada, **então** minhas informações de perfil (nome, foto, etc.) devem ser exibidas corretamente.  
* **Dado** que minha conta personalizada está logada, **quando** tento acessar funcionalidades restritas a professores, **então** devo ter acesso sem problemas.  
* **Dado** que minha conta personalizada está logada, **quando** tento acessar funcionalidades de aluno, **então** devo ser impedido ou redirecionado para a área de professor.

### **HU 9**

**Como professor,**  
 quero exportar os resultados e métricas totais e individuais de cada gravação,  
 para arquivar, compartilhar com outros profissionais ou analisar o progresso dos alunos fora do sistema.

**Critérios de aceitação:**

* Deve existir a opção de exportar **todas as métricas consolidadas** de um aluno (fluência, prosódia, velocidade, acurácia e pontuação geral).

* O professor pode escolher entre exportar **os resultados completos da trilha** ou **de gravações específicas**.

* O formato de exportação deve incluir:

  * Arquivo **PDF** (visual) e **CSV** (dados brutos).

  * Cabeçalho com informações do aluno (nome, idade, trilha atual).

  * Data e hora de cada gravação.

  * Métricas detalhadas por gravação e médias totais.

* O layout do PDF deve apresentar gráficos ou indicadores visuais (cores, barras ou ícones) para facilitar a leitura dos resultados.

* A exportação deve manter o padrão de segurança do sistema, exigindo autenticação do professor.

* Possibilidade de compartilhar o arquivo gerado por e-mail ou link seguro (opcional).

* Deve haver uma confirmação de sucesso após a exportação, com opção de abrir o arquivo diretamente.
