import express from "express"
import cors from "cors"
import OpenAI from "openai"

const app = express()

app.use(cors())
app.use(express.json())

app.post("/analyze", async (req,res)=>{

const {meals, symptoms, stools} = req.body

const prompt = `
You are an IBS analysis assistant.

Analyze the following IBS diary data.

Meals:
${JSON.stringify(meals)}

Symptoms:
${JSON.stringify(symptoms)}

Stools:
${JSON.stringify(stools)}

Return the analysis as JSON in this format:

{
 "triggers": [],
 "symptoms": [],
 "stools": [],
 "recommendations": []
}

const completion = await openai.chat.completions.create({
model:"gpt-4.1-mini",
messages:[
{role:"user",content: prompt}
]
})

res.json({
analysis: completion.choices[0].message.content
})

})

app.listen(5000,()=>{
console.log("server running")
})