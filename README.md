# Case Interview Prep — IFSA SSC Casebook 2025

A professional-grade, searchable case library for consulting interview preparation.  
Built with **Next.js 14 App Router** + **Tailwind CSS**.  Data extracted from the **IFSA SSC Casebook 2025** PDF.

---

## Project Structure

```
case-interview-prep/            ← Next.js application
├── app/
│   ├── layout.jsx              ← Root layout (nav, fonts)
│   ├── page.jsx                ← Main dashboard (hero + sidebar + grid)
│   ├── globals.css
│   ├── components/
│   │   ├── Sidebar.jsx         ← Filter panel (company, industry, type, difficulty)
│   │   ├── CaseGrid.jsx        ← Responsive card grid + search toolbar
│   │   ├── CaseCard.jsx        ← Individual case card
│   │   └── CasePractice.jsx    ← Practice UI with Reveal Solution toggle
│   └── cases/[id]/
│       └── page.jsx            ← Dynamic route for individual case detail
├── lib/
│   └── cases.js                ← Data utilities (filtering, lookup)
├── public/
│   └── data/
│       └── cases.json          ← ⭐ THE DATA FILE — update this to add new cases
├── package.json
├── tailwind.config.js
└── next.config.js

extract_script/                 ← Standalone Python pipeline
├── extract_cases.py            ← PDF → CSV + JSON
└── csv_to_json.py              ← Excel CSV → JSON (for updates)
```

---

## Workflow 1 — Data Pipeline (Python Extraction)

### Prerequisites
```bash
pip install pdfplumber pandas
```

### Step 1: Extract from PDF
Place `IFSA_SSC_Casebook_2025.pdf` in the `extract_script/` folder, then:
```bash
cd extract_script
python extract_cases.py
# or with a custom path:
python extract_cases.py /path/to/casebook.pdf
```

This produces:
- `cases.csv` — for Excel review  
- `cases.json` — ready for the website  

### Step 2: Review & fill in difficulty in Excel
Open `cases.csv` in Microsoft Excel. The `difficulty` column defaults to `"Medium"`.  
Update each row to one of: **Easy** | **Medium** | **Hard**

> **Tip**: You can also edit company names, titles, or fix any extraction errors in Excel before deploying.

### Step 3: Convert updated CSV back to JSON
```bash
python csv_to_json.py
```

### Step 4: Copy JSON to the Next.js project
```bash
cp cases.json ../case-interview-prep/public/data/cases.json
```

---

## Workflow 2 — Running the Next.js App Locally

### Prerequisites
- Node.js 18+ → https://nodejs.org/
- npm (included with Node)

### Step 1: Install dependencies
```bash
cd case-interview-prep
npm install
```

### Step 2: Start the dev server
```bash
npm run dev
```
Open http://localhost:3000

### Step 3: Build for production (test before deploying)
```bash
npm run build
npm start
```

---

## Practice Chat Mode

The app now includes a Gemini-powered interactive practice chat at `/practice`.

This mode is designed for:

- category-first drills like `Profitability`, `Market Entry`, and `Guesstimate`
- interviewer-style dialogue instead of static answer reveal
- grounding on the extracted casebook data already stored in `public/data/cases.json`

Important:

- this is grounded on your casebook data
- it is **not** fine-tuning or model training on the PDF itself
- the server picks a matching case and sends that case context to Gemini 2.5 Flash

## Mock Interview Mode

The repo now includes a first-pass mock interview architecture for voice-style case calls.

### New routes

- `GET /mock/[id]` — mock interview studio for a specific case
- `POST /api/mock-interview/session` — returns a case blueprint and, when configured, mints an OpenAI Realtime client secret
- `POST /api/mock-interview/evaluate` — evaluates a completed transcript using the OpenAI Responses API

### Environment variables

Create `.env.local` with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Without `OPENAI_API_KEY`, the studio still renders the interview blueprint, but live OpenAI session creation is disabled.
Without `GEMINI_API_KEY`, the interactive practice chat will not connect to Gemini.

### What you need to do manually

The API key is the one part I cannot create or paste on your behalf.

For local development:

1. Copy `.env.example` to `.env.local`
2. Replace the placeholder values with your real API keys

For Vercel deployment:

1. Open your project in Vercel
2. Go to `Settings` → `Environment Variables`
3. Add `OPENAI_API_KEY`
4. Add `GEMINI_API_KEY`
5. Paste your real API keys as the values
6. Redeploy the project

If you skip this step, the site will still load, but the Gemini practice chat route will return a missing-key response and the mock session route will stay disabled.

