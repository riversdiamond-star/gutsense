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
You are an IBS specialist analyzing a food and symptom diary.

Write a SHORT interpretation (5–7 sentences).
Do NOT show analysis steps.
Do NOT show tables.
Do NOT show "Step 1 / Step 2".

Explain:
1. Which food is the most likely trigger and why.
2. Which foods appear safe.
3. Give a short recommendation.

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