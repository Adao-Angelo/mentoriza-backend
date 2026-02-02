# Aplicação Web para Gestão de Estudantes e Submissões

## Visão Geral

Esta aplicação web permite que o coordenador de curso gerencie estudantes, grupos, submissões de relatórios e indicadores de avaliação. O sistema suporta o upload de listas de estudantes via CSV, formação automática de grupos, atribuição de orientadores, controle de submissões com prazos e análise automatizada de relatórios usando IA para verificar critérios como percentagem de conteúdo gerado por IA e conformidade com normas ABNT.
A aplicação utiliza RBAC (Role-Based Access Control) para gerenciar permissões. Os cursos suportados são Informática e Eletrônica.
Funcionalidades Principais

## Upload e Gestão de Estudantes

O coordenador pode criar um setup para fazer upload de um arquivo CSV contendo a lista de estudantes.
Cada estudante deve incluir os seguintes dados: nome, e-mail, número, turma, curso (Informática ou Eletrônica) e outros dados adicionais.
Após o upload da lista de estudantes, o sistema prossegue para o fluxo de formação de grupos.
O coordenador pode escolher o tamanho dos grupos (por exemplo, grupos de 4, 3 ou 6 estudantes). O sistema divide automaticamente a lista de estudantes com base nessa escolha.

#### Estudantes e credencias

porem os grupos não ainda não estarão publicados. pois quando o cordeador clicar em publicar grupo todos o estudantes poderão receber um email com suas credenciar e com informações relevantes sobre o grupo. (ex isso vai nao var ser executado de forma assíncrona tem de ter um fila qua var ser responsável por envio de emails)

## Gestão de Grupos

Cada grupo deve ter um número identificador (ex: grupo-1, grupo-2).
Cada grupo pertence a um curso específico (Informática ou Eletrônica).
Cada grupo possui uma lista de estudantes que fazem parte dele.
Os grupos podem ter um orientador e/ou co-orientador.
O coordenador pode trocar estudantes entre grupos e reatribuir orientadores.
Um orientador pode estar associado a múltiplos grupos, com papéis variados: em um grupo pode ser orientador principal, em outro co-orientador, ou apenas co-orientador. O papel pode variar conforme o grupo.

## Submissões

As submissões controlam o envio de relatórios pelos grupos ou estudantes.
Cada submissão tem um status de tempo (ex: "Ativo" para ativa, "Inativo" para terminada).
Se uma submissão estiver ativa ("Ativa"), os estudantes ou grupos podem fazer upload de relatórios na plataforma. e o relatório sera vinculado a essa submissão.
Se a submissão estiver terminada ("Inativa"), não é permitido fazer upload de novos dados.
Os relatórios são validados pela plataforma, que verifica indicadores como percentagem de conteúdo gerado por IA e conformidade com normas ABNT.
Os usuários podem visualizar os resultados da análise, incluindo percentagens e feedback.

## Indicadores de Avaliação

O coordenador ou usuários com permissões (via RBAC) podem cadastrar ou criar indicadores que a IA usará como critérios de avaliação.
Os indicadores definem limites ou valores mínimos/máximos para a análise dos relatórios.
Exemplos de indicadores:
Percentagem de IA: no máximo 20%.
Percentagem de conformidade com normas ABNT: no mínimo 70%.

A IA avalia os relatórios com base nesses indicadores e fornece feedback, incluindo resultados chave, observações e pontuação.

## Relatórios e Processamento

Cada estudante ou grupo pode fazer upload de um relatório (PDF) pertencente ao seu grupo, desde que haja uma submissão ativa.
O relatório é associado à submissão ativa no momento do upload.
Fluxo de processamento:
Upload do PDF para o Cloudinary, que retorna uma URL.
Envio para uma fila (queue) dos dados: ID do grupo, URL do arquivo e indicadores relevantes.
Um worker em Python consome os dados da fila e processa o relatório:
Faz download do arquivo e armazena em uma pasta temporária.
Converte o PDF para Markdown.
Analisa o conteúdo com base nos indicadores.
Retorna resultados: keyResults (resultados chave), observations (observações), score (pontuação), ID do grupo e status "done".

### Estados do Relatórios

_Em avaliação_ o Relatórios foi submetido com sucesso porem o worker em ainda nao valio ou e deu sua nota ou sua pontuação que aqui na plataforma vamos chamar de score.

_Reprovado_ caso o Relatórios não cumpra como os requisitos dos Indicadores de Avaliação, basta sair fora das metricas do indicadores e reprovado.

_Aprovado_ o Relatórios cumpre com os requisitos dos Indicadores de Avaliação

## Tecnologias e Arquitetura

Frontend/Backend: Nest/Next.js
Armazenamento de Arquivos: Cloudinary para upload e hospedagem de PDFs.
Processamento Assíncrono: Fila (queue) para tarefas de análise, processadas por um worker em Python.
Análise de Conteúdo: Conversão de PDF para Markdown e análise via IA (bibliotecas como DocLing, e modelos de IA para detecção de plágio/IA e verificação de normas).
Segurança: RBAC para controle de acessos.

## Notas de Implementação

Certifique-se de que o sistema lide com erros de upload e valide os formatos de arquivos (apenas PDF para relatórios).
A divisão de grupos deve ser aleatória ou baseada em critérios configuráveis para evitar viés.
Integre APIs de IA para detecção de conteúdo gerado por IA (ex: ferramentas como GPTZero ou similares).
Para normas ABNT, implemente verificadores personalizados para estrutura, citações, etc.
Monitore a fila e os workers para garantir escalabilidade e recuperação de falhas.
