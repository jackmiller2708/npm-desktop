<h1 align="center">NPM Desktop</h1>
<h3 align="center">A functional, type-safe, and composable desktop GUI client for npm.</h3>
<div align="center">
  <a href="https://codecov.io/gh/jackmiller2708/npm-desktop"> 
    <img alt="Codecov (with branch)" src="https://img.shields.io/codecov/c/gh/jackmiller2708/npm-desktop/master?style=for-the-badge" />
  </a>
  <br />
  <img src="https://img.shields.io/badge/bun-282a36?style=for-the-badge&logo=bun&logoColor=fbf0df"/>
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E"/>
  <img src="https://img.shields.io/badge/Vitest-%236E9F18?style=for-the-badge&logo=Vitest&logoColor=%23fcd703">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9"/>
  <img src="https://img.shields.io/badge/biome-60a5fa?style=for-the-badge&logo=biome&logoColor=white"/>
</div>

**NPM Desktop** is a cross-platform Electron application powered by **Effect**, **React**, and **Vite** — designed to explore and manage npm packages in a fully reactive, type-safe, and functional way.

---

## 🏗️ Architecture Overview

The project is structured with a **clear separation of concerns**:

```
core/          → abstract interfaces and contracts (pure domain logic)
application/   → use-case composition and handler definition
infrastructure/→ concrete Effect + Electron runtime implementations
presentation/  → React UI (renderer)
shared/        → cross-layer schemas & IPC types
types/         → foundational type utilities
```
### 💡 Principles

- **Typed IPC:** All IPC channels are validated using `@effect/schema`.
- **Pure Core:** All side-effects (I/O, processes, registry calls) are modeled via Effect services.
- **Composable Layers:** Effect Layers define dependencies and can be composed for tests or real runs.

---

## ⚙️ Tech Stack

| Layer   | Tool                                   | Purpose                                   |
| ------- | -------------------------------------- | ----------------------------------------- |
| Core    | [Effect](https://effect.website)       | Functional effects & dependency injection |
| UI      | [React + Vite](https://vitejs.dev)     | Modern frontend with hot reload           |
| Runtime | [Electron](https://www.electronjs.org) | Cross-platform desktop runtime            |
| Testing | [Vitest](https://vitest.dev)           | Unit & integration testing                |
| Linting | [BiomeJS](https://biomejs.dev)         | Unified linter and formatter              |

---

## 🚀 Setup

```bash
# clone the repo
git clone https://github.com/jackmiller2708/npm-desktop.git
cd npm-desktop

# install dependencies
bun install

# start development (Electron + Vite with HMR)
bun start
```
> Note: Ensure you have Bun latest and Node 22.x installed.

---

## 🧠 Development Workflow

### 🧩 Adding a New IPC Handler Namespace

Each IPC namespace is a self-contained Effect module defining handlers, schemas, and runtime logic.

1. Define the handlers (namespace) schema in `/application/ipc/*`.
2. Write unit tests under the same implementation file with the convention `{ImplementationFileName}.test.ts`.
3. Register the handlers in `/shared/ipc/registry.ts`.
4. Connect it to the UI via the preload bridge.

> 🧪 Write unit tests first following [Test-Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development).

### Example IPC Contract

```ts
import { NpmNamespace } from "@application/ipc/npm";
import { WindowNamespace } from "@application/ipc/window";
import { Schema } from "effect";

export const IPCRegistry = Schema.Struct({
	npm: NpmNamespace,
	window: WindowNamespace,
});

export type IPCRegistry = Schema.Schema.Type<typeof IPCRegistry>;

```
> The `IPCRegistry` schema is the single source of truth for all typed IPC channels between Electron and the renderer.

---

## 🧪 Testing

All tests use Vitest ([v8 provider](https://vitest.dev/guide/coverage.html#v8-provider)).
> Note: Vitest’s V8 coverage provider currently runs only under Node, not Bun.

```bash
# run tests
npm test

# generate coverage report
npm run test:coverage
```
Tests for Effect services use mocked layers for pure, deterministic testing.

## 🎯 Project Goals

- [x] Model all side-effects through Effect.
- [x] Maintain a minimal and typed IPC layer.
- [x] Ensure high test coverage with Vitest.
- [x] Enforce consistent style via Biome.
- [x] Keep the architecture clean and composable.

## 🧰 Common Commands

| Command | Description |
|----------|-------------|
| `bun start` | Start Electron + Vite in development mode |
| `bun run build` | Build for production |
| `npm test` | Run tests |
| `npm run test:coverage` | Generate coverage report |
| `bun run lint` | Run Biome lint checks |
| `bun run format` | Format codebase |