import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests


load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)

    # Enable CORS for frontend dev (adjust origins for production)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        logging.warning("GROQ_API_KEY not found in environment. Set it in .env")

    @app.route("/api/health", methods=["GET"])  # Simple health check
    def health() -> tuple:
        return jsonify({"status": "ok"}), 200

    @app.route("/api/chat", methods=["POST"])  # Chat completion proxy
    def chat() -> tuple:
        nonlocal groq_api_key

        try:
            data = request.get_json(silent=True) or {}
            user_message = (data.get("message") or "").strip()
            history = data.get("history") or []  # Optional [{role, content}]

            if not user_message:
                return jsonify({"error": "Message is required"}), 400

            if not groq_api_key:
                return jsonify({"error": "Server misconfigured: GROQ_API_KEY missing"}), 500

            # Construct OpenAI-compatible Chat Completions payload for Groq
            messages = []
            # System prompt
            messages.append({
                "role": "system",
                "content": (
                    "You are SmartSpendAI's helpful financial assistant. Be clear, concise, and factual. "
                    "If unsure, say so briefly."
                ),
            })
            # Add prior history if provided
            for item in history:
                role = item.get("role")
                content = item.get("content")
                if role in ("system", "user", "assistant") and isinstance(content, str):
                    messages.append({"role": role, "content": content})
            # Append current user message
            messages.append({"role": "user", "content": user_message})

            payload = {
                "model": "llama-3.1-8b-instant",  # fast, low-latency model on Groq
                "messages": messages,
                "temperature": 0.2,
                "max_tokens": 512,
                "stream": False,
            }

            headers = {
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json",
            }

            resp = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                json=payload,
                headers=headers,
                timeout=30,
            )

            if resp.status_code != 200:
                logging.error("Groq API error %s: %s", resp.status_code, resp.text)
                return jsonify({"error": "Upstream AI error"}), 502

            data = resp.json()
            reply = (
                (data.get("choices") or [{}])[0]
                .get("message", {})
                .get("content", "Sorry, I could not generate a response.")
            )

            return jsonify({"reply": reply}), 200
        except requests.Timeout:
            return jsonify({"error": "AI service timeout"}), 504
        except Exception as e:
            logging.exception("/api/chat failed: %s", e)
            return jsonify({"error": "Server error"}), 500

    return app


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app = create_app()
    app.run(host="0.0.0.0", port=port)


