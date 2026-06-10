+++
title = "Threat Modeling Express: o método que usamos nos nossos workshops"
description = "Como engajar engenharia e produto, mapear ativos críticos e sair de uma sessão de duas horas com ameaças, controles e backlog priorizado."
date = 2026-05-12T10:00:00-03:00
author = "Fernando Guisso"
category = "Metodologia"
tags = ["threat modeling", "devsecops", "appsec"]
+++

Scanner encontra vulnerabilidade. Threat modeling encontra ameaça. A diferença parece sutil, mas é ela que separa uma lista técnica de achados de uma conversa que o negócio entende e prioriza.

Este artigo documenta o Threat Modeling Express, o formato ágil que usamos nos nossos workshops com times de produto e engenharia. Não tem segredo aqui: é o método completo, do engajamento do time até o backlog priorizado. Publicamos porque acreditamos que metodologia boa circula, e porque time que entende o método chega no workshop pronto para trabalhar.

## O que é threat modeling

Threat modeling é o processo de identificar ameaças, vulnerabilidades e contramedidas em um sistema, pensando como um atacante pensaria. Enquanto ferramentas de segurança detectam falhas técnicas pontuais, a modelagem de ameaças olha o sistema inteiro e conecta cada risco ao impacto que ele causa no negócio.

Essa conexão com o negócio é o que faz a prática valer o investimento. É mais fácil um executivo entender que existe risco de perda financeira por manipulação de dados do que entender que um Insecure Deserialization pode levar a um RCE. A ameaça fala a língua de quem decide orçamento. A vulnerabilidade fala a língua de quem corrige. Threat modeling traduz entre as duas.

## As metodologias tradicionais

O mercado consolidou várias abordagens ao longo dos anos, cada uma com seu foco:

