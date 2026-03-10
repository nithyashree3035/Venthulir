---
description: Start the Venthulir development servers (frontend + backend)
---

// turbo-all

1. Start both frontend and backend concurrently from the root:
```
npm run dev
```
Run from: `c:\e com c`

This starts:
- **Backend** → `http://localhost:7000`  (Node + Express)
- **Frontend** → `http://localhost:5173` (Vite + React)

---

2. To start ONLY the backend server:
```
npm run server
```
Run from: `c:\e com c`

---

3. To restart the backend (kill existing + restart):
```
netstat -ano | findstr :7000
```
Then:
```
taskkill /PID <PID> /F
```
Then:
```
npm run server
```
