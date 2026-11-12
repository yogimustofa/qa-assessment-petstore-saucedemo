# QA Engineer Technical Assessment: API & UI Automation Testing

This repository contains the complete solution for the **Junior to Medior QA Engineer Take-Home Test**, covering **Manual API Testing**, **API Automation**, and **UI Automation** with modern industry-standard practices.

---

## 📋 Table of Contents
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Task 1: Manual API Testing & Bug Reports](#-task-1-manual-api-testing--bug-reports)
- [Task 2: API Automation Testing](#-task-2-api-automation-testing)
- [Task 3: UI Automation Testing (POM)](#-task-3-ui-automation-testing-pom)
- [Installation & Setup](#-installation--setup)
- [Running The Tests](#-running-the-tests)
- [Test Reports](#-test-reports)
- [Bug Documentation](#-bug-documentation)

---

## 🛠 Architecture & Tech Stack

| Component | Tool / Technology |
|---|---|
| **Language** | JavaScript (Node.js ES6+) |
| **Automation Framework** | [Playwright Test](https://playwright.dev/) (`@playwright/test`) |
| **API Testing Engine** | Playwright APIRequestContext & HTTP Client |
| **UI Design Pattern** | Page Object Model (POM) |
| **Reporting** | Playwright HTML Reporter, JSON, & Formatted Excel Spreadsheet |
| **Target Under Test** | - API: [Swagger Petstore v2](https://petstore.swagger.io/)<br>- UI: [SauceDemo](https://www.saucedemo.com/) |

---

## 📂 Project Structure

```text
qa-assessment-petstore-saucedemo/
├── QA_Assessment_TestCases_and_BugReport.xlsx   <-- Comprehensive Excel (Test Cases, Execution Report, Bugs)
├── package.json                                 <-- Project dependencies & scripts
├── playwright.config.js                         <-- Playwright configuration (projects, timeouts, reporters)
├── pages/                                       <-- Page Object Model (POM) classes
│   ├── LoginPage.js                             <-- SauceDemo Login page locators & actions
│   ├── InventoryPage.js                         <-- Products page locators & cart actions
│   ├── CartPage.js                              <-- Shopping cart page & checkout trigger
│   └── CheckoutPage.js                          <-- Multi-step checkout form & verification
├── tests/
│   ├── api/                                     <-- Task 2: Modular API Test Suites per Endpoint
│   │   ├── post-pet.spec.js                     <-- POST /pet validations
│   │   ├── get-pet-by-status.spec.js            <-- GET /pet/findByStatus validations
│   │   ├── delete-pet.spec.js                   <-- DELETE /pet/{petId} validations
│   │   └── pet-lifecycle.spec.js                <-- Full E2E Lifecycle Chaining (POST -> GET -> DELETE -> 404)
│   └── ui/                                      <-- Task 3: Modular UI Test Suites per Feature
│       ├── login.spec.js                        <-- Login scenarios (Positive & Negative validations)
│       └── checkout-e2e.spec.js                 <-- E2E Checkout Flow ('Sauce Labs Onesie' + boundary checks)
└── README.md                                    <-- Guidance & documentation
```

---

## 📝 Task 1: Manual API Testing & Bug Reports

All manual test cases, actual execution outcomes, and defect documentation are compiled into:
👉 **[`QA_Assessment_TestCases_and_BugReport.xlsx`](./QA_Assessment_TestCases_and_BugReport.xlsx)**

### The workbook contains 3 detailed sheets:
1. **`Manual Test Cases`**: 15 comprehensive test cases across `POST /pet`, `GET /pet/findByStatus`, and `DELETE /pet/{petId}` with Positive, Negative, and Boundary validations.
2. **`Execution Report`**: Execution matrix with actual HTTP status codes, response times, and pass/fail verdicts.
3. **`Bug Documentation`**: Formal bug reports with steps to reproduce, expected vs actual behavior, severity, and security/contract discrepancy analysis.

---

## ⚡ Task 2: API Automation Testing

Automates the 3 endpoints specified in the prompt:
1. **`POST /pet`**:
   - Creates a new pet with full schema (ID, category, photoUrls, tags, status).
   - Minimal payload verification.
   - Negative data-type validation.
2. **`GET /pet/findByStatus`**:
   - Queries `available`, `pending`, and `sold` status enums.
   - Queries multi-status (`available,pending`).
   - Graceful edge-case verification with invalid status query strings.
3. **`DELETE /pet/{petId}`**:
   - Deletes an existing pet with API Key header verification.
   - Asserts non-existent ID returns `404 Not Found`.
4. **End-to-End Lifecycle Chaining**:
   - `POST` new pet $\rightarrow$ `GET /pet/findByStatus` $\rightarrow$ `DELETE /pet/{id}` $\rightarrow$ `GET /pet/{id}` (Verify 404).

---

## 🖥 Task 3: UI Automation Testing (POM)

Built using the **Page Object Model (POM)** pattern for clean separation of concerns and maintainability:
- **Scenario 1: Login**
  - Positive: Valid standard user credentials (`standard_user` / `secret_sauce`).
  - Negative: Locked out user (`locked_out_user`).
  - Negative: Invalid credentials.
- **Scenario 2: E2E Checkout Flow**
  1. Login to SauceDemo.
  2. Add item **'Sauce Labs Onesie'** to Cart.
  3. Navigate to Cart & verify item presence.
  4. Proceed to Checkout and input customer information.
  5. Verify order overview and click **Finish**.
  6. Assert checkout completion message: `"Thank you for your order!"`.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Step 1: Clone and Enter the Project
```bash
git clone <your-git-repository-url>
cd qa-assessment-petstore-saucedemo
```

### Step 2: Install Dependencies & Browsers
```bash
npm install
npx playwright install chromium
```

---

## 🧪 Running The Tests

### Run All Tests (API + UI)
```bash
npm test
```

### Run API Automation Only (Task 2)
```bash
npm run test:api
```

### Run UI Automation Only (Task 3)
```bash
npm run test:ui
```

### Run UI Automation in Headed Mode (Watch Browser Open)
```bash
npm run test:headed
```

---

## 📊 Test Reports

Playwright automatically generates an interactive HTML test report upon completion.

### View the HTML Report
```bash
npm run report
```
This opens a local browser report displaying test timelines, step-by-step traces, console logs, and failure screenshots (if any).

---

## 🐛 Bug Documentation Summary

During manual and automated testing on `https://petstore.swagger.io/v2`, the following discrepancies were identified and logged in [`QA_Assessment_TestCases_and_BugReport.xlsx`](./QA_Assessment_TestCases_and_BugReport.xlsx):

| Bug ID | Endpoint | Summary | Severity | Expected vs Actual |
|---|---|---|---|---|
| **BUG-001** | `POST /pet` | Server accepts empty JSON body `{}` | Medium | Expected `400/405`, actual `200 OK` creating orphaned record |
| **BUG-002** | `POST /pet` | Unhandled `500 Internal Server Error` on string ID | High | Expected `400 Bad Request`, actual `500 {"code":500,"message":"something bad happened"}` |
| **BUG-003** | `GET /pet/findByStatus` | Documentation mismatch on invalid query enum | Low | Swagger spec states `400 Invalid status`, actual `200 OK []` |
| **BUG-004** | `DELETE /pet/{petId}` | Java `NumberFormatException` stack leaked to client | Medium | Expected `400 Bad Request`, actual `404` with raw Java exception string |

---
**Author**: Muhammad Yogi Mustofa  
**Role**: QA Engineer
