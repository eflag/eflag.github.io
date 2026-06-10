+++
title = "Por dentro dos nossos assessments: SAMM, DSOMM e OWASP GenAI"
description = "Os três frameworks abertos que sustentam nossos diagnósticos de maturidade e como eles viram score, gaps e um roadmap que seu time acompanha."
date = 2026-06-09T10:00:00-03:00
author = "Fernando Guisso"
category = "Diagnóstico"
tags = ["samm", "dsomm", "owasp", "maturidade"]
+++

Pentest mostra onde dói hoje. Assessment de maturidade mostra por que continua doendo. Um encontra as vulnerabilidades que existem agora; o outro mede a capacidade do time de evitar que elas voltem a aparecer. Os dois se complementam, mas resolvem perguntas diferentes.

Quando a gente desenha um assessment, não inventa framework proprietário. Usamos frameworks abertos, mantidos pela comunidade, que qualquer pessoa pode ler e auditar. O nosso trabalho está em aplicá-los com critério, cruzar as evidências e transformar o resultado em um plano que a engenharia consegue executar. Este artigo apresenta os três pilares: OWASP SAMM, OWASP DSOMM e o OWASP GenAI Security Project.

## Por que medir maturidade

Maturidade é capacidade repetível. Um time pode corrigir todas as vulnerabilidades do último pentest e continuar imaturo, porque o processo que gerou aquelas vulnerabilidades segue intacto. Medir maturidade é responder três perguntas:

1. **Onde estamos?** Quais práticas de segurança existem de fato, com que profundidade e cobertura.
2. **Onde precisamos chegar?** O nível-alvo não é "máximo em tudo". Depende do risco do negócio, do setor e da regulação.
3. **Qual o caminho?** A sequência de melhorias que fecha os gaps, separando quick wins de mudanças estruturais.

Todo assessment nosso entrega isso em três artefatos: relatório executivo, score de maturidade por prática e um roadmap vivo, que o time atualiza e acompanha evoluir, em vez de um PDF que envelhece na pasta.

## OWASP SAMM: o mapa do programa

O [Software Assurance Maturity Model](https://owaspsamm.org/) é o framework que usamos para medir o programa de AppSec como um todo. Ele organiza a segurança de software em 5 funções de negócio, cada uma com 3 práticas, totalizando 15 práticas:

| Função | Práticas |
|--------|----------|
| Governance | Strategy & Metrics · Policy & Compliance · Education & Guidance |
| Design | Threat Assessment · Security Requirements · Security Architecture |
| Implementation | Secure Build · Secure Deployment · Defect Management |
| Verification | Architecture Assessment · Requirements-driven Testing · Security Testing |
| Operations | Incident Management · Environment Management · Operational Management |

Cada prática é avaliada em 3 níveis de maturidade, e o resultado é um score de 0 a 3 por prática. O que faz o SAMM funcionar bem como base de diagnóstico:

- **É mensurável.** As perguntas de avaliação são públicas e estruturadas, então o score de hoje é comparável com o score da próxima rodada.
- **É prescritivo na medida certa.** Cada nível descreve atividades concretas, não aspirações. Sair do nível 1 para o 2 em Secure Build tem definição clara.
- **Aceita nível-alvo por contexto.** Uma fintech regulada e uma startup B2B no primeiro ano não precisam do mesmo alvo. O gap é medido contra o alvo certo, não contra a perfeição.

O SAMM responde "como está o programa". A limitação dele é a altitude: ele enxerga o processo, mas não desce até a pipeline.

## DSOMM: a engenharia no chão de fábrica

O [DevSecOps Maturity Model](https://dsomm.owasp.org/) completa o SAMM exatamente onde ele para. Enquanto o SAMM pergunta "existe processo de build seguro", o DSOMM pergunta o que está implementado de verdade: os artefatos são assinados? As imagens de container têm scan? Os segredos estão fora do repositório? Há quanto tempo aquela dependência crítica está desatualizada?

O DSOMM organiza atividades concretas de engenharia em dimensões como build e deployment, cultura e organização, implementação, coleta de informação e teste e verificação, com níveis progressivos de profundidade. E mantém mapeamentos para SAMM e ISO 27001, o que permite cruzar os dois diagnósticos sem retrabalho.

Na prática, a gente usa o DSOMM para ancorar as respostas do SAMM em evidência. Quando o time diz "temos SAST na pipeline", o DSOMM transforma a frase em perguntas verificáveis: em quais repositórios, bloqueando o quê, com qual taxa de falso positivo tolerada, tratada por quem. É a diferença entre um assessment de questionário e um assessment de engenharia.

## OWASP GenAI: a camada nova

Para o AI Security Maturity Assessment, a base é o [OWASP GenAI Security Project](https://genai.owasp.org/), que reúne o material mais maduro disponível sobre segurança de aplicações com IA generativa. Três recursos do projeto sustentam o nosso diagnóstico:

- **O [Top 10 para aplicações LLM](https://genai.owasp.org/llm-top-10/)** funciona como taxonomia de risco: prompt injection, vazamento de informação sensível, supply chain de modelos, output sem validação, excesso de agência, entre outros. É contra essa lista que avaliamos os fluxos com LLM do cliente. Escrevemos uma introdução prática a esses riscos em [Os dois tipos de fraqueza da era da IA](/blog/fraquezas-era-ia/).
- **O checklist de governança e segurança para LLMs**, voltado a CISOs, cobre o lado organizacional: inventário de uso de IA, políticas de uso de copilots, gestão de fornecedores de modelo, privacidade e conformidade.
- **Os guias de aplicações agênticas e red teaming**, mais recentes, orientam a avaliação de sistemas onde a IA tem ferramentas e autonomia, que é onde o risco cresce mais rápido.

A partir desses materiais, o assessment de IA mede dimensões que um SAMM clássico não enxerga: o time sabe quais fluxos usam LLM e com quais dados? Existem guardrails fora do modelo ou a defesa é só o system prompt? A cadeia de suprimentos de modelos e MCPs tem o mesmo controle que a de pacotes? Output de modelo é tratado como dado não confiável? Há limites de agência e de consumo?

## Para fechar

Frameworks abertos são o motivo de a gente conseguir publicar este artigo sem perder nada: a metodologia é pública por design, e o valor está na aplicação criteriosa, no cruzamento das evidências e na execução do plano. Se quiser saber qual seria o score do seu programa de AppSec, ou o quão pronto seu time está para construir com IA, [fale com a gente](mailto:contato@eflag.io). O diagnóstico é o primeiro passo do ciclo.
