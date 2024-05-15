# PodGPT

## Tech Stack
- Backend: Django with Gunicorn
- Frontend: React (Mantine Components) + Vite
- Infra: Nginx + Docker


## Running the app
- On dev
  - run Vite using `npm run dev` (port 5173)
  - run Django using `gunicorn -k gthread --bind localhost:8000 djangopod.wsgi`
  - run Nginx using `brew services start nginx` / `sudo nginx -s reload`
    - uses the local Nginx config (/opt/homebrew/etc/nginx)

- On prod
  - run `docker-compose up --build`
    - Reads docker-compose, and then runs:
    - Backend Dockerfile: 3.11-alpine, adds envs, collects static, exposes port 8000 using Gunicorn. Not running nginx yet.
    - Frontend Dockerfile: npm run build and then launches nginx using nginx.conf on frontend. Exposes port 3000. Proxy set up: when /api/ is hit on the frontend, redirects to the backend Docker service
    - Nginx service: Can be accessed at 8080. Not really necessary right now since we don't need to load balance or anything yet. Consider: rate limiting, SSL/TLS termination, other security controls


## Archive readme: Mantine / Vite Specific Features

This template comes with the following features:

- [PostCSS](https://postcss.org/) with [mantine-postcss-preset](https://mantine.dev/styles/postcss-preset)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Vitest](https://vitest.dev/) setup with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## npm scripts

## Build and dev scripts

- `dev` – start development server
- `build` – build production version of the app
- `preview` – locally preview production build

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `vitest` – runs vitest tests
- `vitest:watch` – starts vitest watch
- `test` – runs `vitest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier
