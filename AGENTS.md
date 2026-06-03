# AGENTS.md

## Project Overview
* The purpose of this repository is to provide an API that enables Zendesk agents to retrieve US Tax Court (USTC) IT asset information securely and efficiently.
* The API is implemented as an Azure Function App, deployed across three isolated environments:
  - Development (dev) - USTC facing
  - Testing (test) - Zendesk developer facing
  - Production (prod) - USTC and Zendesk agent facing
  Each environment is managed through its own Terraform workspace and state, ensuring strict separation and reproducibility.
* The codebase is primarily written in JavaScript (Node.js) and generally follows the clean architecture model to simplify maintenance and scaling.

## Build and Test Commands
### Install Dependencies
```bash
npm install
```

### Local Development
Run the Function App locally with the Azure Functions Core Tools:
```bash
npm start     # or: func start
```

### Linting
```bash
npm run lint
```

### Running Tests
```bash
npm test
```

## Code Style Guidelines
* **JavaScript Standard** — use modern ES6+ syntax.
* **Linting** — ESLint ruleset enforced before every commit.
* **File & Folder Structure**
  - `/azure-functions` for Function code
  - `/azure-functions/tests` for integration tests, unit tests are co-located with function code
  - `/terraform` for infrastructure
* **Naming Conventions**
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files/modules: camelCase.js
  - Functions: descriptive, verb‑based names

## Testing Instructions
1. **Unit Tests** (no external dependencies)
   ```bash
   npm test
   ```

2. **Integration Tests** (require environment variables)
   `.env` variables stored as github secrets

3. **Manual Testing** using curl/Postman:
   ```bash
   curl http://localhost:7071/api/v1/assets/{assetId}
   ```

4. **Terraform Validation**
   ```bash
   terraform fmt -check
   terraform validate
   ```

## Security Considerations
* All requests must be authenticated (Azure Function keys or Azure AD depending on environment).
* Secrets must be stored in **Azure Key Vault** or **GitHub Secrets Vault**, never committed.
* Follow least-privilege access for all Terraform‑managed resources.
* Avoid logging any PII or sensitive asset information.
* Run `npm audit` regularly to detect vulnerable dependencies.
* Cannot commit or merge code on behalf of a user.
