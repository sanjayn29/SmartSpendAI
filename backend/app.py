import os
import logging
import re
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    logging.warning("Firebase Admin SDK not installed. Transaction features will be disabled.")
from datetime import datetime


load_dotenv()

# Initialize Firebase Admin SDK
db = None
firebase_enabled = False

try:
    # Check if Firebase credentials are available
    firebase_private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    firebase_client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
    
    if firebase_private_key and firebase_client_email:
        # Try to initialize Firebase (will fail if already initialized)
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": "aismartspend",
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": firebase_private_key.replace('\\n', '\n'),
            "client_email": firebase_client_email,
            "client_id": os.getenv("FIREBASE_CLIENT_ID"),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{firebase_client_email}"
        })
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        firebase_enabled = True
        logging.info("Firebase Admin SDK initialized successfully")
    else:
        logging.warning("Firebase credentials not found. Transaction features will be disabled.")
        
except ValueError as e:
    if "already exists" in str(e):
        # Firebase already initialized
        db = firestore.client()
        firebase_enabled = True
        logging.info("Firebase Admin SDK already initialized")
    else:
        logging.error(f"Firebase initialization error: {e}")
except Exception as e:
    logging.error(f"Firebase setup failed: {e}")
    logging.warning("Running without Firebase. Transaction features will be disabled.")

def extract_transaction_intent(message):
    """Extract transaction details from user message"""
    message_lower = message.lower()
    
    # Patterns for adding income
    income_patterns = [
        r'add (?:income|money|cash|salary|earning|credit)\s*(?:of\s*)?(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)',
        r'(?:income|earned|received|got|salary|credit)\s*(?:of\s*)?(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)',
        r'add (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)\s*(?:income|earning|salary|credit)',
        r'(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)\s*(?:income|earned|received|salary|credit)',
        r'credit (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)',
        r'deposit (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)'
    ]
    
    # Patterns for adding expenses
    expense_patterns = [
        r'add (?:expense|spent|spend|cost|paid|bill|debit)\s*(?:of\s*)?(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)',
        r'(?:spent|spend|paid|cost|expense|bill|debit)\s*(?:of\s*)?(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)',
        r'add (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)\s*(?:expense|spent|cost|bill)',
        r'(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)\s*(?:spent|expense|cost|paid|bill)',
        r'debit (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)',
        r'withdraw (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)'
    ]
    
    # Simple add patterns (default to expense)
    simple_add_patterns = [
        r'add (?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)',
        r'(?:rs\.?\s*|₹\s*)?(\d+(?:\.\d{2})?)'
    ]
    
    # Check for income patterns
    for pattern in income_patterns:
        match = re.search(pattern, message_lower)
        if match:
            amount = float(match.group(1))
            return {
                'type': 'income',
                'amount': amount,
                'description': f'Income added via chatbot'
            }
    
    # Check for expense patterns
    for pattern in expense_patterns:
        match = re.search(pattern, message_lower)
        if match:
            amount = float(match.group(1))
            return {
                'type': 'expense',
                'amount': amount,
                'description': f'Expense added via chatbot'
            }
    
    # Check for simple add patterns (default to expense if amount > 0)
    for pattern in simple_add_patterns:
        match = re.search(pattern, message_lower)
        if match and ('add' in message_lower or 'spent' in message_lower or 'expense' in message_lower):
            amount = float(match.group(1))
            return {
                'type': 'expense',
                'amount': amount,
                'description': f'Expense added via chatbot'
            }
    
    return None

