type Props={size?:number;glow?:boolean;className?:string};
export default function AtlasMark({size=40,glow=false,className=""}:Props){
 return <svg className={className} role="img" aria-label="Símbolo triangular Club Atlas (versão vetorial provisória)" width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
 <defs><linearGradient id="atlasG" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"><stop stopColor="#4AF1FF"/><stop offset="1" stopColor="#1361FF"/></linearGradient></defs>
 <path d="M52 11 Q56 11 59 17 L92 78 Q97 88 86 88 L76 88 Q72 88 69 82 L40 30 Q37 25 41 20 L47 13 Q49 11 52 11Z" fill="url(#atlasG)"/>
 <path d="M36 36 Q40 32 44 38 L48 45 Q50 49 47 53 L25 84 Q23 88 18 88 L11 88 Q4 88 7 81 L31 42 Q33 38 36 36Z" fill="#EAFBFF"/>
 <path d="M45 71 Q46 69 49 69 L62 69 Q65 69 66 71 L72 83 Q74 88 68 88 L36 88 Q31 88 34 83Z" fill="#BCE9FF"/>
 {glow&&<circle cx="50" cy="50" r="47" stroke="#28D5FF" strokeOpacity=".42" strokeWidth=".7"/>}
 </svg>;
}
