
# 📚 BookNook — Digital Library Platform

<p align="center">
  <strong>A modern digital library to discover, borrow, and manage books.</strong>
  <br />
  Browse the shelves, borrow books for 14 days, and return them with a single click.
</p>

<p align="center">
  <a href="https://booknook-bay.vercel.app">
    <img src="https://img.shields.io/badge/Live_App-BookNook-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live App" />
  </a>
  <a href="https://booknook-server-lac-one.vercel.app">
    <img src="https://img.shields.io/badge/Live_API-Available-111111?style=for-the-badge&logo=vercel&logoColor=white" alt="Live API" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Better_Auth-Authentication-000000?style=flat-square" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel" alt="Vercel" />
</p>

---

## 🌐 Project Links

| Resource | Link |
|---|---|
| Live Application | [BookNook](https://booknook-bay.vercel.app) |
| Live API | [BookNook API](https://booknook-server-lac-one.vercel.app) |
| Frontend Repository | [BookNook](https://github.com/riyad-devx/BookNook) |
| Backend Repository | [BookNook Server](https://github.com/riyad-devx/BookNook-Server) |

---

## 📖 About The Project

**BookNook** is a modern digital library platform designed to make book discovery and borrowing simple and accessible.

Users can explore a collection of books, view detailed information, borrow available copies for **14 days**, and return borrowed books with a single click.

The platform also allows authenticated members to contribute to the library by adding new books, uploading cover images, editing their own listings, and managing their collections.

BookNook focuses on a clean user experience, secure authentication, reliable book management, and ownership-based authorization.

## ✨ Key Features

### 📚 Book Discovery
- Dynamic homepage with a carousel banner.
- Display the latest six books from the database.
- Browse the complete book collection.
- Explore books by category.
- Detailed book information and availability.

### 🔖 Borrow & Return System
- Borrow available books for 14 days.
- Automatically decrease available stock after borrowing.
- Return borrowed books with one click.
- Track borrowed books and due dates.
- Prevent borrowing unavailable copies.

### 📦 Book Management
- Add new books with cover images.
- Upload and stream images using MongoDB GridFS.
- Edit your own book listings.
- Delete books you own.
- View and manage personal book collections.

### 🔐 Authentication & Security
- Email and password authentication.
- Google OAuth sign-in.
- Better Auth with MongoDB adapter.
- JWT-based API authentication.
- JWKS-based token verification.
- Server-side session handling.
- Ownership-based authorization.
- Protected routes and API endpoints.

### 🎨 User Experience
- Modern dark and light themes.
- Responsive design for mobile, tablet, and desktop.
- Smooth animations using Framer Motion.
- Loading skeletons and empty states.
- Error handling and user feedback.
- Theme preference remembered per device.
- Reduced-motion accessibility support.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui, Base UI |
| Icons | Lucide React |
| Animations | Framer Motion |
| Authentication | Better Auth, JWT, Google OAuth |
| Database | MongoDB Atlas |
| Image Storage | MongoDB GridFS |
| Backend | Express 5 |
| Deployment | Vercel |
| Version Control | Git & GitHub |

---

## 🏗️ Project Architecture

BookNook follows a separate frontend and backend architecture.

```text
                 ┌──────────────────────────┐
                 │      BookNook Frontend   │
                 │       Next.js 16         │
                 │                          │
                 │  Home / Books / Details  │
                 │  Add Books / My Books    │
                 │  My Borrows / Profile    │
                 │  Login / Register        │
                 └────────────┬─────────────┘
                              │
                       Secure API Requests
                              │
                    Bearer JWT Authentication
                              │
                 ┌────────────▼─────────────┐
                 │       Books API          │
                 │        Express 5         │
                 │                          │
                 │  Book Management         │
                 │  Borrow / Return         │
                 │  Image Streaming         │
                 │  JWT Verification        │
                 └────────────┬─────────────┘
                              │
                 ┌────────────▼─────────────┐
                 │       MongoDB Atlas      │
                 │                          │
                 │  Users / Books           │
                 │  Borrows / GridFS        │
                 └──────────────────────────┘
```

### Authentication Flow

1. Users authenticate through Better Auth.
2. The frontend obtains a short-lived JWT.
3. The frontend forwards the JWT to the backend using the Bearer authorization scheme.
4. The backend verifies the token using the authentication server's JWKS.
5. The backend derives the authenticated user's identity from the verified token.
6. Ownership-sensitive operations are authorized using the verified identity.

**Security principle:** The backend does not trust user IDs supplied in request bodies for ownership decisions.

---

## 📂 Application Routes

| Route | Description | Access |
|---|---|---|
| `/` | Homepage and new arrivals | Public |
| `/books` | Browse all books | Public |
| `/books/[id]` | Book details and borrowing | Auth required |
| `/add-books` | Add a new book | Auth required |
| `/my-books` | Manage personal listings | Auth required |
| `/my-borrows` | Manage borrowed books | Auth required |
| `/profile` | View and update profile | Auth required |
| `/login` | User login | Public |
| `/register` | User registration | Public |

---

## 🔌 Backend API Endpoints

**Base URL:** `https://booknook-server-lac-one.vercel.app`

Public endpoints do not require authentication. Protected endpoints require:

```http
Authorization: Bearer <jwt>
```

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/books` | Public | Get all books |
| GET | `/new-arrivals` | Public | Get the latest six books |
| GET | `/book-image/:id` | Public | Stream book cover images |
| GET | `/books/:id` | Protected | Get book details |
| POST | `/add-books` | Protected | Add a new book |
| GET | `/my-books` | Protected | Get your own books |
| PATCH | `/books/:id` | Protected | Update an owned book |
| DELETE | `/books/:id` | Protected | Delete an owned book |
| POST | `/borrows` | Protected | Borrow a book |
| GET | `/borrows` | Protected | Get your borrowed books |
| POST | `/borrows/:id/return` | Protected | Return a borrowed book |

---

## ⚙️ Getting Started

Follow these steps to run BookNook locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account
- Git

### 1. Clone the Frontend Repository

```bash
git clone https://github.com/riyad-devx/BookNook.git

cd BookNook
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the frontend project root.

```env
MONGODB_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_APP_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

BOOKS_API_URL=http://localhost:5000
NEXT_PUBLIC_BOOKS_API_URL=http://localhost:5000
```

Fill in the values using your own credentials and configuration.

### 4. Start the Frontend

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

### 5. Set Up the Backend

Open another terminal:

```bash
git clone https://github.com/riyad-devx/BookNook-Server.git

cd BookNook-Server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend project root and configure the required variables:

```env
MONGODB_URL=

BETTER_AUTH_URL=
BETTER_AUTH_SECRET=

APP_ORIGIN=http://localhost:3000
PUBLIC_API_URL=http://localhost:5000
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

**Note:** Both applications must use the same MongoDB database and compatible authentication configuration.

---

## 🔑 Environment Variables

### Frontend

| Variable | Description |
|---|---|
| `MONGODB_URL` | MongoDB connection string |
| `BETTER_AUTH_SECRET` | Authentication signing secret |
| `BETTER_AUTH_URL` | Better Auth base URL |
| `NEXT_PUBLIC_APP_URL` | Public frontend URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BOOKS_API_URL` | Backend API URL for server-side requests |
| `NEXT_PUBLIC_BOOKS_API_URL` | Backend API URL used by browser-side image requests and rewrites |

### Backend

| Variable | Description |
|---|---|
| `MONGODB_URL` | MongoDB Atlas connection string |
| `BETTER_AUTH_URL` | Authentication issuer and JWKS source |
| `BETTER_AUTH_SECRET` | Shared authentication secret |
| `APP_ORIGIN` | Allowed frontend origin |
| `PUBLIC_API_URL` | Public backend URL |

**Important:** Never commit `.env` files or expose secret credentials in your repository.

---

## 🚀 Deployment

Both applications are deployed separately on Vercel.

| Application | Vercel Project | Production URL |
|---|---|---|
| Frontend | `riyad20/booknook` | [booknook-bay.vercel.app](https://booknook-bay.vercel.app) |
| Backend API | `riyad20/booknook-server` | [booknook-server-lac-one.vercel.app](https://booknook-server-lac-one.vercel.app) |

### Deployment Notes

- Configure all environment variables in the appropriate Vercel project.
- Set the frontend's `BETTER_AUTH_URL` to its final production URL.
- The backend's `BETTER_AUTH_URL` must match the frontend's Better Auth issuer URL.
- Configure `APP_ORIGIN` with the production frontend URL.
- Configure `PUBLIC_API_URL` with the production backend URL.
- Keep `BOOKS_API_URL` and `NEXT_PUBLIC_BOOKS_API_URL` pointed at the same backend host.
- Redeploy after changing environment variables.
- Configure `NODE_OPTIONS=--max-old-space-size=3072` if the frontend build requires additional Node.js memory.

**Deployment tip:** Next.js `NEXT_PUBLIC_*` variables are embedded into the browser bundle during build time. Changing them requires a new deployment.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

Type checking:

```bash
npx next typegen && npx tsc --noEmit
```

---

## 👨‍💻 About the Developer

**Md Riyad**

Aspiring Full Stack Developer passionate about building modern, responsive, and secure web applications.

- GitHub: [@riyad-devx](https://github.com/riyad-devx)
- LinkedIn: [Md Riyad](https://www.linkedin.com/in/md-riyad32/)

I enjoy learning new technologies, solving real-world problems, and turning ideas into functional web applications.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Built with ❤️ by Md Riyad</strong>
  <br />
  <sub>Learning, building, and improving one project at a time.</sub>
</p>
