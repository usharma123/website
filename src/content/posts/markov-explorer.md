---
title: 'Building MarkovExplorer to visualize and optimize MDPs'
description: 'A browser tool for editing Markov decision processes, running simulations, and comparing policies.'
pubDate: '2025-09-04'
tags:
  [
    'reinforcement-learning',
    'web-development',
    'visualization',
    'nextjs',
    'typescript',
    'mdp',
  ]
---

A [Veritasium video](https://www.youtube.com/watch?v=KZeIEiBrT_w&t=487s) sent me down a Markov-chain rabbit hole. I wanted to change a transition probability and see what happened, rather than work through each example on paper. That grew into MarkovExplorer, a browser app for building and simulating Markov decision processes.

## Build a model, then test a policy

The editor lets me create states, actions, rewards, and transitions. A graph shows their connections and the interface flags invalid configurations.

Once the model is set up, I can run Monte Carlo episodes and inspect reward distributions, terminal states, action usage, and common paths. The optimizer then tries value iteration, policy iteration, Q-learning, or Monte Carlo policy search. The interface compares the resulting policy with the baseline.

Charts make the differences easier to inspect. An AI interpreter also summarizes trends, but the simulation results remain available to check against its explanation.

## Project structure

I built this version with Next.js 14 and TypeScript. The frontend lives in `mdp-viz`:

| Directory         | Contents                             |
| ----------------- | ------------------------------------ |
| `src/app/`        | Next.js routes                       |
| `src/components/` | Graphs, configurator, and results UI |
| `src/lib/`        | Simulation and optimization logic    |
| `src/types/`      | Shared TypeScript definitions        |

React and Tailwind handle the interface, Chart.js and Recharts draw the charts, and `vis-network` renders the state graph. Zod validates model inputs at runtime.

## Simulation

`lib/sim.ts` runs episodes with a configurable starting state, episode count, and step limit. It records cumulative reward, path length, state transitions, and action frequencies. Those records feed the charts and summary statistics.

The step limit matters for models that can loop without reaching a terminal state. A run that stops at that limit should be interpreted differently from one that finishes normally.

## Optimization

`lib/optimizer.ts` tries the supported planning and learning methods, then evaluates their policies with fresh simulations. `AgentOptimizer.tsx` shows progress and the final comparison.

Those extra runs help check how a policy behaves under the configured model. They don't establish that the model describes the real world, and a confidence score needs to be read alongside the episode count and variation in outcomes.

## Making experiments easier

Presets let me revisit a model without entering every transition again. Immediate validation catches configuration mistakes before a simulation starts. The graph and result views let me move between the structure of a model and the behavior it produces.

The most useful part has been seeing how an apparently small change, such as a discount factor or transition probability, alters a policy. TypeScript catches mistakes in the implementation; runtime validation catches mistakes in the model data. Both are needed.

## What I want to add

I want better comparisons between theoretical and simulated results, richer policy comparisons, and model import and export. Multi-objective optimization and animated 3D trajectories are longer-term ideas.
