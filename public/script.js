// script.js - validation simple et envoi via fetch
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('registrationForm');
  const status = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    status.textContent = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
    const modules = Array.from(form.querySelectorAll('input[name="modules"]:checked')).map(i=>i.value);

    if(!name || !email){
      status.textContent = 'Le nom et l\'email sont requis.'; return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi...";

    try{
      const res = await fetch('/api/register', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({name,email,phone,modules,message})
      });
      const data = await res.json();
      if(res.ok && data.success){
        status.textContent = 'Inscription enregistrée. Merci !';
        form.reset();
      } else {
        status.textContent = data.error || 'Erreur lors de l\'inscription.';
      }
    }catch(err){
      console.error(err);
      status.textContent = 'Impossible de contacter le serveur.';
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = "S'inscrire";
    }
  });
});
