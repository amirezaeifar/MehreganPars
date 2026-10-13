export function isoDate(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function shiftDate(date:string,days:number){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+days);return isoDate(d)}
const persianParts=new Intl.DateTimeFormat('en-US-u-ca-persian',{day:'numeric',month:'numeric',year:'numeric'})
export function persianDay(date:string){return Number(persianParts.formatToParts(new Date(date+'T12:00:00')).find(p=>p.type==='day')!.value)}
export function monthStart(date:string){return shiftDate(date,1-persianDay(date))}
export function moveMonth(date:string,offset:number){const start=monthStart(date);return offset>0?monthStart(shiftDate(start,32)):monthStart(shiftDate(start,-1))}
export function weekStart(date:string){return shiftDate(date,-((new Date(date+'T12:00:00').getDay()+1)%7))}
export function monthDays(date:string){const first=monthStart(date),next=moveMonth(first,1),length=Math.round((new Date(next+'T12:00:00').getTime()-new Date(first+'T12:00:00').getTime())/86400000);const start=weekStart(first);const lead=Math.round((new Date(first+'T12:00:00').getTime()-new Date(start+'T12:00:00').getTime())/86400000);return Array.from({length:Math.ceil((lead+length)/7)*7},(_,i)=>shiftDate(start,i))}
export const minutes=(time:string)=>Number(time.slice(0,2))*60+Number(time.slice(3,5))
