# Quiz Game

## Description

This project is a modern web application built with Deno for the backend and ETA for the frontend.
It includes a suite of unit tests, integration tests, and end-to-end tests, all of which are orchestrated
with Docker Compose for a simplified development and production environment.

## Live Demo

The project is live at: [drill-and-practice.deno.dev](https://drill-and-practice.deno.dev/)
---

## Main features

- **Backend**: Developed with [Deno](https://deno.land/), secure and modern.
- **Frontend**: Build with [ETA](https://eta.js.org/), a fast templating engine.
- **Tests**:
  - Unit and integration tests with `deno test`.
  - End-to-end testing with [Playwright](https://playwright.dev/).
- **Orchestration**: Docker Compose for easy deployment.

---

## Project Structure

```
📁 project-root
├── 📁 drill-and-practice       # Source code
├   ├─ 📁 views                 # Frontend File ETA
├   └─ 📁 tests                 # Unit, Integration Tests
├── 📁 flyway                   # Migration Database
├── 📁 e2e-tests                # Tests E2E
├── 📄 docker-compose.yml  # Configuration Docker Compose
└── 📄 README.md     # Documentation
```

---

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.
- [Deno](https://deno.land/) (optional for local development).
- [Node.js](https://nodejs.org/) (for Playwright if necessary).

---

## Installation and use

1. Clone this repository:

   ```bash
   git clone https://github.com/B9R9/quiz-game.git <Folder Name>
   cd <Folder Name>
   ```

2. Start the containers with Docker Compose:

   ```bash
   docker-compose up --build
   ```

3. Access the application in your browser at `http://localhost:7777`.

---

## Tests

### **Unit and integration tests**

Start testing with Deno:

```bash
deno test --allow-net --allow-read
```

with Docker compose:

```bash
docker compose run <unit-test || integration-test>
```

### **End-to-end testing**

Make sure the application is running, then run tests with Playwright:

```bash
npx playwright test
```

with Docker compose:

```bash
docker compose run e2e-tests
```

---

### CI/CD Workflows

This project integrates CI/CD workflows to automate testing and deployment processes. The workflows are defined in the `.github/workflows` directory.

#### Available Workflows

1. **Deploy**

   - Manages deployment to Deno Deploy.
   - This workflow is triggered only on the `deploy` branch and only if the unit, integration, and end-to-end tests pass successfully.

2. **Playwright Test**

   - Executes end-to-end tests with Playwright.
   - This workflow is triggered on **push** or **pull request** events for the `main` and `deploy` branches.

3. **Integration and Unit Test**
   - Executes unit and integration tests with `deno test`.
   - This workflow is triggered on **push** or **pull request** events for the `main` and `deploy` branches.

#### Workflow Triggers

| Workflow                      | Branches         | Triggering Events    | Additional Conditions             |
| ----------------------------- | ---------------- | -------------------- | --------------------------------- |
| **Deploy**                    | `deploy`         | After a push         | All tests must pass successfully. |
| **Playwright Test**           | `main`, `deploy` | Push or Pull Request | None                              |
| **Integration and Unit Test** | `main`, `deploy` | Push or Pull Request | None                              |

---

## Show CI/CD status

![CI/CD](https://github.com/B9R9/quiz-game/actions/workflows/deploy.yml/badge.svg)
![TESTS](https://github.com/B9R9/quiz-game/actions/workflows/playwright.yml/badge.svg)
![UNIT-TESTS](https://github.com/B9R9/quiz-game/actions/workflows/test.yml/badge.svg)

---

## Contribute

1. Fork the project.
2. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your modifications, add tests if necessary.
4. Create a Pull Request.

---

## Technologies used

- **Backend**: Deno
- **Frontend**: ETA
- **Tests**: Deno, Playwright
- **Containerization**: Docker Compose

---

## Authors

- Baptiste - Lead developer.

---

## License

This project is under the MIT license.
