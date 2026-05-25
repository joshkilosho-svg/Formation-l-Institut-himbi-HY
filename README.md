# Formation - Institut Himbi

Site d'inscription pour les formations : Arduino, Web, PCB, Win PLC.

## Contenu du dépôt
- /public : frontend (index.html, styles.css, script.js)
- /server : backend Node.js (Express) + sqlite3

## Installation locale
1. Clonez le dépôt :
   git clone https://github.com/joshkilosho-svg/Formation-l-Institut-himbi-HY.git
   cd Formation-l-Institut-himbi-HY

2. Installez les dépendances :
   npm install

3. Créez un fichier `.env` (ne pas pousser ce fichier). Exemple :

```
PORT=3000
SMTP_HOST=smtp.exemple.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre_user
SMTP_PASS=votre_mot_de_passe
SMTP_FROM="Institut Himbi <no-reply@exemple.com>"
ADMIN_EMAIL=admin@exemple.com
```

4. Lancez le serveur :
   npm start

5. Ouvrez votre navigateur : http://localhost:3000

Les inscriptions seront enregistrées dans le fichier `registrations.db` à la racine.

## Déploiement
- Render / Railway / Heroku (Node.js)
  - Déployez le dépôt avec la commande de démarrage : `npm start`
  - Ajoutez les variables d'environnement (`SMTP_*` et `ADMIN_EMAIL`)

## Note
- Si vous préférez héberger uniquement le frontend sur GitHub Pages, il faudra déployer le backend séparément (sur Render, Railway, etc.) et modifier `public/script.js` pour envoyer vers l'URL du backend.

