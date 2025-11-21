# Hospital Frontend Architecture

This project mirrors the clean, layered structure used in the previous CarParts WMS dashboard ([mhkhizil/warehouse-management-fe](https://github.com/mhkhizil/warehouse-management-fe)). The goal is to keep business logic isolated from presentation code so that domain rules can evolve without touching the UI layer.

## Layers

1. **Domain**
   - Entities describe the core objects in the hospital (patients, doctors, appointments).
   - Repository interfaces state how those entities can be retrieved or persisted.
   - Domain services declare high-level behaviours (e.g., patient intake workflows).

2. **Application**
   - DTOs are the shapes exposed to the presentation layer.
   - Application services orchestrate domain entities and repositories to fulfil use-cases.

3. **Infrastructure**
   - `api/HttpClient` wraps Axios with token handling.
   - Repository implementations call real HTTP endpoints (or fall back to mock data during bootstrap).
   - DI container wires concrete infrastructure to abstract interfaces.

4. **Presentation**
   - Hooks inside `core/presentation` expose typed application services to React components.
   - UI components live under `src/components` and consume those hooks.

## Dependency Flow

```
Presentation -> Application -> Domain
Infrastructure -> Application -> Domain
```

Only the application layer depends on both the domain and the infrastructure. Domain code is completely isolated from framework-specific details.

## Why replicate the WMS layout?

- **Consistency**: Teams already familiar with the WMS repo can navigate this project instantly.
- **Replaceable Infrastructure**: HTTP clients or repositories can change without reworking hooks or components.
- **Testing**: Each layer can be mocked in isolation, enabling fast unit and integration tests.

> If you add a new hospital feature, start by modelling the entity & repository inside `core/domain`, then surface it through an application service and presentation hook before updating any UI.


