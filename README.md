# Poker Simulator

A foundation for exploring how poker hands, positions, and boards play out over time. This repository currently contains only the development scaffold and a static title page. No poker rules, simulations, hand evaluation, statistics, playback, or animations are implemented.

## Stack

- Next.js 16.4.6 with the App Router and React / React DOM 19.3.1
- TypeScript 6.0 with strict mode
- Tailwind CSS 4.3.5 using its Turbopack integration
- ESLint 9 with Next.js Core Web Vitals and TypeScript rules
- npm with a committed `package-lock.json` for reproducible installs

TypeScript 6.0 and ESLint 9 are the newest versions accepted by the lint plugins' peer dependency ranges at setup time. No database, authentication, charting, or state management packages are included.

## Local development

Use Node.js 24 LTS (selected by `.nvmrc`) and npm. The package requires Node.js 22.13 or newer.

```sh
nvm use              # If using nvm; otherwise install Node.js 24 yourself
npm ci
npm run dev
```

Open http://localhost:3000. Edit `src/app/page.tsx` to change the home page. No environment variables or external services are required.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with Turbopack and hot reload |
| `npm run build` | Create the production build |
| `npm start` | Serve an existing production build locally |
| `npm run typecheck` | Generate Next.js route types and check TypeScript without emitting JavaScript |
| `npm run lint` | Run ESLint; fail on errors or warnings |

Run build, typecheck, and lint before submitting changes. Next.js does not run ESLint as part of its build. `next-env.d.ts` and `.next/` are generated automatically and ignored by Git.

## Structure

```text
src/
  app/
    globals.css       Tailwind entry point
    layout.tsx        Root HTML layout and metadata
    page.tsx          Minimal static home page
next.config.ts        Next.js and Tailwind Turbopack configuration
eslint.config.mjs     ESLint flat configuration
tsconfig.json        Strict TypeScript configuration and @/* → src/* alias
package.json          Dependencies and development scripts
package-lock.json     Exact dependency versions
.nvmrc                Recommended Node.js major version
```

Only directories needed by the scaffold exist. Add these locations when their first implementations are needed:

| Future location | Responsibility |
| --- | --- |
| `src/lib/poker/simulation/` | Pure TypeScript simulation engine |
| `src/lib/poker/evaluation/` | Pure TypeScript hand evaluation |
| `src/lib/poker/statistics/` | Pure TypeScript result aggregation |
| `src/components/` | Reusable React UI components |
| `src/features/playback/` | React playback UI, controls, and presentation state |
| `src/workers/` | Web Worker entry points and message adapters |

Keep `src/lib/poker/` independent of React, Next.js, DOM APIs, and worker globals. Pass inputs explicitly and return serializable results. Future worker entry points can import this code and handle messaging, while React components manage presentation. Core logic must never import UI or worker adapters. No worker or messaging protocol is implemented yet.

## Deploy to Vercel later

1. Push the repository, including `package-lock.json`, to a Git provider supported by Vercel.
2. Import the repository as a new Vercel project and choose the **Next.js** framework preset.
3. Use the repository root as the root directory and select **Node.js 24.x** in project settings.
4. Keep the standard settings: install with `npm ci`, build with `npm run build`, and let Vercel manage the output directory.
5. Deploy. No environment variables, database, or other infrastructure are needed for this scaffold.

For a local production preview, run `npm run build` followed by `npm start`.

References: [Next.js setup](https://nextjs.org/docs/app/getting-started/installation), [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying), and [Vercel Next.js documentation](https://vercel.com/docs/frameworks/nextjs).
