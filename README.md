# Mapsly — AI Workflow Map

> Tell Mapsly what you want to build, and it maps out the perfect AI-powered workflow — with the best free and paid tools for every step.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Groq](https://img.shields.io/badge/Groq-Llama%203.3-orange?logo=groq)
![Tavily](https://img.shields.io/badge/Tavily-Search-blue)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)

---

## What is Mapsly?

Mapsly is a conversational AI agent that helps students and developers discover the ideal AI tools for their project. You describe what you're building, and Mapsly:

1. **Asks 2–3 clarifying questions** (skill level, timeline, budget)
2. **Searches the web in real-time** for the latest AI tools using Tavily
3. **Returns a structured workflow** — each step has a task, best free tool, best paid tool, and a one-line reason
4. **Visualizes the workflow** as both a table and an interactive flowchart (ReactFlow)

No database, no sign-up — fully stateless.

---

## Prerequisites

- **Node.js 20+** ([download](https://nodejs.org/))
- **Groq API key** ([get one](https://console.groq.com/))
- **Tavily API key** ([get one](https://app.tavily.com/))

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/mapsly.git
cd mapsly

# 2. Install dependencies
npm install

# 3. Create your env file
cp .env.local.example .env.local

# 4. Add your API keys to .env.local
#    GROQ_API_KEY=gsk_...
#    TAVILY_API_KEY=tvly-...

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start describing your project!

---

## How to Get API Keys

### Groq (Llama 3)
1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Create a new key and copy it

### Tavily (Web Search)
1. Go to [app.tavily.com](https://app.tavily.com/)
2. Sign up for a free account
3. Copy your API key from the dashboard

---

## Deploy to Netlify

1. Push your code to GitHub
2. Go to [app.netlify.com](https://app.netlify.com/)
3. Click **"Add new site" → "Import an existing project"**
4. Connect your GitHub repo
5. Netlify will auto-detect the build settings from `netlify.toml`
6. Go to **Site settings → Environment variables** and add:
   - `GROQ_API_KEY`
   - `TAVILY_API_KEY`
7. Trigger a deploy

---

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Framework   | Next.js 15 (App Router, TypeScript) |
| Styling     | Tailwind CSS 4                      |
| LLM         | Llama 3.3 70B (via Groq)            |
| Web Search  | Tavily API                          |
| Diagrams    | ReactFlow                           |
| Deployment  | Netlify                             |

---

## License

MIT
