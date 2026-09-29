---
title: 'Why I started building fintech projects'
description: 'How simulation, data tools, and interface work led me toward financial software, and what I am learning through prototypes.'
pubDate: '2025-11-22'
tags: ['fintech', 'career', 'data', 'engineering']
---

I started as a generalist. I built web apps, visualized Markov processes, and experimented with reinforcement learning in the browser. The projects I kept returning to involved decisions under uncertainty: what happens next, what can go wrong, and how much confidence should I put in a result?

That pulled me toward fintech. Payments, credit, and markets give those questions concrete consequences. A system has to account for money, explain its decisions, and recover when something fails.

## What carries over

My earlier projects gave me useful practice, though financial models bring assumptions I still need to learn.

| Experience                        | Where I want to apply it                              |
| --------------------------------- | ----------------------------------------------------- |
| Simulating states and transitions | Credit scenarios and cash-flow models                 |
| Cleaning and validating data      | Risk reports and internal analytics                   |
| Visualizing distributions         | Showing uncertainty, drawdowns, and stress results    |
| Building interfaces               | Making fees, forecasts, and model assumptions legible |

A Markov simulator doesn't make me a credit-risk expert. It does give me a way to ask better questions about a model: which transitions are assumed, where the data came from, and how the result changes when an assumption moves.

## What I'm building

I'm working on prototypes in three areas:

- Portfolio dashboards that show returns, drawdowns, and stress scenarios.
- Simulations of cash flows, defaults, and strategy performance across many possible paths.
- APIs for pricing, risk scoring, and reporting, with documented inputs and outputs.

These are learning projects. I'm using them to work through choices such as how much precision a simulation needs, how to explain a result, and which details an interface must expose.

## Learning the domain

Alongside the code, I'm studying time value of money, fixed income, risk measures, and portfolio theory. I also read system failures and operational case studies. They force me to think beyond the model: what happens when data is late, an upstream service fails, or an operator needs to correct a mistake?

I'm learning about identity checks, financial-crime controls, capital requirements, and privacy as constraints on system design. I want to understand the questions product and risk teams ask before deciding what to build.

## Next projects

I want to take a prototype through the full path from raw data to a model, an API, and a usable interface. Credit, payments, and market microstructure are the areas I want to explore next. I'll write about the assumptions and failures as well as the parts that work.
