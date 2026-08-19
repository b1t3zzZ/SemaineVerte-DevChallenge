# Indice 1
Pour séparer les notes il faut séparer les tables par sujet.

On peut utiliser la ligne en dessous pour séparer les notes par sujet. 
```js
const separated = Object.groupBy(data, ({ subject }) => subject);
```

Ensuite il faut crée une nouvelle table pour chaque sujet dynamiquement dans app.js
```js
Object.entries(separated).forEach(([subjectName, grades]) => { ... })
```