### OpenAI integration notes

This implementation is designed around OpenAI's current recommended APIs for new builds:

- Realtime API for low-latency voice interactions and short-lived client secrets:
  [Realtime API guide](https://platform.openai.com/docs/guides/realtime/session)
- Realtime WebRTC flow for browser-based voice apps:
  [WebRTC guide](https://platform.openai.com/docs/guides/realtime-webrtc)
- Responses API for backend scoring and structured evaluation:
  [Responses API reference](https://platform.openai.com/docs/api-reference/responses/create?api-mode=responses)

### Recommended production architecture

1. Browser joins a WebRTC session using the ephemeral secret from `/api/mock-interview/session`
2. Realtime voice model acts as the interviewer during the call
3. Your backend remains the source of truth for case state, reveals, transcript, and scoring
4. At the end of the session, send the transcript to `/api/mock-interview/evaluate`
5. Persist the transcript, rubric scores, and next-step coaching in your database

---

## Workflow 3 — Deployment to Vercel (Free)

Vercel offers a free Hobby plan that is perfect for this project.

### First-time deployment (5 minutes)

**Step 1 — Push to GitHub**
```bash
# In the case-interview-prep/ folder:
git init
git add .
git commit -m "Initial commit — IFSA Case Prep Platform"
# Create a new repo on github.com, then:
git remote add origin https://github.com/<your-org>/case-interview-prep.git
git push -u origin main
```

**Step 2 — Connect to Vercel**
1. Go to https://vercel.com → Sign up free with GitHub
2. Click **"Add New Project"**
3. Select your `case-interview-prep` repository
4. Vercel auto-detects Next.js — no config needed
5. Click **Deploy**

Your site is live at `https://case-interview-prep.vercel.app` in ~60 seconds.

**Step 3 — Set a custom domain (optional)**  
In Vercel Dashboard → Domains → Add your domain (e.g. `cases.ifsassc.org`).

---

## Standard Operating Procedure — Adding Next Year's Cases

Follow these steps every time the casebook is updated (takes ~15 minutes total):

```
┌─────────────────────────────────────────────────────────────┐
│  SOP: Updating the Case Library                             │
├─────┬───────────────────────────────────────────────────────┤
│  1  │ Get the new PDF casebook from IFSA leadership         │
│  2  │ cd extract_script                                     │
│     │ python extract_cases.py new_casebook_2026.pdf         │
│  3  │ Open cases.csv in Excel                               │
│     │ • Verify company names are correct                    │
│     │ • Set difficulty: Easy / Medium / Hard                │
│     │ • Fix any garbled text in the prompt/solution cols    │
│     │ • Save the file (keep as CSV, not xlsx)               │
│  4  │ python csv_to_json.py                                 │
│  5  │ cp cases.json ../case-interview-prep/public/data/     │
│  6  │ cd ../case-interview-prep                             │
│     │ git add .                                             │
│     │ git commit -m "Add 2026 casebook cases"               │
│     │ git push                                              │
│  7  │ Vercel auto-deploys in ~60 seconds ✅                 │
└─────┴───────────────────────────────────────────────────────┘
```

### Adding a single case manually (no PDF)
Open `public/data/cases.json` and add a new object following this schema:
```json
{
  "id": 59,
  "slug": "fintech-mckinsey-company-59",
  "title": "Fintech — McKinsey & Company",
  "company": "McKinsey & Company",
  "industry": "Fintech",
  "category": "Market Entry",
  "difficulty": "Hard",
  "prompt": "Your client is a traditional bank considering launching a digital wallet...",
  "solution": "I'd structure this as a Market Entry problem. First, I'd assess...",
  "sourceSection": "Market Entry - 15"
}
```
Then `git add . && git commit -m "Add fintech case" && git push`.

---

## Design System Reference

| Token | Usage |
|---|---|
| `brand-600` (#2563eb) | Primary CTAs, active states, accent |
| `slate-900` | Page headings |
| `slate-700` | Body text |
| `slate-400` | Labels, metadata |
| `slate-50`  | Page background |
| Emerald | Easy difficulty, revealed solution |
| Amber   | Medium difficulty |
| Red     | Hard difficulty |

Category accent colours (left border on cards):
- Guesstimate → violet
- Profitability → blue
- Market Entry → cyan
- Market Growth → teal
- Pricing → orange
- Unconventional → pink

---

## License

Internal tool for IFSA SSC members.  
Case content © respective companies (McKinsey, BCG, Bain, etc.) and IFSA SSC 2025.
