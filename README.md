# SmartSpendAI

SmartSpendAI is a personal finance assistant that helps users track spending, categorize transactions, generate budgets, and receive AI-driven insights and recommendations to improve financial health.

Key features

- Automatic transaction import (CSV or connected accounts)
- Intelligent categorization using machine learning
- Budget creation and tracking
- Expense insights and recommendations powered by large language models
- Transaction search and filters
- Export reports (CSV/PDF)

Tech stack

- Backend: Python (FastAPI) or Node.js (Express) — adapt to your project implementation
- AI: OpenAI or compatible LLM provider for insights and natural language features
- Database: PostgreSQL (or SQLite for local/dev)
- Authentication: JWT or OAuth2 (optional)

Getting started (developer)

1. Clone the repo

   git clone https://github.com/sanjayn29/SmartSpendAI.git
   cd SmartSpendAI

2. Create a Python virtual environment (if using Python backend)

   python -m venv .venv
   source .venv/bin/activate  # macOS/Linux
   .venv\Scripts\activate     # Windows

3. Install dependencies

   pip install -r requirements.txt

4. Create a .env file in the project root with these variables (example)

   DATABASE_URL=postgresql://user:password@localhost:5432/smartspend
   OPENAI_API_KEY=sk-...
   SECRET_KEY=replace_with_random_secret
   ENV=development

5. Run database migrations (if using Alembic or similar)

   alembic upgrade head

6. Start the development server

   uvicorn app.main:app --reload

Usage

- Visit http://localhost:8000 to access the web UI (if included)
- Use the API endpoints under /api to import transactions, create budgets, and request AI insights

Environment and deployment

- For production, set ENV=production and point DATABASE_URL at a managed Postgres instance.
- Make sure OPENAI_API_KEY (or other LLM provider key) is set as an environment secret.
- Use a process manager (gunicorn, uvicorn with supervisor/systemd) and a reverse proxy (Nginx).

AI and privacy

- SmartSpendAI sends transaction text to the configured LLM provider to generate categories, summaries, and recommendations. Review the provider's terms and do NOT send raw PII if you need to enforce stricter privacy controls.
- Consider on-prem or private model hosting if privacy is a concern.

Contributing

Contributions are welcome. Please open issues or PRs describing changes. Follow these guidelines:

- Fork the repo and create a feature branch
- Add tests for new features or bug fixes
- Keep changes small and focused

License

This project is released under the MIT License. See LICENSE for details.

Contact

Created by Sanjay N. — https://github.com/sanjayn29

---
