+++
title = "Inside our assessments: SAMM, DSOMM and OWASP GenAI"
description = "The three open frameworks behind our maturity diagnostics and how they become a score, gaps and a roadmap your team actually tracks."
date = 2026-06-09T10:00:00-03:00
author = "Fernando Guisso"
category = "Diagnosis"
tags = ["samm", "dsomm", "owasp", "maturity"]
slug = "inside-our-assessments"
+++

A pentest shows where it hurts today. A maturity assessment shows why it keeps hurting. One finds the vulnerabilities that exist right now; the other measures the team's capacity to stop them from coming back. They complement each other, but they answer different questions.

When we design an assessment, we do not invent a proprietary framework. We use open, community-maintained frameworks that anyone can read and audit. Our work is in applying them with judgment, cross-checking the evidence and turning the result into a plan engineering can execute. This article presents the three pillars: OWASP SAMM, OWASP DSOMM and the OWASP GenAI Security Project.

## Why measure maturity

Maturity is repeatable capability. A team can fix every vulnerability from the last pentest and still be immature, because the process that produced those vulnerabilities remains intact. Measuring maturity means answering three questions:

1. **Where are we?** Which security practices actually exist, at what depth and coverage.
2. **Where do we need to be?** The target level is not "maximum everywhere". It depends on business risk, industry and regulation.
3. **What is the path?** The sequence of improvements that closes the gaps, separating quick wins from structural changes.

Every assessment we run delivers this in three artifacts: an executive report, a maturity score per practice and a living roadmap that the team updates and watches evolve, instead of a PDF aging in a folder.

## OWASP SAMM: the program map

The [Software Assurance Maturity Model](https://owaspsamm.org/) is the framework we use to measure the AppSec program as a whole. It organizes software security into 5 business functions, each with 3 practices, for a total of 15:

| Function | Practices |
|----------|-----------|
| Governance | Strategy & Metrics · Policy & Compliance · Education & Guidance |
| Design | Threat Assessment · Security Requirements · Security Architecture |
| Implementation | Secure Build · Secure Deployment · Defect Management |
| Verification | Architecture Assessment · Requirements-driven Testing · Security Testing |
| Operations | Incident Management · Environment Management · Operational Management |

Each practice is evaluated across 3 maturity levels, producing a score from 0 to 3 per practice. What makes SAMM work well as a diagnostic base:

- **It is measurable.** The assessment questions are public and structured, so today's score is comparable with the next round's.
- **It is prescriptive in the right dose.** Each level describes concrete activities, not aspirations. Going from level 1 to 2 in Secure Build has a clear definition.
- **It accepts a context-specific target.** A regulated fintech and a first-year B2B startup do not need the same target. The gap is measured against the right target, not against perfection.

SAMM answers "how is the program doing". Its limitation is altitude: it sees the process, but it does not descend into the pipeline.

## DSOMM: engineering on the shop floor

The [DevSecOps Maturity Model](https://dsomm.owasp.org/) picks up exactly where SAMM stops. While SAMM asks "is there a secure build process", DSOMM asks what is actually implemented: are artifacts signed? Are container images scanned? Are secrets out of the repository? How long has that critical dependency been outdated?

DSOMM organizes concrete engineering activities into dimensions such as build and deployment, culture and organization, implementation, information gathering, and test and verification, with progressive depth levels. And it maintains mappings to SAMM and ISO 27001, which lets us cross both diagnostics without rework.

In practice, we use DSOMM to anchor SAMM answers in evidence. When the team says "we have SAST in the pipeline", DSOMM turns that sentence into verifiable questions: in which repositories, blocking what, with what tolerated false positive rate, handled by whom. It is the difference between a questionnaire assessment and an engineering assessment.

## OWASP GenAI: the new layer

For the AI Security Maturity Assessment, the foundation is the [OWASP GenAI Security Project](https://genai.owasp.org/), which gathers the most mature material available on securing generative AI applications. Three of the project's resources back our diagnostic:

- **The [Top 10 for LLM applications](https://genai.owasp.org/llm-top-10/)** works as the risk taxonomy: prompt injection, sensitive information disclosure, model supply chain, unvalidated output, excessive agency, among others. This is the list we evaluate the client's LLM flows against. We wrote a practical introduction to these risks in [The two kinds of weakness in the AI era](/en/blog/ai-era-weaknesses/).
- **The LLM governance and security checklist**, aimed at CISOs, covers the organizational side: an inventory of AI usage, copilot usage policies, model vendor management, privacy and compliance.
- **The agentic applications and red teaming guides**, more recent, drive the evaluation of systems where the AI has tools and autonomy, which is where risk grows fastest.

From that material, the AI assessment measures dimensions a classic SAMM cannot see: does the team know which flows use LLMs and with what data? Are there guardrails outside the model, or is the system prompt the only defense? Does the supply chain of models and MCPs get the same control as the package supply chain? Is model output treated as untrusted data? Are there agency and consumption limits?

## Closing

Open frameworks are the reason we can publish this article without losing anything: the methodology is public by design, and the value lies in careful application, evidence cross-checking and plan execution. If you want to know what your AppSec program would score, or how ready your team is to build with AI, [talk to us](mailto:contato@eflag.io). The diagnosis is the first step of the cycle.
