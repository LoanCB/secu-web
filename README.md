# Projet Sécu-web

Projet réalisé seul par Loan Courchinoux-Billonnet

Failles de sécurités :

- XSS description des tickets
- Problèmes de droits : en changeant l'id dans l'url, un simple utilisateur peut accéder à l'importe quel ticket
- Dans le détail d'un ticket, l'on peut changer l'id par une injection sql

## Lancer les projets

Se rendre dans le dossier vulnerable ou secure et faire un :

```bash
docker compose up -d
```

PS : tout cela est expliqué dans le README de chaque sous-dossier.

## Réaliser les failles

### XSS

2 façons de faire :

1. En passant par le front : [http://localhost:3113/tickets/create](http://localhost:3113/tickets/create)
2. En passant par l'API : via Bruno

Il existe déjà une faille à [cette adresse](http://localhost:3113/tickets/2)

Pour créer la faille, il suffit de mettre une balise script dans le rich text (description du ticket)

exemple :

```html
<script defer>
  alert("faille XSS");
</script>
```

Vous pouvez envoyer la même chose directement à l'API sur [cette adresse](http://localhost:3114/api/v1/tickets) en POST avec ceci en body :

```json
{
  "title": "Test de faille XSS",
  "description": "<script defer>alert('faille XSS');</script>"
}
```

### Problème de droits

Un utilisateur peut accéder à n'importe quel ticket même s'il ne lui appartient pas et qu'il n'est pas admin.
En se connectant en tant que user et en se rendant [ici](http://localhost:3113/tickets/1), l’utilisateur peut voir le ticket d'un admin

également possible en passant par l'[API](http://localhost:3114/api/v1/tickets/1)

### Injection SQL

Se rendre sur l'API et remplacer l'id du ticket à récupérer par `'' OR 1 = 1`. Cela va vous faire récupérer la liste de tous les tickets.

## Patch des vulnérabilités

### XSS

Résolution des deux côtés :

1. Front : on sanitize les données passées dans le rich text en encodant les caractères compromettant par la syntaxe HTML (exemple : `<` par `&lt;`). Fichier `front/src/components/base/ticket-create.tsx` Composant `<CustomRichTextEditor />`. Pour sanitize le rendu, fichier `front/src/components/base/tickets-details.tsx` dans la fonction `useEffect`
2. Back : Si jamais la personne bypass la validation front, je dispose d'une liste de caractères autorisés. Dans le cas ou cela n'est pas valide, je supprime complètement la partie de la chaîne de caractère. Fichier `back/src/ticketing/services/tickets.service.ts` fonction `createTicketWithFiles`

### Problème de droits

Correction en interne lors de la requête à la base de données. On vérifie le rôle de l'utilisateur est dans le cas ou il n'est pas administrateur, l'on force le filtre sur son identifiant.
Fichier `back/src/ticketing/services/tickets.service.ts` fonction `findOneById`

### Injection SQL

Également vérification au niveau de la requête. On utilise les outils mis à disposition par l'ORM on échappant toute variable injecté à cette dernière.
Fichier `back/src/ticketing/services/tickets.service.ts` fonction `findOneById`
