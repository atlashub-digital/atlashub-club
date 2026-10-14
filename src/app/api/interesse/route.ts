import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
type Lead={name?:unknown;email?:unknown;interest?:unknown;device?:unknown;consent?:unknown;website?:unknown;turnstileToken?:unknown};
const validInterests=new Set(["club","genesis","lab","workshops"]);
const validDevices=new Set(["mobile","computer","shared","none"]);
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export async function POST(req:NextRequest){
 const siteOrigin=process.env.CLUB_SITE_ORIGIN;
 const url=process.env.SUPABASE_URL;
 const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
 const turnstile=process.env.TURNSTILE_SECRET_KEY;
 // Fail closed until all external dependencies, consent texts and anti-abuse are homologated.
 if(!siteOrigin||!url||!service||!turnstile)return NextResponse.json({message:"Registos indisponíveis."},{status:503});
 if(req.headers.get("origin")!==siteOrigin)return NextResponse.json({message:"Pedido inválido."},{status:403});
 if(!req.headers.get("content-type")?.startsWith("application/json"))return NextResponse.json({message:"Formato inválido."},{status:415});
 if(Number(req.headers.get("content-length")||0)>4096)return NextResponse.json({message:"Pedido demasiado grande."},{status:413});
 let body:Lead;
 try{const raw=await req.text();if(raw.length>4096)return NextResponse.json({message:"Pedido demasiado grande."},{status:413});body=JSON.parse(raw) as Lead;}catch{return NextResponse.json({message:"Pedido inválido."},{status:400});}
 if(body.website)return NextResponse.json({ok:true},{status:201}); // honeypot: neutral response
 const name=typeof body.name==="string"?body.name.trim():"";
 const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
 const interest=typeof body.interest==="string"?body.interest:"";
 const device=typeof body.device==="string"?body.device:"";
 const token=typeof body.turnstileToken==="string"?body.turnstileToken:"";
 if(name.length<2||name.length>90||email.length>190||!emailPattern.test(email)||!validInterests.has(interest)||!validDevices.has(device)||body.consent!==true||token.length<10||token.length>4000)return NextResponse.json({message:"Verifica os dados e o consentimento."},{status:400});
 try{
  const verify=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({secret:turnstile,response:token}),cache:"no-store"});
  if(!verify.ok)return NextResponse.json({message:"Validação indisponível."},{status:503});
  const verdict=(await verify.json()) as {success?:boolean;hostname?:string};
  if(!verdict.success)return NextResponse.json({message:"Não foi possível validar a tentativa."},{status:400});
  if(verdict.hostname && verdict.hostname!==new URL(siteOrigin).hostname)return NextResponse.json({message:"Origem inválida."},{status:403});
  const target=url.replace(/\/$/,"")+"/rest/v1/club_interest";
  const save=await fetch(target,{method:"POST",headers:{"Content-Type":"application/json",apikey:service,Authorization:"Bearer "+service,Prefer:"return=minimal"},body:JSON.stringify({name,email,interest,device,consent:true,consent_version:"draft-club-2026-10-13"}),cache:"no-store"});
  if(!save.ok){if(save.status===409)return NextResponse.json({ok:true},{status:201});return NextResponse.json({message:"Registo temporariamente indisponível."},{status:503});}
  return NextResponse.json({ok:true},{status:201});
 }catch{return NextResponse.json({message:"Registo temporariamente indisponível."},{status:503});}
}
