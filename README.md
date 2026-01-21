# Chat2bot

<img src="/3d_Robot.png" alt="Chat2bot logo" width="160">

Chat2bot is a lightweight AI chat web app built with React + TypeScript + Vite. It provides a simple conversation UI, Markdown/code rendering and copy-to-clipboard for responses, and an API client that sends the chat history to an external LLM endpoint.

Key features
- Chat UI with Markdown and code highlighting (react-markdown + react-syntax-highlighter)
- Persistent in-memory message store using Zustand
- API client using axios (Bearer token via environment variable)
- Built-in toast notifications and copy-to-clipboard
- TailwindCSS styling and component primitives (Radix & custom button)

Table of contents
- Quick start
- Environment variables
- How the chat works (request/response)
- Important files & project map
- Development & debugging tips
- Build & deploy
- Security & troubleshooting
- Contributing

Quick start

1. Clone and install
```
git clone https://github.com/Joel-Adjei/Chat2bot.git
cd Chat2bot
npm ci
```

2. Create an env file (see below) and run the dev server:
```
cp .env .env.local           # edit .env.local to add your API key and base URL
npm run dev
```

3. Open the app:
- Dev server typically runs at http://localhost:5173

Available npm scripts
- npm run dev — start Vite dev server
- npm run build — run tsc -b then vite build (produces /dist)
- npm run preview — preview production build locally (vite preview)
- npm run lint — run ESLint

Environment variables

The app expects the following environment variables (Vite prefix VITE_ required):

