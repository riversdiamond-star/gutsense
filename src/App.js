import { useState } from "react";

function App() {

const timeBlocks = ["6-14","14-22","22-6"]

const [showModal,setShowModal] = useState(false)
const [selectedTime,setSelectedTime] = useState("")
const [modalType,setModalType] = useState("")

const [mealInput,setMealInput] = useState("")
const [symptomSeverity,setSymptomSeverity] = useState(5)
const [stoolType,setStoolType] = useState(4)

const [analysis,setAnalysis] = useState("")
const [loading,setLoading] = useState(false)

const [meals,setMeals] = useState(()=>{
const saved = localStorage.getItem("meals")

return saved ? JSON.parse(saved) : {
"6-14":[],
"14-22":[],
"22-6":[]
}
})

const [symptoms,setSymptoms] = useState({
"6-14":[],
"14-22":[],
"22-6":[]
})

const [stools,setStools] = useState({
"6-14":[],
"14-22":[],
"22-6":[]
})

const openModal=(time,type)=>{
setSelectedTime(time)
setModalType(type)
setShowModal(true)
}

const saveData=()=>{

if(modalType==="meal"){

if(!mealInput) return

const updated={...meals}

updated[selectedTime]=[
...updated[selectedTime],
{
food: mealInput,
time: new Date().toISOString()
}
]

setMeals(updated)
localStorage.setItem("meals", JSON.stringify(updated))
setMealInput("")
}

if(modalType==="symptom"){

const updated={...symptoms}

updated[selectedTime]=[
...updated[selectedTime],
{
severity: symptomSeverity,
time: new Date().toISOString()
}
]

setSymptoms(updated)
}

if(modalType==="stool"){

const updated={...stools}

updated[selectedTime]=[
...updated[selectedTime],
stoolType
]

setStools(updated)
}

setShowModal(false)
}

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

const clearDay = () => {

const emptyMeals={
"6-14":[],
"14-22":[],
"22-6":[]
}

const emptySymptoms={
"6-14":[],
"14-22":[],
"22-6":[]
}

const emptyStools={
"6-14":[],
"14-22":[],
"22-6":[]
}

setMeals(emptyMeals)
setSymptoms(emptySymptoms)
setStools(emptyStools)

localStorage.removeItem("meals")

}

return(

<div className="app-container">

<h1>Дневник СРК</h1>

<table border="1" cellPadding="15" style={{width:"100%"}}>

<thead>
<tr>
<th>Время</th>
<th>🍽 Еда</th>
<th>⚠️ Симптом</th>
<th>🚽 Стул</th>
</tr>
</thead>

<tbody>

{timeBlocks.map((time)=>(
<tr key={time}>

<td>{time}</td>

<td>

<button onClick={()=>openModal(time,"meal")}>
+
</button>

<div>

{meals[time].map((m,i)=>(
<div key={i}>{m.food}</div>
))}

</div>

</td>

<td>

<button onClick={()=>openModal(time,"symptom")}>
+
</button>

<div>

{symptoms[time].map((s,i)=>(
<div key={i}>severity {s.severity}</div>
))}

</div>

</td>

<td>

<button onClick={()=>openModal(time,"stool")}>
+
</button>

<div>

{stools[time].map((s,i)=>(
<div key={i}>type {s}</div>
))}

</div>

</td>

</tr>
))}

</tbody>

</table>

<br/>

<div style={{display:"flex",flexDirection:"column",gap:10}}>

<button onClick={analyzeData}>
Анализ ИИ
</button>

<button onClick={clearDay}>
Очистить день
</button>

</div>

<div style={{marginTop:30}}>

<h2>Анализ</h2>

{loading && <p>ИИ анализирует данные ⏳</p>}

<pre style={{whiteSpace:"pre-wrap"}}>
{analysis}
</pre>

</div>

{showModal && (

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.5)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{
background:"white",
padding:30,
borderRadius:10,
width:300
}}>

<h2>{modalType}</h2>

<p>Время: {selectedTime}</p>

{modalType==="meal" &&(

<input
value={mealInput}
onChange={(e)=>setMealInput(e.target.value)}
placeholder="Что вы ели?"
style={{
width:"100%",
padding:10,
fontSize:16,
marginTop:10,
boxSizing:"border-box"
}}
/>

)}

{modalType==="symptom" &&(

<div>

<p>Сила симптома (1-10)</p>

<input
type="range"
min="1"
max="10"
value={symptomSeverity}
onChange={(e)=>setSymptomSeverity(e.target.value)}
/>

<p>{symptomSeverity}</p>

</div>

)}

{modalType==="stool" &&(

<div>

<p>Bristol scale (1-7)</p>

<input
type="range"
min="1"
max="7"
value={stoolType}
onChange={(e)=>setStoolType(e.target.value)}
/>

<p>{stoolType}</p>

</div>

)}

<br/>

<button onClick={saveData}>
Сохранить
</button>

<button
onClick={()=>setShowModal(false)}
style={{marginLeft:10}}
>
Закрыть
</button>

</div>

</div>

)}

</div>

)

}

export default App