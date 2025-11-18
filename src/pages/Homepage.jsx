import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDarkMode } from "../context/DarkModeContext.jsx";

const STORAGE_KEY = "ai_routine_classes_v3";
const WEEK_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function timeToMinutes(t){ const [hh,mm]=t.split(":").map(Number); return hh*60+mm;}
function minutesToTime(mins){const hh=Math.floor(mins/60).toString().padStart(2,"0"); const mm=(mins%60).toString().padStart(2,"0"); return `${hh}:${mm}`;}

const Homepage = () => {
  const { darkMode } = useDarkMode();
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    teacher: "",
    room: "",
    day: WEEK_DAYS[new Date().getDay()],
    time: "09:00",
    duration: 60 ,
    remindBefore: 10,
  });
  const [viewAllWeek, setViewAllWeek] = useState(false); // toggle for today / all week
  const remindedRef = useRef({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){ try{ setClasses(JSON.parse(raw)) }catch{ setClasses([]); }}
  }, []);

  useEffect(()=>{ localStorage.setItem(STORAGE_KEY, JSON.stringify(classes)) }, [classes]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(()=>{
    const interval=setInterval(checkReminders,30000);
    checkReminders();
    return ()=>clearInterval(interval);
  },[classes]);

  function checkReminders(){
    const now=new Date();
    const currentMinutes=now.getHours()*60+now.getMinutes();

    classes.forEach(c=>{
      if(!remindedRef.current[c.id]){
        const classMinutes=timeToMinutes(c.time);
        const minsUntil=classMinutes - currentMinutes;
        const todayName=WEEK_DAYS[now.getDay()];
        const remindBefore=c.remindBefore||10;
        if(c.day===todayName && minsUntil <= remindBefore && minsUntil >=0){
          remindedRef.current[c.id] = true;
          toast.info(`⏳ "${c.subject}" in ${minsUntil} minutes (${c.time})`, {position:"top-right", autoClose:8000});
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("AI Routine Reminder", {
              body: `"${c.subject}" in ${minsUntil} minutes (${c.time})`,
              icon: "/icon-192.png",
            });
          }
        }
      }
    });
  }

  const handleChange=e=>{ const {name,value}=e.target; setForm(s=>({...s,[name]:value})); };
  const addClass=e=>{ 
    e.preventDefault(); 
    if(!form.subject.trim()||!form.time){toast.warn("Provide subject and time"); return;} 
    const newItem={
      id:`${Date.now()}-${Math.floor(Math.random()*10000)}`, 
      subject:form.subject.trim(), 
      teacher:form.teacher.trim(), 
      room:form.room.trim(), 
      day:form.day, 
      time:form.time, 
      duration:Number(form.duration)||60,
      remindBefore:Number(form.remindBefore)||10,
    }; 
    setClasses(prev=>[...prev,newItem]); 
    setForm(s=>({...s,subject:"",teacher:"",room:"",duration:60, remindBefore:10})); 
    toast.success("Class added"); 
  };
  const removeClass=id=>{ 
    if(!window.confirm("Delete this class?")) return; 
    setClasses(prev=>prev.filter(c=>c.id!==id)); 
    toast.success("Removed"); 
  };

  const now=new Date();
  const todayName=WEEK_DAYS[now.getDay()];
  const currentMinutes=now.getHours()*60+now.getMinutes();

  // Group classes by day
  const classesByDay = WEEK_DAYS.map(day=>{
    return {
      day,
      classes: classes
        .filter(c=>c.day===day)
        .map(c=>({...c,startMins:timeToMinutes(c.time),endMins:timeToMinutes(c.time)+Number(c.duration||60)}))
        .sort((a,b)=>a.startMins-b.startMins)
    }
  });

  // Today's classes only
  const todaysClasses = classesByDay.find(d=>d.day===todayName)?.classes || [];

  return (
    <div className={`min-h-screen flex flex-col items-center p-6 transition-colors duration-300 ${darkMode?"bg-gradient-to-br from-[#0f172a] via-[#071126] to-[#061226] text-white":"bg-gradient-to-br from-purple-300 via-purple-500 to-purple-300 text-black"}`}>
      <ToastContainer />
      <header className="w-full max-w-5xl mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">AI_Routine_Maker</h1>
          <p className={`text-sm mt-1 ${darkMode?"text-white/70":"text-black/70"}`}>Manage your class routine — reminders & local save.</p>
        </div>
        <button 
          onClick={()=>setViewAllWeek(!viewAllWeek)}
          className="btn btn-sm btn-outline"
        >
          {viewAllWeek ? "Show Today" : "Show All Week"}
        </button>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Class */}
        <section className={`md:col-span-1 p-4 rounded-2xl backdrop-blur-sm border ${darkMode?"border-white/10":"border-black/10"}`}>
          <h2 className="font-semibold text-xl mb-3">Add Class</h2>
          <form onSubmit={addClass} className="space-y-3">
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className={`input input-bordered w-full ${darkMode?"bg-white/10 text-white placeholder-white/50":"bg-white text-black placeholder-gray-500"}`} required />
            <input name="teacher" value={form.teacher} onChange={handleChange} placeholder="Teacher (optional)" className={`input input-bordered w-full ${darkMode?"bg-white/10 text-white placeholder-white/50":"bg-white text-black placeholder-gray-500"}`} />
            <input name="room" value={form.room} onChange={handleChange} placeholder="Room (optional)" className={`input input-bordered w-full ${darkMode?"bg-white/10 text-white placeholder-white/50":"bg-white text-black placeholder-gray-500"}`} />
            <div className="flex gap-2">
              <select name="day" value={form.day} onChange={handleChange} className={`select select-bordered flex-1 ${darkMode?"bg-white/10 text-white":"bg-white text-black"}`}>
                {WEEK_DAYS.map(d=><option key={d} value={d} className={`${darkMode?"bg-[#0f172a] text-white":"bg-white text-black"}`}>{d}</option>)}
              </select>
              <input name="time" type="time" value={form.time} onChange={handleChange} className={`input input-bordered w-32 ${darkMode?"bg-white/10 text-white":"bg-white text-black"}`} required/>
            </div>
            <div className="flex gap-2">
              <input name="duration" value={form.duration} onChange={handleChange} type="number" min="5" className={`input input-bordered w-32 ${darkMode?"bg-white/10 text-white":"bg-white text-black"}`} placeholder="Duration (min)" />
              <input name="remindBefore" value={form.remindBefore} onChange={handleChange} type="number" min="1" className={`input input-bordered w-32 ${darkMode?"bg-white/10 text-white":"bg-white text-black"}`} placeholder="Remind before (min)" />
              <button type="submit" className="btn btn-primary flex-1">Add Class</button>
            </div>
          </form>
        </section>

        {/* Classes view */}
        <section className={`md:col-span-2 p-4 rounded-2xl backdrop-blur-sm border ${darkMode?"border-white/10":"border-black/10"}`}>
          <h2 className="text-xl font-semibold mb-3">{viewAllWeek ? "All Week Classes" : "Today's Classes"}</h2>
          <div className="space-y-4">
            {(viewAllWeek ? classesByDay : [{day:todayName, classes:todaysClasses}]).map(dayGroup=>{
              return (
                <div key={dayGroup.day} className="space-y-2">
                  {viewAllWeek && <h3 className={`font-semibold ${dayGroup.day===todayName?"text-primary":"opacity-80"}`}>{dayGroup.day}</h3>}
                  {dayGroup.classes.length===0 ? (
                    <div className={`p-3 rounded-lg border ${darkMode?"border-white/10 text-white/70":"border-black/10 text-black/70"}`}>No classes</div>
                  ) : (
                    dayGroup.classes.map(c=>{
                      const isToday = c.day===todayName;
                      const isOngoing = isToday && currentMinutes>=c.startMins && currentMinutes<c.endMins;
                      return (
                        <div key={c.id} className={`p-3 rounded-lg flex justify-between items-center border transition-colors duration-300 ${isOngoing?"bg-gradient-to-r from-[#07324a] to-[#0b394e] border-primary":`bg-transparent ${darkMode?"border-white/5":"border-black/10"}`}`}>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <div className="font-medium">{c.subject}</div>
                              <div className="text-xs opacity-60">• {c.teacher || "—"}</div>
                              <div className="ml-2 text-xs opacity-50">({c.room || "Room"})</div>
                            </div>
                            <div className="text-sm opacity-70 mt-1">
                              {c.time} - {minutesToTime(c.endMins)} ({c.duration} min)
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={()=>{ navigator.clipboard?.writeText(`${c.subject} — ${c.time} (${c.duration}m) — ${c.room} — ${c.teacher}`); toast.success("Copied") }} className="btn btn-xs btn-ghost">Copy</button>
                            <button onClick={()=>removeClass(c.id)} className="btn btn-xs btn-outline btn-error">Delete</button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
