// Simple Express backend: server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const DB_FILE = path.join(__dirname, 'registrations.json');

function saveRegistration(data){
  let list = [];
  try{
    if(fs.existsSync(DB_FILE)){
      const raw = fs.readFileSync(DB_FILE);
      list = JSON.parse(raw || '[]');
    }
  } catch(e){ console.error('read db err', e) }
  list.push(data);
  fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2));
}

async function sendEmail(data){
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.RECEIVER_EMAIL;
  if(!host || !user || !pass || !receiver) return false;

  const transporter = nodemailer.createTransport({
    host, port, secure: Number(port) === 465, auth:{user, pass}
  });

  const html = `
    <h3>Nouvelle inscription</h3>
    <p><strong>Nom :</strong> ${data.fullname}</p>
    <p><strong>Email :</strong> ${data.email}</p>
    <p><strong>Téléphone :</strong> ${data.phone || '-'} </p>
    <p><strong>Module :</strong> ${data.module}</p>
    <p><strong>Message :</strong><br/>${data.message || '-'}</p>
    <p><em>Inscrit le ${data.createdAt}</em></p>
  `;

  await transporter.sendMail({
    from: user,
    to: receiver,
    subject: `Nouvelle inscription - ${data.module}`,
    html
  });
  return true;
}

app.post('/api/register', async (req, res)=>{
  const data = req.body || {};
  if(!data.fullname || !data.email || !data.module){
    return res.status(400).json({error:'Champs manquants.'});
  }

  data.createdAt = data.createdAt || new Date().toISOString();
  try{
    saveRegistration(data);
    await sendEmail(data);
    return res.json({ok:true});
  } catch(err){
    console.error(err);
    return res.status(500).json({error:'Erreur serveur.'});
  }
});

app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