def add_transaction_to_firebase(user_email, transaction_data):
    """Add transaction to Firebase"""
    try:
        doc_ref = db.collection('transactions').document(user_email)
        doc = doc_ref.get()
        
        current_data = doc.to_dict() if doc.exists else {'totalAmount': 0, 'transactions': []}
        
        # Create transaction object
        transaction = {
            'type': 'Income' if transaction_data['type'] == 'income' else 'Expense',
            'amount': transaction_data['amount'],
            'date': datetime.now().isoformat(),
            'createdAt': datetime.now().isoformat(),
            'source': 'Chatbot',
            'description': transaction_data['description']
        }
        
        # Update total amount
        if transaction_data['type'] == 'income':
            new_total = current_data['totalAmount'] + transaction_data['amount']
        else:
            new_total = current_data['totalAmount'] - transaction_data['amount']
        
        # Update document
        current_data['totalAmount'] = new_total
        current_data['transactions'].append(transaction)
        
        doc_ref.set(current_data)
        
        return {
            'success': True,
            'transaction': transaction,
            'new_balance': new_total
        }
    except Exception as e:
        logging.error(f"Firebase transaction error: {e}")
        return {
            'success': False,
            'error': str(e)
        }

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

    @app.route("/api/chat", methods=["POST"])  # Enhanced chat with transaction handling
    def chat() -> tuple:
        nonlocal groq_api_key

        try:
            data = request.get_json(silent=True) or {}
            user_message = (data.get("message") or "").strip()
            user_email = data.get("userEmail")  # Get user email for transactions
            history = data.get("history") or []  # Optional [{role, content}]

            if not user_message:
                return jsonify({"error": "Message is required"}), 400

            # Check if message contains transaction intent
            transaction_intent = extract_transaction_intent(user_message)
            
            if transaction_intent and user_email and firebase_enabled:
                # Process transaction
                result = add_transaction_to_firebase(user_email, transaction_intent)
                
                if result['success']:
                    transaction_type = "income" if transaction_intent['type'] == 'income' else "expense"
                    reply = f"✅ Successfully added {transaction_type} of ₹{transaction_intent['amount']:,.2f}! Your new balance is ₹{result['new_balance']:,.2f}."
                    
                    return jsonify({
                        "reply": reply,
                        "transaction": result['transaction'],
                        "newBalance": result['new_balance'],
                        "hasTransaction": True
                    }), 200
                else:
                    reply = f"❌ Sorry, I couldn't add the transaction. Error: {result['error']}"
                    return jsonify({"reply": reply}), 200
            
            elif transaction_intent and not firebase_enabled:
                reply = "I can detect that you want to add a transaction, but the database connection is not available. Please check the server configuration."
                return jsonify({"reply": reply}), 200
            
            elif transaction_intent and not user_email:
                reply = "I can help you add transactions, but I need you to be logged in first. Please sign in to your account."
                return jsonify({"reply": reply}), 200

            if not groq_api_key:
                # Provide a fallback response when Groq API is not available
                fallback_responses = [
                    "I'm here to help you with your finances! You can add transactions by saying things like 'Add income 5000' or 'I spent 200 on groceries'.",
                    "I can help you manage your money! Try commands like 'Add expense 150' or 'Credit 3000' to track your transactions.",
                    "Welcome to SmartSpendAI! I can help you track expenses and income. Just tell me about your transactions!",
                    "I'm your financial assistant! You can add transactions by saying 'Add income [amount]' or 'I spent [amount]'."
                ]
                import random
                reply = random.choice(fallback_responses)
                return jsonify({"reply": reply, "hasTransaction": False}), 200

            # Enhanced system prompt for financial assistant
            system_prompt = """You are SmartSpendAI's helpful financial assistant. You can help users with:

1. Adding transactions (income/expenses) - Examples:
   - "Add income of 5000" or "Add expense of 200"
   - "I spent 150 on groceries" or "I earned 3000 today"
   - "Credit 1000" or "Debit 500"

2. Financial advice and budgeting tips
3. Expense tracking guidance
4. Savings recommendations

Be clear, concise, and helpful. If users want to add transactions, guide them with examples like:
- "Add income 5000" to add income
- "Add expense 200" to add expense
- "I spent 150" to record spending

Always be encouraging about their financial journey!"""

            # Construct OpenAI-compatible Chat Completions payload for Groq
            messages = []
            messages.append({
                "role": "system",
                "content": system_prompt
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
                "temperature": 0.3,
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

            response_data = resp.json()
            reply = (
                (response_data.get("choices") or [{}])[0]
                .get("message", {})
                .get("content", "Sorry, I could not generate a response.")
            )

            return jsonify({"reply": reply, "hasTransaction": False}), 200
            
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


