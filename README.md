# Formation - Institut Himbi

Ce dépôt contient un site web responsive pour l'inscription aux formations de l'Institut Himbi : Arduino, Web, PCB et Win PLC.

Contenu :
- Frontend : index.html, styles.css, script.js
- Backend : server.js (Node.js + Express)

Installation locale (Node.js)
1. Clonez le dépôt
   git clone https://github.com/joshkilosho-svg/Formation-l-Institut-himbi-HY.git
2. Allez dans le dossier
   cd Formation-l-Institut-himbi-HY
3. Installez les dépendances
   npm install
4. Configurez les variables d'environnement (exemple pour .env):
   PORT=3000
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=you@example.com
   SMTP_PASS=yourpassword
   RECEIVER_EMAIL=orga@example.com
5. Démarrez le serveur
   npm start

Déploiement
- Vous pouvez déployer sur Render, Heroku ou un VPS. Assurez-vous de configurer les variables d'environnement pour l'envoi des emails.

Sécurité
- Ne laissez jamais vos identifiants SMTP en clair dans le repo. Utilisez des variables d'environnement.
