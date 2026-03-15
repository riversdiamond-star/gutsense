import OpenAI from "openai";

export async function analyzeGut(meals, symptoms) {

  const prompt = `
  Analyze possible IBS triggers.

  Meals:
  ${JSON.stringify(meals)}

  Symptoms:
  ${JSON.stringify(symptoms)}

  Find possible food triggers.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0].message.content;
}