import { useState } from "react";

function App() {

const [mealInput,setMealInput] = useState("")
const [selectedTime,setSelectedTime] = useState("now")

const [analysis,setAnalysis] = useState("")
const [loading,setLoading] = useState(false)

const [showStoolModal,setShowStoolModal] = useState(false)

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


// 🔹 ЕДА
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


// 🔹 СИМПТОМЫ
const addSymptom = (value)=>{

const newItem = {
severity:value,
time:new Date().toISOString()
}

const updated = [...symptoms,newItem]

setSymptoms(updated)
localStorage.setItem("symptoms", JSON.stringify(updated))
}


// 🔹 СТУЛ
const addStool = (type)=>{

const newItem = {
type,
time:new Date().toISOString()
}

const updated = [...stools,newItem]

setStools(updated)
localStorage.setItem("stools", JSON.stringify(updated))

setShowStoolModal(false)
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
borderRadius:12,
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


<input
placeholder="или впиши..."
value={mealInput}
onChange={(e)=>setMealInput(e.target.value)}
style={{
width:"100%",
marginTop:10,
padding:12,
fontSize:16,
borderRadius:10,
border:"1px solid #ddd"
}}
/>


{/* ВРЕМЯ */}
<p style={{marginTop:10}}>🕒</p>

<select
value={selectedTime}
onChange={(e)=>setSelectedTime(e.target.value)}
style={{
padding:12,
width:"100%",
borderRadius:10,
border:"1px solid #ddd"
}}
>
<option value="now">Сейчас</option>
<option value="30min">30 мин назад</option>
<option value="1h">1 час назад</option>
<option value="2h">2 часа назад</option>
</select>


{/* СИМПТОМЫ */}
<p style={{marginTop:20}}>Как ты себя чувствуешь?</p>

<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>

{[
{icon:"🤕",label:"Боль",value:8},
{icon:"💨",label:"Вздутие",value:6},
{icon:"🚽",label:"Стул",value:"stool"},
{icon:"🙂",label:"Ок",value:2}
].map((s,i)=>(
<div
key={i}
onClick={()=>{
if(s.value === "stool"){
setShowStoolModal(true)
} else {
addSymptom(s.value)
}
}}
style={{
padding:14,
background:"white",
borderRadius:12,
textAlign:"center",
cursor:"pointer",
border:"1px solid #ddd"
}}
>
<div style={{fontSize:22}}>{s.icon}</div>
<div style={{fontSize:13,marginTop:6}}>{s.label}</div>
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


{/* 🔥 BOTTOM SHEET */}
{showStoolModal && (

<div style={{
position:"fixed",
bottom:0,
left:0,
width:"100%",
background:"white",
borderTopLeftRadius:20,
borderTopRightRadius:20,
padding:20,
boxShadow:"0 -2px 10px rgba(0,0,0,0.2)"
}}>

<div style={{
maxWidth:400,
margin:"0 auto",
padding:"0 10px"
}}>

<h3>Какой стул?</h3>

<div style={{display:"flex",flexDirection:"column",gap:12}}>

{[
{label:"💧 Жидкий", type:"liquid"},
{label:"🟤 Нормальный", type:"normal"},
{label:"🧱 Твёрдый", type:"hard"}
].map((item,i)=>(
<div
key={i}
onClick={()=>addStool(item.type)}
style={{
padding:14,
borderRadius:12,
background:"#f2f2f2",
textAlign:"center",
fontSize:16,
cursor:"pointer",
width:"100%",
maxWidth:300,
margin:"0 auto"
}}
>
{item.label}
</div>
))}

<div
onClick={()=>setShowStoolModal(false)}
style={{
padding:14,
borderRadius:12,
background:"#e0e0e0",
textAlign:"center",
fontSize:16,
cursor:"pointer",
width:"100%",
maxWidth:300,
margin:"0 auto"
}}
>
Отмена
</div>

</div>

</div>

</div>

)}

</div>

)

}

export default App