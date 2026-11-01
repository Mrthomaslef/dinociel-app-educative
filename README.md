# 🦕 DinoCiel — Application Éducative Interactive (Dès 3 ans)

**DinoCiel** est une application éducative complète pensée pour les enfants de **3 ans**, avec un design doux **bleu ciel et blanc pur** et une mascotte interactive : **Petit Dino**, un petit dinosaure vert animé qui donne les consignes à voix haute en français et réagit avec joie ou bienveillance à chaque action de l'enfant.

---

## ✨ Fonctionnalités Principales

1. **🦕 Mascotte Animée « Petit Dino »**
   - **Voix française intégrée** (`Web Speech API` + effets sonores `Web Audio API` sans dépendance externe) : un enfant de 3 ans ne sachant pas lire peut écouter toutes les instructions en appuyant sur `🔊 Écouter Petit Dino`.
   - **Réactions animées en temps réel** :
     - **Accueil / Calme** (`assets/dino-idle.jpg`) : respiration douce, étoiles flottantes, clignements (en mode vecteur 2D).
     - **Parole** : rebond rythmique + ondes vocales animées + bulle de dialogue.
     - **Joie / Bravo** (`assets/dino-celebrate.jpg`) : sauts de joie, pluie d'étoiles et de confettis, fanfare sonore.
     - **Encouragement bienveillant** (`assets/dino-encourage.jpg`) : inclinaison douce de la tête et encouragement positif (aucune punition anxiogène).
   - **Double moteur d'affichage** : bascule instantanée entre **Dino 3D Illustré + Animé** et **Dino Vecteur 2D Interactif (SVG)** (yeux qui clignent, bras qui salue, queue qui remue).

2. **🔢 Monde 1 : Apprendre à Compter (1 à 5 puis 1 à 10)**
   - Comptage tactile : l'enfant touche chaque objet (pommes 🍎, étoiles ⭐, œufs de dino 🥚, ballons 🎈, fraises 🍓, petits nuages ☁️).
   - Chaque objet touché affiche son numéro d'ordre et Petit Dino compte à voix haute (*« Un ! Deux ! Trois ! »*) avant de demander de choisir le bon chiffre.

3. **🔤 Monde 2 : Les Lettres & les Sons (L'Alphabet de Dino)**
   - **Mode Découverte** : grandes cartes visuelles (*A comme Avion, B comme Ballon, D comme Dinosaure, M comme Maman…*) lues à voix haute par Petit Dino.
   - **Mode Petit Jeu** : quiz sonore et visuel adapté aux tout-petits.

4. **😊 Monde 3 : Les Expressions Faciales & Émotions**
   - **Miroir des Émotions** avec les 4 portraits 3D de Petit Dino :
     - 😊 **Content / Joyeux** (`assets/dino-emotion-happy.jpg`)
     - 😢 **Triste** (`assets/dino-emotion-sad.jpg`)
     - 😮 **Surpris / Étonné** (`assets/dino-emotion-surprised.jpg`)
     - 😠 **Fâché / En colère** (`assets/dino-emotion-angry.jpg`) + astuce de respiration calme (*souffler doucement sur une fleur*).
   - **Jeu des Visages** : petites histoires du quotidien où l'enfant identifie l'émotion de Petit Dino.

5. **🌟 Monde 4 : Apprendre à Respecter les Règles (Les Bons Gestes)**
   - 7 situations concrètes de la vie d'un enfant de 3 ans :
     1. 🧸 Ranger ses jouets dans le coffre
     2. 🍪 Dire les mots magiques (« S'il te plaît » / « Merci »)
     3. 🧼 Se laver les mains avec de l'eau et du savon avant de manger
     4. ⚽ Partager ses jouets avec les copains
     5. 🛝 Attendre calmement son tour au toboggan
     6. 🤫 Marcher à petits pas et parler doucement quand bébé dort
     7. 🍌 Jeter les déchets dans la poubelle

6. **🏆 Monde 5 : Album de Gommettes & Récompenses**
   - Chaque bonne réponse offre une étoile dorée ⭐ et débloque des gommettes à collectionner.

7. **🎬 Studio Mascotte Higgsfield AI**
   - Bouton `🎬 Higgsfield` en haut à droite permettant de copier les prompts optimisés pour **Higgsfield Image (`GPT Image 2`)** et **Higgsfield Video (`Seedance 2.5` / `Kling 4.0`)**, et d'importer directement vos propres vidéos `.mp4`/`.webm` ou images pour chaque réaction de Petit Dino.

---

## 🚀 Lancer l'application

Ouvrez simplement le fichier `index.html` dans votre navigateur (aucune installation requise) :

```bash
open index.html
```
