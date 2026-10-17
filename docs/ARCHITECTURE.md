# Market Watch UI (Front End) Architecture

## Introduction

This codebase is structured around **Vertical Slice Architecture** guided by **Domain-Driven Design (DDD)** principles and the **Smart & Presentational (Container/Presenter) Component Pattern**.

The primary architectural goal is to maintain a scalable, maintainable codebase that reflects business domains (Bounded Contexts) rather than technical layer monoliths. By establishing clear horizontal domain boundaries and top-down vertical layer rules, we minimize cross-domain coupling, lower cognitive load, and align our code structure with team organizational patterns (**Conway's Law**).

---

## Architecture Overview & Core Concepts

### 1. Vertical Slices (Domain Isolation)

The application is partitioned horizontally into distinct **Business Domains** (e.g., `users`, `auth`, `market-lists`). Each domain represents an independent bounded context containing all the code required to fulfill its specific business capabilities.

- **Domain Coupling**: Domains must remain isolated. Direct cross-domain imports are strictly prohibited. If domain `A` needs to import from domain `B`, that shared type must either live in the project `shared/` directory or be exposed via an explicit public API export. The same isolation applies to types _inside_ a domain: each layer owns the types it needs, and the `ui` and `data` layers never share them.
  - **`data/` owns the API-facing types.** It holds the API contracts (request/response DTOs) and the domain models, which are the front end's view of the domain entities exposed by the API. The domain models share the shape of the API's responses, so no translation happens inside `data/`.
  - **`ui/` owns the UI-facing types.** Form models and display-only view models are defined next to the presentational components that use them.
  - **`features/` owns the bridge.** A mapper in the feature translates between `ui/` types and `data/` types. It is the only layer permitted to import from both, so it is the only place the mapper can live.
  - **Why:** Because `ui` and `data` cannot import from each other, a shared interface between them is impossible by construction. Keeping the types separate means a backend contract change is absorbed in one mapper instead of spreading through templates and forms, and presentational components can be tested and reused with no knowledge of the API.
  - **Trade-off:** This costs additional interfaces and mapping code. We accept that cost because the boundary is enforced by tooling rather than by convention, so the coupling cannot creep back in unnoticed.
- **Organizational Alignment**: Slicing along domain boundaries prevents "broken window syndrome" and enables independent feature development with minimal cross-team coordination.

### 2. Smart & Presentational Component Pattern

Within the UI and Feature layers of each domain, components are strictly divided into two categories:

- **Smart Components (Container Components)**:
  - Located in `/features/`.
  - Application-specific orchestrators that drive user flows and execute use cases.
  - Inject domain services, state stores, and router parameters.
  - Map between `data/` types and `ui/` types, then pass state down to Presentational components via `input()` / Signals and listen to events via `output()`.
- **Presentational Components (Dumb Components)**:
  - Located in `/ui/`.
  - Pure UI renderers with zero knowledge of backend APIs, stores, or application state.
  - Communicate exclusively via `input()` data bindings and `output()` event emitters, typed with interfaces owned by the `ui/` layer.
  - Highly reusable within the domain (or across domains if placed in `shared/ui`).

### 3. Architecture Enforcement with Sheriff

The boundaries described in this document are not conventions to be remembered; they are rules the tooling checks. We use [**Sheriff** (`@softarc/sheriff`)](https://sheriff.softarc.io/docs/introduction) through its ESLint plugin. Sheriff derives tags from the folder structure (for example `domain:user` and `type:ui`) and checks every import against the dependency rules defined in [Dependency Rules & Boundaries](#dependency-rules--boundaries).

**What a violation looks like.** When an import breaks a rule, the editor flags it immediately, on the import line itself. This example is a `data` file importing a form model from `ui`:

![Sheriff dependency-rule error: a file in `user-address/data/` importing `IAddressSubmissionForm` from `user-address/ui/`](Sheriff-enforcement-sample.png)

**How to read it.**

- The first line names the two folders involved: the file doing the importing (`data/`) and the module it tried to reach (`ui/address-submission-form`).
- The second line states the rule that was broken: the importing layer's tag (`type: data`) has no clearance for the target's tags (`domain: user, type: ui`).
- The rule identifier, `@softarc/sheriff/dependency-rule`, tells you this is an architecture violation rather than a style or type error.

**How to fix it.** Do not move the import somewhere it happens to pass. Ask why the layer wanted the type. In this example, an API contract referenced a UI form interface because the form's shape was being reused as the request body. The fix is to give each layer its own interface and let the feature's mapper translate between them (see [Type Ownership & Mapping](#1-vertical-slices-domain-isolation)).

**How it behaves in production.** The same rule that flags the line in the editor is part of the lint check, and Sheriff's CLI can verify the same rules outside the editor. When lint runs in the pipeline, a violation fails the check, so a boundary-breaking change cannot be merged. Editor feedback catches the mistake while it is being typed; the pipeline guarantees it cannot reach the main branch.

---

## Directory & Folder Structure

The [Sheriff documentation](https://sheriff.softarc.io/docs/module_boundaries) recommends barrel-less modules because they optimize tree-shaking, so please do well not to create an `index.ts` file anywhere inside a domain slice.

Below is the standard folder hierarchy for a domain slice (using `users` as an example):

```text
src/app/domains/users/
├── data/                            <-- Domain State, API Communication & Contracts
│   ├── api/
│   │   └── user-api.service.ts      <-- Raw HttpClient calls
│   ├── models/
│   │   ├── user.model.ts            <-- Domain models (front end's view of the API's domain entities)
│   │   └── user-api.contracts.ts    <-- Request/Response DTOs
│   ├── store/
│   │   └── user.store.ts            <-- Signal Store / State Management
│   └── user.service.ts              <-- Domain Data Service (Facade/Orchestrator)
│
├── features/                        <-- Smart / Container Components (Use Cases)
│   ├── user-registration/
│   │   ├── user-registration.component.ts  <-- Smart component (injects user.store/service)
│   │   └── user-registration.mapper.ts     <-- UI form model -> request DTO (pure functions)
│   └── user-profile/
│       ├── user-profile.component.ts       <-- Smart component
│       └── user-profile.mapper.ts          <-- Domain model -> UI view model
│
├── ui/                              <-- Presentational / Dumb Components
│   ├── user-registration-form/
│   │   ├── user-registration-form.component.ts  <-- Pure UI component (input()/output())
│   │   └── user-form.model.ts                 <-- UI-owned form model
│   └── user-card/
│       └── user-card.component.ts             <-- Pure display component
│
└── utils/                           <-- Pure Helper Functions & Utilities
    ├── user-validators.ts           <-- Custom Reactive Form / Signal validators
    └── user-formatting.pipe.ts      <-- Pure UI display pipes
```

---

## Layer Responsibilities

### 1. Features Layer (`/features/`)

- **Responsibility**: Serves as the entry point for domain use cases and page views, and as the bridge between the `ui/` and `data/` type systems.
- **Contains**: Smart components, route wrappers, layout orchestrators, and the mappers between `ui/` types and `data/` types.
- **Rules**:
  - May inject state stores and data services.
  - Must **not** contain raw template-heavy presentation logic; delegate template structures to `/ui/`.
  - Non-reusable outside its specific feature flow.
  - Mappers between `ui/` types and `data/` types live here, as pure functions beside the smart component that uses them. **Why:** `features` is the only layer allowed to import from both `ui` and `data`, and `utils` cannot host them because it may not import from either. Pure functions keep them trivial to unit test.
  - A mapper is scoped to its feature. Features may not import from one another, so a mapper needed by two features is either duplicated or, if it is domain-neutral, promoted to `shared/`.

### 2. UI Layer (`/ui/`)

- **Responsibility**: Renders DOM structures, styling, and user interaction mechanics.
- **Contains**: Presentational components, UI control directives, and UI-owned models (form models and display-only view models).
- **Rules**:
  - Must **not** inject services, stores, or HTTP clients.
  - Receives data via `input()` signals and emits actions via `output()`.
  - Defines and owns the interfaces its inputs and outputs use. It never imports types from `data/`. **Why:** this is what keeps a presentational component reusable and testable without any knowledge of the API. Reusable components in `shared/ui` follow the same rule.

### 3. Data Layer (`/data/`)

- **Responsibility**: Manages domain state, API communication, persistence, and data transformation.
- **Contains**: Signal stores, HTTP API services, domain models, API request/response DTOs, and facade services.
- **Rules**:
  - Owns all data fetch, state mutation, and API contract definitions.
  - Encapsulates state management (e.g., NgRx Signal Store or RxJS data services).
  - Never references `ui/` types, including form models, even when their shape happens to match a request body.

### 4. Utils Layer (`/utils/`)

- **Responsibility**: Provides pure, side-effect-free helper utilities.
- **Contains**: Custom form validators, pipes, pure mapping utilities, date/string formatters.
- **Rules**:
  - Must be completely stateless and side-effect free.
  - Cannot import from higher layers (`features`, `ui`, or `data`).

---

## Dependency Rules & Boundaries

Our architecture enforces two strict boundary dimensions: **Horizontal (Domain)** and **Vertical (Layer)**.

```text
                        ┌────────────────────────┐
                        │     features Layer     │ (Smart Components / Use Cases / Mappers)
                        └───────────┬────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  │ Imports Allowed                   │ Imports Allowed
                  ▼                                   ▼
        ┌──────────────────┐                ┌──────────────────┐
        │     ui Layer     │                │    data Layer    │
        │(Dumb Components) │                │(Stores/API/DTOs) │
        └─────────┬────────┘                └─────────┬────────┘
                  │                                   │
                  │ Imports Allowed                   │ Imports Allowed
                  └─────────────────┬─────────────────┘
                                    ▼
                        ┌────────────────────────┐
                        │      utils Layer       │ (Pure Helpers / Validators)
                        └───────────┬────────────┘
```

Note that there is deliberately **no arrow between `ui` and `data`**. They are peers.

### 1. Horizontal Rules (Domain Boundaries)

- **Isolation**: `domains/users` cannot import directly from `domains/markets`.
- **Cross-Domain Communication**: If domain `A` requires data or components from domain `B`, that shared functionality must be placed in the [global `shared/` directory](../projects/market-watch-frontend/src/app/shared/) or domain `B` must explicitly export it via a public API.
- **Enforcement**: Enforced automatically at lint time via **Sheriff**, in the editor and in the pipeline (see [Architecture Enforcement with Sheriff](#3-architecture-enforcement-with-sheriff)).

### 2. Vertical Rules (Layer Hierarchy)

Dependencies within a domain slice flow top-down:

1. `features` can import from: `ui/`, `data/`, `utils/`, and `shared/`.
2. `ui` can import from: `utils/`, and `shared/`. **`ui` must NEVER import from `features/` or `data/`**.
3. `data` can import from: `utils/` and `shared/`. **`data` must NEVER import from `ui/` or `features/`**.
4. `utils` can import from: `shared/utils/`. **`utils` must NEVER import from `features/`, `ui/`, or `data/`**.
5. **`ui` and `data` are peers.** Neither may import from the other, in either direction. **Why:** this is what allows a presentational component to be reused or replaced without touching API code, and the reverse. The consequence is that `ui/` and `data/` each define their own types, and `features/` is the only place they meet (see [Domain Coupling](#1-vertical-slices-domain-isolation)).

---

## End-to-End Execution Workflow

Below is the standard data lifecycle for a feature interaction (e.g., User Registration). The types change shape as the data crosses each boundary:

`UI form model` ⇄ _(feature mapper)_ ⇄ `data types (request DTO / domain model)`

1. **User Action**: The user submits the form in `UserRegistrationFormComponent` in `/ui/`.
2. **Event Emission**: The presentational component emits an `output()` event with the UI-owned form model to `UserRegistrationComponent` in `/features/`.
3. **Mapping & Use Case Orchestration**: The smart component maps the form model to the request DTO using the feature's mapper, then invokes `UserStore.registerUser(payload)` or `UserService.register(payload)`. Either one can live in `/data/`.
4. **Data & HTTP Request**: The store or service executes an `HttpClient` POST using contract DTOs. The response shares the shape of the domain model, so no further translation happens inside `/data/`.
5. **State Mutation & Reactive Flow**: The API response updates the Signal Store state (`/data/store/`).
6. **UI Render**: `UserRegistrationComponent` reads the updated signals, maps domain models to UI view models where the presentational components need a different shape, and passes them down through `input()`. Change detection then updates the presentational components in `/ui/`.

---

## Comparison: Vertical Slice vs. Traditional MVC / Layered Architecture

| Architectural Concern           | Traditional Layered / MVC                                                       | Vertical Slice DDD Architecture (Our Standard)                                    |
| :------------------------------ | :------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------- |
| **Code Organization**           | Technical layers (`/components`, `/services`, `/models`)                        | Business Domains (`/users`, `/auth`, `/markets`)                                  |
| **Impact of Business Change**   | Changes ripple across multiple global layer folders                             | Changes are localized within a single vertical domain slice                       |
| **Cognitive Load**              | High; developers must navigate the entire codebase                              | Low; developers focus exclusively on the relevant domain slice                    |
| **Type Sharing Between Layers** | A single shared model is typically reused by components, services and API calls | Each layer owns its types; explicit mappers in `features/` bridge `ui` and `data` |
| **Boundary Enforcement**        | Difficult; tight coupling across features easily occurs                         | Automated via Sheriff                                                             |

---

## Documentation Navigation

- [Home](../README.md)
- [Contributing](./CONTRIBUTING.md)

> Architecture - You are here
