# project-frontend

React + JavaScript frontend for the price comparison project (Java backend).

## What it does

- Products with prices per retailer
- Login, register, email verify, forgot password
- Admin: products, retailers, scrapers, jobs, logs

## Stack

- **React** (UI)
- **JavaScript** (no TypeScript)
- Vite
- React Router

## Getting started

```bash
npm install
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173). API calls use `/api`, proxied to `http://localhost:8080` (configure your Java backend accordingly).

Copy environment variables:

```bash
cp .env.example .env
```

## Backend

Calls `/api` on port 8080 (see `src/api` for routes).

## Scripts

- `npm run dev` - run locally
- `npm run build` - build
