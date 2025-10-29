# BusinessHub

BusinessHub is a Next.js (App Router) TypeScript application with built-in internationalization, theming, and authentication scaffolding. It's organized with the `app/` directory and several reusable UI components under `src/components`.

This README documents how to set up, run, and work with the project.

## Key features

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS (configured via `tailwind.config.ts`)
- next-intl for translations (see `messages/`)
- next-auth (Credentials provider) for authentication scaffolding
- next-themes for light/dark theming support

## Prerequisites

- Node.js 18+ (recommended)
- npm, pnpm, or yarn

## Install

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd businesshub
npm install
# or pnpm install
# or yarn
```

## Available scripts

The `package.json` defines these helpful scripts:

- `npm run dev` — start development server (Next dev)
- `npm run build` — build the production app
- `npm run start` — start the production server (after build)
- `npm run lint` — run ESLint

Example:

```bash
npm run dev
# open http://localhost:3000
```

## Environment variables

Create a `.env.local` in the project root for local development and add the values your app expects. The project uses NextAuth with the Credentials provider and may expect the following variables (adjust to your setup):

- `NEXTAUTH_URL` — e.g. `http://localhost:3000`
- `NEXTAUTH_SECRET` — a long random string used to encrypt session tokens
- `EXTERNAL_API_URL` — (optional) external API for authenticating credentials in `src/auth.ts`

Example `.env.local` (do not commit this file):

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=some_long_random_value_here
EXTERNAL_API_URL=https://example.com/api/auth
```

If your production environment uses a database/session store, add the corresponding vars (e.g., `DATABASE_URL`) and update `auth.config.ts` accordingly.

## Authentication

This project wires up NextAuth with a Credentials provider. Key points:

- Authentication is configured in `src/auth.ts` which exports NextAuth handlers and helper functions: `GET`, `POST`, `auth`, `signIn`, `signOut`.
- The credentials provider uses an `authorize` function which currently contains a mock return for a demo user. Replace that with a real call to your auth API (see commented example in `src/auth.ts`).
- Keep `NEXTAUTH_SECRET` set in production to secure session cookies.

How to sign in (frontend): use the exported `signIn` helper or the project’s `LoginForm` component at `src/components/auth/LoginForm.tsx`.

## Internationalization (i18n)

- Translations live in the `messages/` folder (e.g. `messages/en.json`, `messages/ar.json`, `messages/es.json`).
- The project uses `next-intl` and the plugin is enabled in `next.config.ts`.
- Routes are localized under `src/app/[locale]/...`.

To add a new locale:

1. Add a `messages/<locale>.json` file.
2. Add the locale to any locale list used by the app (check `src/types/locales.ts` or similar).

## Theming

- `next-themes` is included to support light/dark themes and the project defines color themes in `tailwind.config.ts`.
- A `ThemeProvider` exists under `src/contexts/ThemeProvider.tsx` — use it to wrap components that need theme awareness.

## Folder structure (high level)

- `app/` — Next.js App Router pages and layouts
  - `[locale]/` — localized routes and layouts
  - `(admin)`, `(guest)`, and other route groups
- `components/` — shared UI components (auth, layout, ui primitives)
- `lib/` — utilities (e.g., `geo.ts`, `utils.ts`)
- `config/` — navigation and theme configuration
- `messages/` — translation JSON files

## Development tips

- To edit UI, check `src/components/ui` for primitives (`Button`, `Card`, `Input`).
- To add routes, create new folders/files under `app/` using the App Router conventions.
- When modifying auth, update `src/auth.ts` and any corresponding server-side API calls.

## Linting & Type checking

- ESLint is included. Run `npm run lint` to lint the code.
- TypeScript is enabled and configured via `tsconfig.json`.

## Deployment

This project is ready for Vercel and other Node-capable hosts. Typical steps:

1. Set environment variables in your deployment platform (NEXTAUTH_URL, NEXTAUTH_SECRET, EXTERNAL_API_URL, etc.).
2. Build the app (`npm run build`).
3. Start the production server (`npm run start`) or let the platform handle it.

Vercel is the simplest choice for Next.js apps and supports the App Router out of the box.

## Known notes & assumptions

- `src/auth.ts` currently returns a mocked user inside the Credentials `authorize` function — replace with your real authentication flow.
- I could not find an `auth.config.ts` at the repository root during my scan; if you have additional auth configuration, ensure it is present and referenced correctly.
- Next.js version is `16.0.0` and React `19.2.0` per `package.json` — make sure that any hosting environment supports these versions.

## Next steps (recommended)

1. Add a `.env.example` file that documents required environment variables.
2. Replace the mock auth logic with a secure production flow (or wire a database/session store).
3. Add simple unit/integration tests and a CI workflow for lint/build.

---

If you want, I can:

- Add a `.env.example` file.
- Replace the mock `authorize` body with an example that calls `EXTERNAL_API_URL` and handles common errors.
- Add a short CONTRIBUTING or DEV_NOTES section in the README.

Tell me which follow-up you'd like and I'll make the change.
