import express from "express"
import cors from "cors"
import OpenAI from "openai"

const app = express()

app.use(cors())
app.use(express.json())

const openai = new OpenAI({
apiKey: "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"
})

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