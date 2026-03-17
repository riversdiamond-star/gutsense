from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

import os

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.json

    meals = data.get("meals")
    symptoms = data.get("symptoms")
    stools = data.get("stools")

    prompt = f"""
You are an IBS expert.

Analyze the data and return ONLY a short interpretation.

Do NOT show analysis steps.
Do NOT show tables.
Do NOT explain reasoning.

Return ONLY:

Possible triggers:
- food → effect

Safe foods:
- food

Meals:
{meals}

Symptoms:
{symptoms}

Stools:
{stools}
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    analysis = response.choices[0].message.content

    return jsonify({"analysis": analysis})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)