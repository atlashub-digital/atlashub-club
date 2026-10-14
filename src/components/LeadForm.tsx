"use client";
import {useState} from "react";
import Script from "next/script";
type Status="idle"|"loading"|"success"|"error";
const siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export default function LeadForm(){
 const [status,setStatus]=useState<Status>("idle");
 const [feedback,setFeedback]=useState("");
 async function handleSubmit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault(); if(!siteKey)return;
  const form=event.currentTarget;
  const data=new FormData(form);
  const body={name:String(data.get("name")||""),email:String(data.get("email")||""),interest:String(data.get("interest")||"club"),device:String(data.get("device")||""),consent:data.get("consent")==="yes",website:String(data.get("website")||""),turnstileToken:String(data.get("cf-turnstile-response")||"")};
  setStatus("loading");setFeedback("");
  try{const response=await fetch("/api/interesse",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
   if(!response.ok)throw Error("Não foi possível concluir o pedido. Tente mais tarde ou acompanhe os canais oficiais.");
   setStatus("success");setFeedback("Pedido recebido. Ainda não é uma matrícula ou acesso automático.");form.reset();
  }catch(e){setStatus("error");setFeedback(e instanceof Error?e.message:"Erro inesperado.");}
 }
 return <form onSubmit={handleSubmit} className="glass lead-panel">
  <span className="mini-tag">COMUNIDADE · PRÉ-CANDIDATURA</span><h2>Começa pela tua curiosidade.</h2>
  <p>Regista interesse no Club gratuito ou na Turma Genesis. A pré-candidatura não representa reserva de vaga nem cobrança.</p>
  {!siteKey&&<div className="notice" role="status">O registo está em preparação e ainda não recebe dados. A equipa precisa de validar privacidade, anti-abuso e base de dados antes de o ativar.</div>}
  <label className="field"><span>Nome</span><input type="text" name="name" required minLength={2} maxLength={90} autoComplete="name" disabled={!siteKey}/></label>
  <label className="field"><span>Email</span><input type="email" name="email" required maxLength={190} autoComplete="email" disabled={!siteKey}/></label>
  <label className="field"><span>O que mais te interessa?</span><select name="interest" disabled={!siteKey}><option value="club">Entrar no Club Atlas gratuito</option><option value="genesis">Pré-candidatura Genesis Turma 01</option><option value="lab">Atlas Lab e agentes pessoais</option><option value="workshops">Workshops empresariais</option></select></label>
  <label className="field"><span>Equipamento para participar</span><select name="device" disabled={!siteKey}><option value="mobile">Tenho apenas telemóvel</option><option value="computer">Tenho computador</option><option value="shared">Tenho equipamento partilhado</option><option value="none">Não tenho equipamento próprio</option></select></label>
  <label className="hidden-robot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
  <label className="check-field"><input type="checkbox" name="consent" value="yes" required disabled={!siteKey}/><span>Quero receber informações do Club Atlas e aceito o tratamento dos dados informados para responder a esta inscrição de interesse. Li o <a className="accent" href="/privacidade">aviso de privacidade</a>. Posso solicitar remoção posteriormente.</span></label>
  {siteKey&&<><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive"/><div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark"/></>}
  <button className="button primary" type="submit" disabled={!siteKey||status==="loading"}>{status==="loading"?"A enviar…":"Manifestar interesse →"}</button>
  {feedback&&<div role={status==="error"?"alert":"status"} className="notice">{feedback}</div>}
 </form>;
}
