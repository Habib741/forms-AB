# Le petit mot

Un formulaire en français avec deux champs : un numéro de téléphone facultatif
et un message. Les réponses sont enregistrées dans un Google Sheets privé.

## Connecter les réponses à Google Sheets

1. Crée un Google Sheets pour recevoir les réponses.
2. Dans le tableau, ouvre **Extensions → Apps Script**.
3. Remplace le contenu de l’éditeur par le code de [`google-apps-script.gs`](./google-apps-script.gs), puis enregistre.
4. Dans Apps Script, choisis **Déployer → Nouveau déploiement → Application Web**.
5. Sélectionne **Exécuter en tant que : Moi** et **Qui a accès : Tout le monde**, puis déploie et autorise l’accès demandé par Google.
6. Copie l’URL de l’application Web qui se termine par `/exec`.
7. Crée un fichier `.env.local` à la racine du projet et ajoute :

   ```env
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/TON_ID_DE_DEPLOIEMENT/exec
   ```

Le tableau reste privé dans ton compte Google. Seule l’application Web reçoit
les messages. Ne partage pas le Google Sheets lui-même si tu veux garder les
réponses privées.

## Lancer le projet

Installe les dépendances, puis démarre le serveur :

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). Après avoir modifié
`.env.local`, redémarre le serveur.

Pour publier le formulaire, configure `GOOGLE_APPS_SCRIPT_URL` dans les
variables d’environnement de l’hébergeur, puis redéploie le projet.
