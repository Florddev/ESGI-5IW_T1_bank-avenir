# Clean Code & Clean Architecture

# Projet Pédagogique

## Introduction :

La banque **AVENIR** ( **A** lliance de **V** aleurs **É** conomiques et **N** ationnales **I** nvesties
**R** esponsablement) vous a recruté comme développeur Web afin de pouvoir l’aider à
développer son métier et concurrencer les banques traditionnelles afin de pouvoir
créer une application Web permettant à ses clients de gérer efficacement leur
liquidités, épargne et investissement.

## Fonctionnalités (15 points) :

### **Client :**
● **Authentification** : en tant que client, je dois pouvoir m’inscrire sur cette
nouvelle plateforme. Je dois pouvoir renseigner mes informations afin de
recevoir un lien me permettant de confirmer mon inscription et accéder à mon
compte (qui sera automatiquement créé à l’inscription).
● **Comptes** : en tant que client, je dois pouvoir disposer d’autant de compte
que je le souhaite. Ainsi, un nouvel IBAN unique et valide mathématiquement
doit être généré chaque fois que je créé un compte. Je dois pouvoir
supprimer le compte, et modifier son nom personnalisé si je le souhaite.
● **Opérations** : en tant que client, je dois pouvoir effectuer des opérations
courantes, tel qu’un transfert d’un compte à un autre (uniquement au sein de
notre banque). Le solde d’un compte doit refléter la somme des opérations de
débit (sortant du compte, entrant dans un autre) et de crédit (entrant vers
le compte, en provenance d’un autre compte).
● **Épargne** : en tant que client, je dois pouvoir ouvrir un compte d’épargne.
Celui-ci doit pouvoir me permettre, comme pour un compte, d’effectuer des
opérations entrantes et sortantes. Néanmoins, ce dernier sera rémunéré tous
les jours, au taux en vigueur (fixé par les administrateurs de la banque).
● **Investissement** : en tant que client, je dois pouvoir enregistrer des ordres
d’achat ou de vente d’une action. Une action est un titre financier
d’appartenance à une entreprise côté sur un marché financier. La liste des
actions disponibles est définie par le directeur de la banque. Le cours est
calculé en fonction du prix d’équilibre entre un prix de vente et un prix
d’achat, selon le carnet d’ordre global pour une action. Étant donné que
nous sommes une banque moderne, nous n’avons pas de frais d’arbitrage. Les
seuls frais sont de 1€ à l’achat, comme à la vente.


### **Directeur de banque :**
● **Authentification :** en tant que directeur de banque, je dois pouvoir
m’authentifier.
● Gestion des comptes : en tant que directeur de banque, je dois pouvoir
créer, modifier ou supprimer un compte client ou le bannir.
● **Fixation du taux d’épargne** : en tant que directeur de la banque, je dois
pouvoir effectuer une modification du taux d’épargne disponible pour les
comptes d’épargne. Ce faisant, tous les clients ayant actuellement un compte
d’épargne doivent avoir une notification en ce qui concerne le changement du
taux qui a été fixé lors de la modification.
● **Actions** : en tant que directeur de banque, je suis celui qui créé, modifie
et supprime les actions. Je n’ai pas la possibilité de modifier le cours
d’une action, mais c’est moi qui décide quelles sont les actions disponibles
de celles qui ne le sont pas. Les clients sont propriétaires de leur
actions, contrairement à certains de nos concurrents qui ne le disent pas,
nous l’affichons fièrement.

### **Conseiller de banque :**
**● Authentification** : en tant que conseiller bancaire, je peux m’authentifier
● **Crédit** : en tant que conseiller bancaire, je peux être amené à octroyer des
crédit. Un crédit a un taux annuel d’intérêts à rembourser sur le capital
restant chaque mois, une assurance (obligatoire) à un taux dont le montant
est calculé sur le total du crédit accordé et prélevé sur les mensualités,
et des mensualités qui correspondent au montant du crédit remboursé chaque
mois. Nous utilisons la méthode de calcul du crédit à mensualité constante.
● **Messagerie instantannée** : en tant que conseiller bancaire, je peux répondre
aux messages qui me sont envoyés de la part de mes clients, étant donné que
nous sommes une banque moderne, chaque fois qu’un message est envoyé et en
attente de réponse, tous les conseiller peuvent le voir, néanmoins à partir
du premier message, la discussion est relié au conseiller bancaire qui a
répondu en premier au client. En cas de besoin, la discussion peut être
transférée d’un conseiller à un autre, auquel cas le transfert de la
discussion se fait entre les deux conseillers.

## Contraintes techniques :

1. **Langage** : Développement en **TypeScript** (backend et frontend).
2. **Clean Architecture** :
    ○ Séparation stricte des couches : **Domain (Entities)** , **Application (Use**
       **Cases)** , **Interface** (API/Interface utilisateur), et **Infrastructure** (base
       de données, frameworks, etc.).
    ○ Chaque couche doit être indépendante des frameworks spécifiques pour
       faciliter la maintenance.


```
○ Proposer 2 adaptateurs (in-memory, SQL, NoSQL, etc) pour les bases de
données et 2 frameworks backend (Nest.js, Express, Fastify, etc).
```
3. **Clean Code** :
    ○ Respect des principes de Clean Code vu en cours.
    ○ Les pratiques supplémentaires et documentées sous la forme d’œuvre et
       d’ouvrages sont aussi à prendre en compte (livres de Bob Martin, etc).

## Bonus :

### 1. CQRS :

```
a. Utiliser des commandes pour les requêtes
b. Utiliser des queries pour les demandes
c. Permet de préparer l’Event-Sourcing
```
**2. Event-Sourcing :**
    a. Utiliser l’Event-Sourcing avec comme objectif le retour dans le temps
       des événements passés
    b. Utilisation de microservices bienvenue
**3. Framework Frontend :**
    a. Utilisation de plusieurs frameworks frontend
    b. Angular, React & Solid.js à privilégier
    c. Lister les avantages et inconvénients de chacun


