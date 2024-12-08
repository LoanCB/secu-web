# Partie Sécurisée

## Lancer le projet

```bash
docker compose up -d
```

## Urls

front : [http://localhost:3117](http://localhost:3117)

back Swagger : [http://localhost:3118/api-docs](http://localhost:3118/api-docs)

back endpoints : [http://localhost:3118/api/v1](http://localhost:3118/api/v1)

phpMyAdmin : [http://localhost:3116](http://localhost:3116)

Vous pouvez retrouver tous les endpoints dans une collection Bruno dans le dossier `back/bruno`

## Comptes

Admin :

- email : `admin@admin.com`
- password : `adminadmin`

Utilisateur simple :

- email : `user@user.com`
- password: `Azerty1@`

PhpMyAdmin :

- username : `root`
- password : `password`

## API via Bruno

Pour récupérer la collection de Bruno, il vous suffit de l'importer. Pour se connecter, allez dans `auth/login` et lancer la requête. Cela va automatiquement récupérer le token et le faire hériter dans l'ensemble des routes. Attention, il dispose d'une validité limitée. Si vous tombez sur une erreur 401, relancer la requête pour récupérer un nouveau token.

Pour télécharger Bruno : [https://www.usebruno.com/](https://www.usebruno.com/)