- VITE_API — Bearer API token used in Authorization header
- VITE_OPENAPI_BASEURL — Base URL for the chat completion endpoint (e.g. https://api.example.com/v1/chat/completions)
- VITE_OPENAPI_MODEL — Model identifier passed to the API

Example .env.local (do NOT commit real secrets)
```
VITE_API="sk-REPLACE_WITH_YOUR_API_KEY"
VITE_OPENAPI_BASEURL="https://openrouter.ai/api/v1/chat/completions"
VITE_OPENAPI_MODEL="nvidia/nemotron-nano-12b-v2-vl:free"
```

Important: rotate and remove any tokens mistakenly committed to the repository. See Security section below.

How the chat works (runtime flow)

1. User types a message and clicks send (src/pages/Chatbox.tsx).
2. The message is added to the local message store (Zustand) via addMessage.
3. A request is made to the API using axios (src/lib/axios.ts), posting a JSON payload:
   - Body shape:
     {
       model: import.meta.env.VITE_OPENAPI_MODEL,
       messages: [{ role: 'user' | 'assistant', content: '...' }, ...]
     }
4. The API response is expected to include the assistant message at response.data.choices[0].message (this is what the code uses).
5. The assistant message is appended to the store and displayed. The ChatMessage component renders Markdown and code blocks, and provides a copy button.

Minimal sample payload (what axios sends)
```
POST ${VITE_OPENAPI_BASEURL}
Authorization: Bearer ${VITE_API}
Content-Type: application/json

{
  "model": "nvidia/nemotron-nano-12b-v2-vl:free",
  "messages": [
    { "role": "user", "content": "Hello, who are you?" }
    // ...previous messages
  ]
}
```

Curl example for testing endpoint:
```
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{"model":"YOUR_MODEL","messages":[{"role":"user","content":"Hello"}]}'
```

Project map — where to look

- src/main.tsx — App bootstrap
- src/App.tsx — Router + top-level providers (react-query, toast)
- src/pages/Home.tsx — Landing page and "Get Started" button
- src/pages/Chatbox.tsx — Main chat screen (core logic, UI controls)
- src/components/ChatMessage.tsx — Renders each message, Markdown + code highlighting, copy button
- src/components/CustomAlertDialog.tsx — Confirmation dialog used for "New Chat"
- src/components/ui/* — small UI primitives (Button, alert-dialog wrapper)
- src/store/messageStore.ts — Zustand store: messages[], addMessage, clearMessages
- src/lib/axios.ts — axios instance built from env values (baseURL + Authorization)
- src/lib/utils.ts — small helper (cn for classnames + tailwind-merge)
- index.html — document head, meta tags and favicon
- vite.config.ts — Vite config with plugin list and path alias ("@" → ./src)
- .env — environment variables (local, not for public repos)

Customizing behavior

- Change model / endpoint: update VITE_OPENAPI_MODEL and VITE_OPENAPI_BASEURL
- Add a system prompt: push a message with role: "system" to messages in the store before sending
- Persist messages: swap Zustand to persist middleware or save messages to localStorage / backend
- Streaming responses: current implementation waits for whole response. To support streaming, integrate a streaming client and update UI incrementally.

Styling & components
- TailwindCSS provides styling; tweak classes in components or extend Tailwind config if needed.
- Messages use react-markdown and react-syntax-highlighter's Prism with the oneDark theme for code blocks.

Development & debugging tips

- Console logs:
  - Network calls appear in the browser devtools -> Network.
  - Add console.log in src/pages/Chatbox.tsx around addMessage / mutateAsync to inspect payloads and responses.

- Common issues:
  - CORS errors — the API server must allow requests from your origin or you must use a proxy.
  - 401 / 403 — check VITE_API token and deployment environment variable configuration.
  - Unexpected response shape — the client expects response.data.choices[0].message; adjust according to your LLM provider.

- TypeScript check & build:
  - The build script runs tsc -b && vite build. Run tsc -b locally to surface type issues.

Deployment

- Vercel:
  - The repository includes vercel.json. Recommended flow: push to a Git repo and connect to Vercel.
  - In Vercel dashboard, set environment variables (VITE_API, VITE_OPENAPI_BASEURL, VITE_OPENAPI_MODEL) under Project Settings → Environment Variables.
  - Do NOT upload .env to Vercel; use the dashboard to securely store values.

- Other hosts:
  - Any static hosting that serves the built /dist folder will work once environment variables are properly baked into the build process (Vite reads import.meta.env at build time).

Security — IMPORTANT
- Do not commit API keys or secrets. If an API key was committed, rotate it immediately.
- The included .env in this repo appears to contain a token-like string. Treat that as compromised: delete it, rotate tokens at the provider, and add .env to .gitignore if not already present.
- Use deployment provider secret stores (Vercel/Netlify/AWS Parameter Store) rather than committing secrets.

Troubleshooting quick checklist
- Browser shows CORS: ensure backend sets Access-Control-Allow-Origin or use server-side proxy.
- API returns 401/403: check VITE_API, ensure it's valid for the chosen endpoint.
- API returns unexpected output or error: test with curl/postman to confirm behavior, check provider docs for required fields.
- Messages not appearing: ensure useMessageStore is adding messages and Chatbox maps over messages in the store.

Contributing
- Fork, create a feature branch, and open a PR.
- Run lint and tests (if you add tests).
- Suggested improvements:
  - Add persistence (localStorage or remote DB)
  - Add streaming responses support
  - Add user authentication and per-user chat history
  - Add message moderation / safety checks

Notes / Suggestions
- Consider removing the example API key from the repo and replacing it with a placeholder.
- Add an .env.example (no secrets) to show required variables without exposing data.
- Add a LICENSE (MIT recommended) if you want a permissive license.

Example .env.example (copy this file, fill values and rename to .env.local)
```
# .env.example — DO NOT COMMIT SECRETS
VITE_API="sk-REPLACE_ME"
VITE_OPENAPI_BASEURL="https://openrouter.ai/api/v1/chat/completions"
VITE_OPENAPI_MODEL="nvidia/nemotron-nano-12b-v2-vl:free"
```

Acknowledgements & libraries
- Vite, React, TypeScript
- TailwindCSS
- Zustand (state)
- @tanstack/react-query
- axios
- react-markdown & react-syntax-highlighter
- react-toastify
- Radix UI primitives

License
- No license file included in this repository. Add a LICENSE file if you want to publish under a specific license (MIT is common for starters).

If you want, I can:
- Add a .env.example to the repository content,
- Replace the committed .env with a safe placeholder and a short script for local dev,
- Add instructions for streaming responses or storing chats persistently.
