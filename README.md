# BookNook

A dark, bookish digital library. Browse the shelves, borrow a book for fourteen days, and return it with one click.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and shadcn on Base UI.

## Features

- Email/password and Google sign-in with Better Auth, backed by MongoDB
- Book catalog with search-ready grid, equal-height cards, and a details page with borrow dialog
- "My Books" shelf: add, edit, and delete your own listings with stock tracking
- "My Borrows": active borrows with a one-click return action
- Profile page with inline name and photo editing
- Cache Components build with per-route metadata, loading UI, and a custom 404 page
- Incremental Shiki code highlighting for streamed content

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000 and expects the book API at http://localhost:5000.

### Environment variables

Create a `.env` file in the project root:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URL` | MongoDB connection string used by Better Auth |
| `BETTER_AUTH_SECRET` | Signing secret for auth sessions |
| `BETTER_AUTH_URL` | Public base URL of the app |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BOOKS_API_URL` | Optional base URL of the book API (defaults to `http://localhost:5000`) |

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — run ESLint

## Routes

| Route | Description |
| --- | --- |
| `/` | Hero banner, new arrivals, borrowing steps, top categories |
| `/books` | Full catalog |
| `/books/[id]` | Book details and borrow action |
| `/add-books` | Add a book to the library |
| `/my-books` | Manage your own listings |
| `/my-borrows` | Track and return borrowed books |
| `/profile` | Account details and profile editing |
| `/login`, `/register` | Authentication pages |