- **[STRIDE](https://learn.microsoft.com/en-us/previous-versions/commerce-server/ee823878(v=cs.20))**: categorias de ameaça (spoofing, tampering, elevação de privilégio etc.), criada pela Microsoft em 1999.
- **[PASTA](https://www.wiley.com/en-us/Risk+Centric+Threat+Modeling%3A+Process+for+Attack+Simulation+and+Threat+Analysis-p-9780470500965)**: sete etapas que alinham objetivos de negócio com requisitos técnicos.
- **[Trike](https://www.iriusrisk.com/resources-blog/trike-threat-modeling-methodologies)**: ênfase em auditoria e gerenciamento de risco.
- **[VAST](https://www.threatmodeler.com/threat-modeling-methodologies-vast/)**: integrada ao DevOps, com diagramas de fluxo para modelagem ágil.

Todas funcionam. O problema é que, em times ágeis, processos longos morrem na segunda sprint. O Threat Modeling Express simplifica o processo tradicional para caber no ciclo de desenvolvimento: sessões curtas, colaborativas, que se repetem conforme o produto evolui. É a abordagem que o [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/) defende: valores e princípios acima de cerimônia.

## O processo em seis passos

### 1. Engajamento antes do diagrama

O workshop começa antes do workshop. Threat modeling só funciona quando o time de desenvolvimento participa de verdade, porque é ele que conhece o sistema. Engenheiros, designers e PMs precisam entender por que estão ali, e o papel de quem facilita é criar esse contexto, não impor processo.

> Meu papel como AppSec é fazer os devs brigarem por segurança, assim como hoje eles brigam pelo VS Code ser melhor que o Vim.

Quando o time briga por segurança, os controles definidos no fim da sessão viram backlog de verdade, não planilha esquecida.

### 2. Data flow

O primeiro artefato é o diagrama de fluxo de dados: por onde os dados entram, transitam e ficam em repouso. Quem desenha é o time, com a ferramenta que o time já usa. [Excalidraw](https://excalidraw.com/), [draw.io](https://draw.io), [Miro](https://miro.com/) ou [MermaidJS](http://mermaid.js.org/), tanto faz. O tempo da sessão é para modelar ameaças, não para aprender ferramenta nova.

Duas regras práticas:

- Foque nos fluxos principais. Dá para detalhar cada endpoint, mas numa abordagem express o objetivo é capturar os fluxos mais críticos.
- Restrinja o escopo ao que o time pode mudar. Mapear processos fora do controle direto da equipe gera ameaça sem dono.

<figure>
  <img src="/assets/blog/threat-modeling-sample.svg" alt="Diagrama de fluxo de dados com usuário, aplicação mobile, API e banco de dados" loading="lazy">
  <figcaption>Data flow de exemplo: usuário, aplicação, API e armazenamento, com os fluxos principais marcados.</figcaption>
</figure>

### 3. Ativos críticos

Com o fluxo desenhado, o time marca o que precisa de proteção extra. A pergunta é simples: se isso vazar ou for adulterado, qual o tamanho do estrago? A lista deve ficar curta, só com o que realmente exige controle específico.

<figure>
  <img src="/assets/blog/threat-modeling-assets.svg" alt="Data flow com ativos críticos A1, A2 e A3 anotados nos pontos onde os dados ficam em repouso" loading="lazy">
  <figcaption>Ativos críticos anotados no data flow (A1, A2, A3), nos pontos onde os dados ficam em repouso.</figcaption>
</figure>

Num sistema típico, os ativos que aparecem primeiro:

- **A1 · Token de sessão.** É o mecanismo de autenticação e autorização do usuário. Quem obtém o token age em nome do usuário sem restrição.
- **A2 · Dados pessoais.** Nome, CPF, dados sensíveis. Alvo comum de ataque e obrigação legal de proteção.
- **A3 · Credenciais de banco de dados.** Exposição compromete integridade e confidencialidade de tudo que está armazenado.

Anote onde cada ativo fica em repouso no diagrama. Se houver tempo, marque também os pontos de trânsito.

### 4. Atores de ameaça

Agora o time veste o chapéu do atacante. Antes de listar ameaças, vale definir quem ataca, porque cada ator tem motivação e capacidade diferentes, e isso muda quais ameaças fazem sentido para o seu produto:

- **Cibercriminosos**: ganho financeiro, ransomware, phishing.
- **Atores patrocinados por estados**: espionagem e sabotagem.
- **Hacktivistas**: causas sociais ou políticas.
- **Curiosos**: atacam por diversão ou aprendizado, e causam dano mesmo assim.
- **Insiders**: acesso privilegiado, intencional ou acidental.

E tem os atores que só aparecem quando o time conhece o próprio produto. No Brasil, fãs de reality show que organizam mutirões de voto são um ator de ameaça real: sistemas de votação da TV aberta processam [quase 3 milhões de votos por minuto](https://www.hcaptcha.com/post/globo-counts-nearly-3-million-votes-per-minute-with-hcaptcha-enterprise) em momentos de pico. Nenhum framework genérico teria listado esse ator. O time listou. Sobre como pensar atores fora do padrão, vale [esta palestra da OWASP Global AppSec 2023](https://owasp2023globalappsecwashin.sched.com/event/1M6Qh/the-threat-actors-we-forgot-to-model-profiling-socially-motivated-cyber-criminals).

### 5. Ameaças

Com os atores definidos, o time percorre o data flow perguntando: por onde esse ator atacaria esses ativos? Cada ameaça é registrada com uma nota de como foi identificada, porque é essa nota que permite reavaliar a ameaça quando a arquitetura mudar.

<figure>
  <img src="/assets/blog/threat-modeling-threats.svg" alt="Data flow com ameaças T1 a T5 marcadas nos pontos de ataque sobre os ativos" loading="lazy">
  <figcaption>Ameaças (T1 a T5) marcadas nos pontos do fluxo onde os ativos podem ser atacados.</figcaption>
</figure>

No nosso exemplo, cinco ameaças saíram da análise:

- **T1 · Interceptação de dados sensíveis.** Identificada ao analisar o fluxo entre cliente e servidor. Credenciais e dados pessoais em trânsito podem ser interceptados, principalmente se a comunicação não estiver criptografada de ponta a ponta, comprometendo a privacidade e a integridade dos dados.
- **T2 · Exposição de token de sessão.** O token é o mecanismo de autenticação, então qualquer falha que permita acesso não autorizado a ele resulta em sequestro de sessão: o invasor age no sistema em nome do usuário. Surgiu ao pensar em armazenamento inseguro no dispositivo e transmissão por canais vulneráveis.
- **T3 · Indisponibilidade de serviço.** Disponibilidade também é pilar de segurança. Ataques de negação de serviço ou sobrecarga de recursos tornam o sistema inacessível, e o impacto na experiência e na confiança do usuário é imediato, seja o ataque intencional ou falha técnica.
- **T4 · Exposição de credenciais.** Má configuração ou proteção inadequada das credenciais de banco e de serviços críticos dá ao atacante acesso direto aos dados. É uma ameaça que, além do dano próprio, serve de porta de entrada para outros ataques.
- **T5 · Acesso não autorizado a dados pessoais.** Surgiu da pergunta "quem consegue acessar dados pessoais sem permissão?". Falhas de controle de acesso ou vulnerabilidades exploráveis levam a violação de privacidade, consequência legal e perda de confiança.

Repare que cada ameaça aponta para um ativo do passo anterior e para um ponto concreto do fluxo. Ameaça genérica ("podem nos hackear") não vira controle; ameaça ancorada no diagrama vira.

### 6. Controles

Para cada ameaça, o time define controles técnicos ou processuais. Documente inclusive os que já existem: é isso que dá visão completa da defesa e permite verificar, depois, se o controle continua ativo e eficaz.

<figure>
  <img src="/assets/blog/threat-modeling-controls.svg" alt="Data flow completo com controles C1 a C6 ligados às ameaças que mitigam" loading="lazy">
  <figcaption>O modelo completo: controles (C1 a C6) ligados às ameaças que eles mitigam.</figcaption>
</figure>

Exemplos do que sai dessa etapa:

- **C1 · TLS pinning.** Contra interceptação man-in-the-middle: a aplicação só aceita certificados específicos e válidos.
- **C2 · Criptografia de dados sensíveis em trânsito.** Para que dado interceptado seja ilegível e, portanto, inútil.
- **C3 · Armazenamento seguro de tokens.** Keychain no iOS, Keystore no Android: áreas criptografadas que dificultam acesso não autorizado.
- **C4 · Rate limiting.** Limita solicitações por IP ou origem para sustentar disponibilidade e detectar acesso anômalo.
- **C5 · Gerenciamento de segredos.** AWS Secrets Manager ou HashiCorp Vault para credenciais, com rotação e monitoramento de acesso.
- **C6 · Controles de acesso granulares.** Menor privilégio: cada usuário ou processo acessa só o estritamente necessário.

Cada controle vira tarefa com dono no backlog. Sem isso, o workshop produz um diagrama bonito e nada muda.

## O que fica depois do workshop

O dataflow é o artefato mais visível, mas o valor real está nas anotações de ameaças e controles. Elas são a memória de segurança do produto: antecipam riscos das próximas funcionalidades e registram qual defesa protege o quê. Revisadas a cada mudança relevante de arquitetura, mantêm a segurança evoluindo junto com o sistema.

Para medir se a prática está funcionando, acompanhe ameaças identificadas e mitigadas por ciclo. Em times ágeis, a recomendação é modelar em incrementos pequenos, acompanhando cada funcionalidade nova, com profundidade ajustada à maturidade do time.

O desafio real costuma ser cultural, não técnico. Programas de security champions, sessões hands-on e a postura de facilitar em vez de policiar ajudam a transformar a sessão de threat modeling em hábito do time, não em auditoria trimestral.

## Para fechar

Threat modeling é das poucas práticas de segurança que melhora a comunicação entre engenharia e negócio em vez de criar atrito. Quanto mais cedo entra no ciclo de desenvolvimento, mais barato fica cada risco evitado.

É exatamente esse formato que a gente roda nos workshops de Threat Modeling da eFlag, incluindo fluxos com LLM e agentes. Se quiser ver o método aplicado ao seu produto, [fale com a gente](mailto:contato@eflag.io).

*Este artigo é uma versão revisada do [guia publicado pelo nosso fundador, Fernando Guisso](https://guisso.dev/blog/threat-modeling-intro/), que inclui também os slides da palestra e um mini game para praticar.*
