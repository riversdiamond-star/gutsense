from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(
    api_key="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"
)

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.json

    meals = data.get("meals")
    symptoms = data.get("symptoms")
    stools = data.get("stools")

    prompt = f"""
Analyze possible IBS triggers.

Meals:
{meals}

Symptoms:
{symptoms}

Stools:
{stools}

Find correlations between food and symptoms.
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