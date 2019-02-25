# Visual Exploration of Large Multidimensional Date Using Parallel Coordinates on Big Data Infrastructure

## **Introduction**

Augmentation du **nombre de données**

Problèmes :

* Stockage.
* Requêtes.
* Analyse.
* Temps de calcul.
* Données distantes du client
* Espace de visualisation fini et insuffisant pour être efficace

Défis :

* *Perceptual scalability*
* *Interactive scalability*
* *Remoteness*


### Graphe à coordonnées parallèles

Chaque dimension est représentée par un axe vertical et chaque objet par une ligne parcourant ces axes.

##### Problème :

Trop de données = trop de lignes donc incompréhensible.

##### Solutions envisagées :

* Utilisation d'une forme de données réduites et représentant un résumé des données de taille limitée indépendamment de la taille des données d'origine

* Utilisation d'un système de mise à l'échelle horizontale qui parallélise de manière transparente le traitement sur un réseau d'unités de calcul et de stockage où les données sont répliquées et partitionnées. oui... En gros ça utilise plusieurs unités comme une seule.

##### Sujet principal

Approche novateur de la mise à l'échelle horizontale qui consiste en une forme de pré calcul, calcul sur demande et aggrégation de données.

Cette approche demande plusieurs éléments :

* Stockage des données pré calculées
* Transfert des données entre le stockage initial, l'infrasctructure de calcul et le rendu client avec son affichage

## **Related Work**

Deux techniques de "*horizontal scaling*"

Méthodes basées sur la densité ou utilisation de courbes au lieu de lignes. => Ne scalent pas car décrivent chaque item.
Méthode d'échantillonnage pour ordonner l'affichage.

* Méthode de filtrage interactif et outils contrôlable par l'utilisateur.

Cette méthode est limitée car par exemple le filtre prérequiert des connaissances sur les données sinon des structures significatives ou des valeurs peuvent être cachées involontairement.

* Méthode de clustering des données.

Identification de groupe d'objets par l'utilisation de code couleur, opacité ou de groupement.
