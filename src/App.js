import { useState } from "react";

function App() {

const [mealInput,setMealInput] = useState("")
const [selectedTime,setSelectedTime] = useState("now")

const [analysis,setAnalysis] = useState("")
const [loading,setLoading] = useState(false)

const [meals,setMeals] = useState(()=>{
const saved = localStorage.getItem("meals")
return saved ? JSON.parse(saved) : []
})

const [symptoms,setSymptoms] = useState(()=>{
const saved = localStorage.getItem("symptoms")
return saved ? JSON.parse(saved) : []
})

const [stools,setStools] = useState(()=>{
const saved = localStorage.getItem("stools")
return saved ? JSON.parse(saved) : []
})


// 🔹 ДОБАВЛЕНИЕ ЕДЫ
const addMeal = (food)=>{

const newItem = {
food,
time: new Date().toISOString(),
selectedTime
}

const updated = [...meals, newItem]

setMeals(updated)
localStorage.setItem("meals", JSON.stringify(updated))
}


// 🔹 СИМПТОМЫ (иконки)
const addSymptom = (value)=>{

const newItem = {
severity:value,
time:new Date().toISOString()
}

const updated = [...symptoms,newItem]

setSymptoms(updated)
localStorage.setItem("symptoms", JSON.stringify(updated))
}


// 🔹 АНАЛИЗ
const analyzeData = async ()=>{

setLoading(true)

const data={
meals,
symptoms,
stools
}

const response = await fetch("https://gutsense-api.onrender.com/analyze",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
})

const result = await response.json()

setAnalysis(result.analysis)
setLoading(false)

}


// 🔹 ОЧИСТКА
const clearDay = () => {

setMeals([])
setSymptoms([])
setStools([])

localStorage.removeItem("meals")
localStorage.removeItem("symptoms")
localStorage.removeItem("stools")

setAnalysis("")
setLoading(false)

}


return(

<div style={{padding:20,fontFamily:"Arial"}}>

<h2>Сегодня</h2>


{/* ЕДА */}
<p>Что ты ел?</p>

<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>

{["🍞","🥛","🍗","🥤","🍎","🥗","🍫","+"].map((item,i)=>(
<div
key={i}
onClick={()=>{
if(item === "+"){
if(mealInput) addMeal(mealInput)
} else {
addMeal(item)
}
}}
style={{
padding:15,
background:"white",
borderRadius:10,
textAlign:"center",
fontSize:20,
cursor:"pointer",
border:"1px solid #ddd"
}}
>
{item}
</div>
))}

</div>


{/* ВВОД */}
<input
placeholder="или впиши..."
value={mealInput}
onChange={(e)=>setMealInput(e.target.value)}
style={{
width:"100%",
marginTop:10,
padding:10,
fontSize:16
}}
/>


{/* ВРЕМЯ */}
<p style={{marginTop:10}}>🕒</p>

<select
value={selectedTime}
onChange={(e)=>setSelectedTime(e.target.value)}
style={{padding:10,width:"100%"}}
>
<option value="now">Сейчас</option>
<option value="30min">30 мин назад</option>
<option value="1h">1 час назад</option>
<option value="2h">2 часа назад</option>
</select>


{/* СИМПТОМЫ */}
<p style={{marginTop:20}}>Как ты себя чувствуешь?</p>

<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>

{[
{icon:"🤕",value:8},
{icon:"💨",value:6},
{icon:"🚽",value:7},
{icon:"😐",value:3}
].map((s,i)=>(
<div
key={i}
onClick={()=>addSymptom(s.value)}
style={{
padding:15,
background:"white",
borderRadius:10,
textAlign:"center",
fontSize:20,
cursor:"pointer",
border:"1px solid #ddd"
}}
>
{s.icon}
</div>
))}

</div>


{/* КНОПКИ */}
<div style={{display:"flex",flexDirection:"column",gap:10,marginTop:20}}>

<button onClick={analyzeData}>
Анализ ИИ
</button>

<button onClick={clearDay}>
Очистить день
</button>

</div>


{/* АНАЛИЗ */}
<div style={{marginTop:30}}>

<h3>Анализ</h3>

{loading && <p>ИИ анализирует ⏳</p>}

{analysis && (
<pre style={{whiteSpace:"pre-wrap"}}>
{analysis}
</pre>
)}

</div>

</div>

)

}

export default App