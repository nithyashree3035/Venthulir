---
description: Run the full Venthulir test suite
---

## Run All Tests

// turbo
1. Navigate to the server directory and run Jest:
```
npm test
```
Run from: `c:\e com c\server`

Expected output:
- 7 test suites pass
- 60+ tests pass
- Exit code: 0

---

## Run a Single Test Suite

// turbo
2. Run a specific test file by name:
```
npx jest tests/<filename>.test.js --runInBand --forceExit
```

Available test files:
| File | What it tests |
|---|---|
| `inventory.test.js` | `reduceStock`, `restoreStock`, schema validation |
| `orderStatus.test.js` | Order status update API + stock restore on cancel/return |
| `inventoryApi.test.js` | Inventory dashboard GET + restock PUT endpoints |
| `checkoutStock.test.js` | Checkout blocks on OOS, reduces stock on success |
| `productStock.test.js` | Product creation with stock, customer/admin API visibility |
| `productCode.test.js` | SKU auto-generation, uniqueness, format, persistence |
| `emailConfig.test.js` | Env vars, logo URLs, delivery phone, owner email routing |

---

## Add a New Test

3. Create a new file in `c:\e com c\server\tests\<name>.test.js`

Follow this template:
```js
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const request = require('supertest');
const app = require('../app');
const { connectForTests, disconnectForTests } = require('./setup');

beforeAll(async () => { await connectForTests(); });
afterAll(async () => { await disconnectForTests(); });

describe('My Feature', () => {
    test('TC-XX-01: Description of test', async () => {
        // ...
    });
});
```
