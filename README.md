# Quest Mitra — Your AI Companion for Every Quest

An AI-powered education platform for teachers. Generate structured question papers with an LLM, regenerate individual questions without discarding the paper, read and annotate an eBook library, and practise English with a voice-driven AI tutor.

### 🌐 Live Demo
- **Frontend**: [https://veda-ai-rosy-eight.vercel.app](https://veda-ai-rosy-eight.vercel.app)
- **Backend API**: [https://veda-ai-shaaz.onrender.com](https://veda-ai-shaaz.onrender.com)

> Quest Mitra began as the VedaAI Full Stack Engineering Assignment and has since grown into a broader platform. The deployment URLs above still carry the original name.

---

## 🏗️ Architecture

Two decoupled services: a Next.js frontend and an asynchronous Node.js backend.

### Frontend (Next.js 16, App Router)
- **TypeScript** throughout, **Tailwind CSS v3.4** for styling
- **Zustand** for the multi-step quest form, assignment CRUD, and WebSocket status
- **Design system** built on CSS custom properties (`--qm-*`) covering colour, radii, shadows, and motion — consumed by both Tailwind utilities and inline styles
- **Dark mode** with a persisted user choice, a system-preference default, and a pre-paint init script so there is no flash of the wrong palette
- **Real-time UX**: WebSocket connection surfaces generation progress, retry notices, and completion without polling

### Backend (Node.js + Express)
- **MongoDB** (Mongoose) stores assignment requests and generated sections
- **Redis + BullMQ** run generation, question regeneration, and PDF processing off the request path
- **`ws`** broadcasts job status to the client, fanned out via Redis Pub/Sub
- **pino** for structured logging, **zod** for request validation

---

## 💡 Key Features

### Quest generation
Respects difficulty, marks, and question type to produce structured sections. The prompt pipeline forces a strict JSON schema out of the LLM rather than parsing markdown.

### Idempotency layer
An `X-Idempotency-Key` system backed by Redis (`SET NX EX`) prevents duplicate generation — and duplicate LLM spend — on double-clicks, refreshes, and network retries.

### Timeout, backoff, and stall detection
- 30-second `AbortController` timeouts on LLM calls
- BullMQ exponential backoff (2s, 4s, 8s) on failed prompts
- The UI surfaces `"Generation timed out. Retrying (1/3)…"` over WebSocket while recovery happens in the background

### Micro-regeneration
Regenerate a single bad question instead of discarding the whole paper. A dedicated `question-regeneration` queue swaps the question atomically via a MongoDB nested array filter, with an inline spinner on the frontend.

### Library and AI Tutor
- eBook library with upload, favourites (cached in `localStorage`), and a full-page reader
- Voice-driven English tutor: SSE-streamed chat, speech recognition, and Edge Neural TTS

### PDF export
One-click A4 export via `html2pdf.js`, preserving hierarchy, typography, and difficulty tags.

---

## 🚀 Setup

### Prerequisites
- **Node.js** v18+
- **MongoDB** — local or Atlas
- **Redis** — local or Upstash. Required: generation, regeneration, and PDF upload all enqueue jobs.
- **Groq API key** — [console.groq.com/keys](https://console.groq.com/keys)

### Backend

```bash
cd vedaai-backend
npm install
```

Create a `.env`:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/questmitra
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:3000

# Optional — defaults are set in code
GROQ_GENERATION_MODEL=openai/gpt-oss-120b
GROQ_TUTOR_MODEL=openai/gpt-oss-20b
```

> The variable is `MONGO_URL`, not `MONGO_URI` — see `src/config/db.ts`.

Run the API server plus all three workers:

```bash
npm run dev
```

Without `REDIS_URL` the API still starts and serves reads, but any request that enqueues a job fails with a message naming the missing variable, and WebSocket clients receive no progress events.

### Frontend

```bash
cd ../vedaai-frontend
npm install
```

Create a `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗺️ Routes

| Route | Purpose |
|---|---|
| `/` | Dashboard — greeting, quick actions, stats, recent quests |
| `/assignments` | Quest list with search, status filter, and delete |
| `/assignments/create` | Multi-step quest form |
| `/assignments/[id]` | Generation progress, then the rendered paper |
| `/library` | eBook library with search, favourites, and upload |
| `/library/[id]` | Reader — flipbook for uploaded PDFs, embedded viewer for Google Books |
| `/tutor` | Voice-driven AI English tutor |
| `/groups`, `/toolkit`, `/settings` | In development; Settings has a working appearance control |

---

## 🔌 API

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/assignments` | List all |
| `POST` | `/api/assignments` | Create and enqueue generation |
| `GET` | `/api/assignments/:id` | Fetch one |
| `DELETE` | `/api/assignments/:id` | Delete |
| `POST` | `/api/assignments/:id/questions/:qid/regenerate` | Regenerate one question |
| `GET` | `/api/books` | List books (optional `?query=`) |
| `GET` | `/api/books/:id` | Fetch one book |
| `POST` | `/api/books/upload` | Upload a PDF |
| `GET` | `/api/books/:id/pages/:page` | Page image |
| `POST` | `/api/tutor/chat` | SSE streaming chat |
| `POST` | `/api/tutor/speak` | Edge Neural TTS |
| `WS` | `/` | Generation progress events |

---

## ✅ Checks

```bash
# Backend
cd vedaai-backend && npx tsc --noEmit && npm test

# Frontend
cd vedaai-frontend && npm run build && npx tsc --noEmit && npm run lint
```
