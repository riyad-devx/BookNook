# BookNook

**A dark, bookish digital library.** Browse the shelves, borrow a book for
fourteen days, and return it with one click.

[![Frontend](https://img.shields.io/badge/frontend-booknook--bay.vercel.app-000?logo=vercel&style=flat-square)](https://booknook-bay.vercel.app)
[![Books API](https://img.shields.io/badge/API-booknook--server--lac--one.vercel.app-111?logo=vercel&style=flat-square)](https://booknook-server-lac-one.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000?logo=next.js&style=flat-square)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&style=flat-square)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&style=flat-square)](https://tailwindcss.com)

| | |
| --- | --- |
| **Live app** | https://booknook-bay.vercel.app |
| **Live API** | https://booknook-server-lac-one.vercel.app |
| **Frontend repo** | [riyad-devx/BookNook](https://github.com/riyad-devx/BookNook) |
| **API repo** | [riyad-devx/BookNook-Server](https://github.com/riyad-devx/BookNook-Server) |

---

## The idea

Every real library I grew up with had the same problem: a shelf you can walk,
but not search. BookNook is the version of that shelf that fits in a browser
tab.

You sign in, browse what is on the shelf, borrow a copy for **fourteen days**,
and hand it back with one click. Members can also add their own books to the
shelves, edit them later, or take them down again. The library belongs to the
people in it.

It is deliberately small on purpose — one catalogue, one borrow rule, one
return button — so that every part of it can be finished properly: the cover
images really stream out of GridFS, the borrow really decrements the stock,
and the server really refuses to let you edit a book that is not yours.

## Features

- **Shelves** — a home page with a carousel banner, the six newest arrivals,
  how borrowing works, and the top categories
- **Catalogue** — every book on equal-height cards, with skeletons while
  loading and proper empty and error states
- **Book details** — cover art, category, who added it, and how many copies
  are left, behind a borrow dialog
- **Borrow and return** — one copy per borrow, fourteen days, one click to give
  it back
- **My Books** — add a book with a cover image, then edit or delete it later
- **My Borrows** — what you have borrowed, when it is due, and a return button
- **Accounts** — email and password or Google sign-in, with a profile page for
  your name and photo
- **Dark and light** — a real palette for both, remembered per device and
  applied before the first paint so the page never flashes
- **Motion** — framer-motion reveals and staggered lists that respect the
  visitor's reduced-motion preference

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Cache Components) |
| UI | React 19, TypeScript, Tailwind CSS v4, shadcn on Base UI |
| Auth | Better Auth (MongoDB adapter, JWT plugin) + Google OAuth |
| Database | MongoDB Atlas |
| Covers | GridFS, streamed through `/book-image/:id` |
| Motion | framer-motion (`LazyMotion` + `domAnimation`) |
| Hosting | Vercel (frontend and API as separate projects) |

## Architecture

BookNook is two repositories, and the split is deliberate.

```
┌─────────────────────────┐        ┌──────────────────────────┐
│  Frontend (Next.js 16)  │        │  Books API (Express 5)   │
│  riyad-devx/BookNook    │        │  riyad-devx/BookNook-    │
│                         │        │  Server                  │
│  /            home      │        │                          │
│  /books       catalogue │ ──────► │  GET  /books            │
│  /books/[id]  details  │        │  GET  /new-arrivals      │
│  /add-books   add       │        │  GET  /book-image/:id    │
│  /my-books    manage    │        │                          │
│  /my-borrows  borrows   │        │  owns: books, borrows,   │
│  /profile     account   │        │        cover images      │
│                         │        │                          │
│  /api/auth/*  Better    │        │  verifies Better Auth    │
│  /api/*      proxy      │ ──────► │  JWTs via the JWKS      │
└─────────────────────────┘        └──────────────────────────┘
              │                                   │
              └──────────► MongoDB Atlas ◄────────┘
                       (users, books, borrows,
                        GridFS cover images)
```

The browser never talks to the API directly with a token of its own. The
frontend mints a short-lived Better Auth JWT, forwards it as a bearer token,
and the API derives the caller — and therefore ownership — from the verified
token alone. A user id in a request body is ignored.

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000 and talks to the books API at
http://localhost:5000.

You also need the API running:

```bash
cd ../BookNook-Server
npm install
npm run dev
```

Both apps share one MongoDB Atlas database. MongoDB does not have to be
installed locally — point `MONGODB_URL` at Atlas and you are set.

### Environment variables

Create a `.env` file in the project root:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URL` | MongoDB connection string used by Better Auth — must be the same string the books API uses |
| `BETTER_AUTH_SECRET` | Signing secret for auth sessions |
| `BETTER_AUTH_URL` | Public base URL of the app — also the JWT issuer and the source of the JWKS the API verifies tokens against |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the app, inlined into the browser bundle for the auth client |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BOOKS_API_URL` | Base URL of the books API (server-side calls only) |
| `NEXT_PUBLIC_BOOKS_API_URL` | Base URL of the books API, inlined into the browser bundle and used for the `/book-image/:id` rewrite |

`BOOKS_API_URL` and `NEXT_PUBLIC_BOOKS_API_URL` must point at the same host —
only the prefix differs. The first is read on the server, the second in the
browser.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server on :3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint over the whole repo |

Type checking is `npx next typegen && npx tsc --noEmit` — `typegen` produces
the route prop types (`LayoutProps<"/books/[id]">`) without a full build.

## Routes

| Route | Description |
| --- | --- |
| `/` | Hero banner, new arrivals, how borrowing works, top categories |
| `/books` | The full catalogue |
| `/books/[id]` | Book details and the borrow action |
| `/add-books` | Add a book to the library |
| `/my-books` | Manage your own listings |
| `/my-borrows` | Track and return borrowed books |
| `/profile` | Account details and profile editing |
| `/login`, `/register` | Authentication pages |

## API

The books API answers on its own domain. Public routes need no token;
everything else expects `Authorization: Bearer <jwt>`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/books` | public | Every book on the shelf |
| `GET` | `/new-arrivals` | public | The six newest books |
| `GET` | `/book-image/:id` | public | Cover image from GridFS |
| `GET` | `/books/:id` | token | One book, with its owner |
| `POST` | `/add-books` | token | Add a book, optionally with a cover |
| `GET` | `/my-books` | token | Books owned by the caller |
| `PATCH` | `/books/:id` | token | Edit a book the caller owns |
| `DELETE` | `/books/:id` | token | Remove a book the caller owns |
| `POST` | `/borrows` | token | Borrow one copy for fourteen days |
| `GET` | `/borrows` | token | The caller's borrows |
| `POST` | `/borrows/:id/return` | token | Give a borrowed book back |

## Deployment

Both apps are on Vercel as separate projects:

| App | Project | Production URL |
| --- | --- | --- |
| Frontend | `riyad20/booknook` | https://booknook-bay.vercel.app |
| Books API | `riyad20/booknook-server` | https://booknook-server-lac-one.vercel.app |

Things worth knowing before you touch the dashboard:

- **Vercel snapshots environment variables into a deployment when it builds.**
  Adding one later changes nothing for a deployment that is already running —
  you have to redeploy. This is the single most common reason "I added the env
  var and it still fails".
- **The frontend needs two deploy passes.** `NEXT_PUBLIC_*` variables are
  inlined into the browser bundle and `BETTER_AUTH_URL` has to be the final
  production URL — neither is known before the first deploy. Deploy once, read
  the URL, set the variables, deploy again.
- **The API's `BETTER_AUTH_URL` must equal the frontend's production URL.** It
  is the JWT issuer and the JWKS source. Its `APP_ORIGIN` must match too, so
  the browser may call the catalogue directly.
- **The API's `PUBLIC_API_URL` must be its own public URL**, otherwise cover
  image links point at `localhost`.
- Set `NODE_OPTIONS=--max-old-space-size=3072` on the frontend project if the
  build runs out of memory.

## A few notes on the build

- The interface uses a two-layer token system: the shadcn tokens drive
  `components/ui/*`, and a second set of semantic tokens (`page`, `surface`,
  `ink`, `accent`, `line`) drives the product UI, so a theme change never
  means touching a component.
- The light/dark toggle is a class on `<html>`, applied by a tiny inline
  script before the first paint.
- `lib/highlighter.tsx` and `hooks/use-highlighted-code.ts` implement
  incremental Shiki highlighting for streamed code. They ship with the
  project and are ready to use, but no page wires them up yet.
- The build runs with Cache Components, so routes that need a session or live
  data opt out of prerendering with `export const instant = false`.

## Author

Built by **[Md Riyad](https://github.com/riyad-devx)** — the shelves, the
borrow rule and the fourteen days are all mine.

If you find a bug or want to add a category, open an issue or send a pull
request. Contributions are welcome, especially to the parts that are still
rough around the edges.

## License

MIT
