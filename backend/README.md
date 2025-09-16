# SmartSpendAI Backend (Flask)

## Setup

1. Create a virtual environment (optional but recommended)
```bash
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Create `.env` in `backend/` with:
```bash
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

4. Run the server
```bash
python app.py
```

## Endpoints
- `GET /api/health` → health check
- `POST /api/chat` → body `{ message: string, history?: [{role, content}] }`

## Notes
- CORS is open for dev. Restrict origins for production.
- This server proxies requests to Groq's Chat Completions API using the key from `.env`.

