// script.js - validation et envoi
document.getElementById('year').textContent = new Date().getFullYear();
const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  formMessage.textContent = '';

  const data = {
    fullname: form.fullname.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    module: form.module.value,
    message: form.message.value.trim(),
    createdAt: new Date().toISOString()
  };

  if(!data.fullname || !data.email || !data.module){
    formMessage.style.color = 'crimson';
    formMessage.textContent = 'Veuillez remplir tous les champs requis.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi...";

  try{
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if(res.ok){
      formMessage.style.color = 'green';
      formMessage.textContent = 'Inscription réussie. Un email de confirmation a été envoyé.';
      form.reset();
    } else {
      formMessage.style.color = 'crimson';
      formMessage.textContent = json?.error || 'Erreur serveur.';
    }
  } catch(err){
    formMessage.style.color = 'crimson';
    formMessage.textContent = 'Impossible de contacter le serveur.';
  } finally{
    submitBtn.disabled = false;
    submitBtn.textContent = "S'inscrire";
  }
});
