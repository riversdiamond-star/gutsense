import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

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