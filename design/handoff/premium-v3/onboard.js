(()=>{
  const panels=[...document.querySelectorAll('[data-panel]')];
  const steps=[...document.querySelectorAll('[data-step-ind]')];
  const pick=[...document.querySelectorAll('[data-plan]')];
  const student=document.querySelector('#student');
  const back=document.querySelector('#back');const next=document.querySelector('#next');
  let step=0;
  const qs=new URLSearchParams(location.search);
  let plan=qs.get('plan')==='genesis'?'genesis':'free';
  student.checked=plan==='genesis'&&qs.get('student')==='1';
  function price(){return plan==='free'?'Grátis':student.checked?'R$ 190':'R$ 490'}
  function update(){
    panels.forEach((x,i)=>x.classList.toggle('active',i===step));
    steps.forEach((x,i)=>{x.classList.toggle('on',i===step);x.classList.toggle('done',i<step)});
    pick.forEach(p=>p.classList.toggle('selected',p.dataset.plan===plan));
    student.disabled=plan!=='genesis';if(plan!=='genesis')student.checked=false;
    document.querySelector('#summaryTitle').textContent=plan==='free'?'Club Atlas':'Genesis · Turma 01';
    document.querySelector('#summaryPrice').textContent=price();
    document.querySelector('#summaryPrice').classList.toggle('free',plan==='free');
    document.querySelector('#summaryDesc').textContent=plan==='free'?'Um lugar para aprender, conhecer pessoas e começar a construir com agentes.':student.checked?'Solicitação de condição estudante, sujeita à comprovação e validação antes da cobrança.':'Jornada guiada de 8 semanas, 24 ateliers previstos e comunidade incluída.';
    document.querySelector('#reviewPlan').textContent=plan==='free'?'Club Atlas · gratuito':'Genesis · Turma 01';
    document.querySelector('#reviewValue').textContent=price();
    document.querySelector('#reviewBenefit').textContent=plan==='free'?'Comunidade aberta':student.checked?'Desconto estudante pendente de validação':'Oito semanas e comunidade';
    back.style.visibility=step===0?'hidden':'visible'; next.textContent=step===3?'Concluir demonstração ✓':'Continuar →';
  }
  pick.forEach(p=>p.addEventListener('click',()=>{plan=p.dataset.plan;update()}));
  student.addEventListener('change',update);
  back.addEventListener('click',()=>{step=Math.max(0,step-1);update()});
  next.addEventListener('click',()=>{
    if(step===3){const x=document.querySelector('#demoResult');x.style.display='block';x.innerHTML='<b style="color:#84ecff">Fim da pré-visualização.</b> Nenhum registo foi enviado e nenhum pagamento foi iniciado. A equipa deverá ligar Auth, elegibilidade, consentimentos e checkout depois dos testes.';return}
    step=Math.min(3,step+1);update();
  });
  update();
})();
