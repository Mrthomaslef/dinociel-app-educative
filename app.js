/**
 * DinoCiel — Application Éducative Interactive (Dès 3 ans)
 * Mascotte : Petit Dino (dinosaure vert animé qui donne les instructions et réagit)
 * Thème : Bleu ciel & Blanc pur
 */

const AppState = {
  currentWorld: 'home',
  stars: Number(localStorage.getItem('dinociel_stars') || 3),
  voiceEnabled: true,
  dinoRenderMode: '3d', // '3d' (Illustrations 3D + Animations) | 'svg' (Vecteur animé)
  lastInstruction: "Coucou ! Je m'appelle Petit Dino ! Choisis un jeu avec moi !",
  customMedia: {
    idle: { type: 'video', url: 'assets/dino-idle.mp4', poster: 'assets/dino-idle.jpg' },
    talking: { type: 'video', url: 'assets/dino-idle.mp4', poster: 'assets/dino-idle.jpg' },
    celebrate: { type: 'video', url: 'assets/dino-celebrate.mp4', poster: 'assets/dino-celebrate.jpg' },
    encourage: { type: 'video', url: 'assets/dino-encourage.mp4', poster: 'assets/dino-encourage.jpg' },
    surprised: { type: 'image', url: 'assets/dino-emotion-surprised.jpg' },
    happy: { type: 'image', url: 'assets/dino-emotion-happy.jpg' },
    sad: { type: 'image', url: 'assets/dino-emotion-sad.jpg' },
    angry: { type: 'image', url: 'assets/dino-emotion-angry.jpg' }
  },
  counting: {
    levelMax: 5, // 5 (3 ans) ou 10 (avancé)
    targetCount: 3,
    countedSet: new Set(),
    currentItem: null,
    options: []
  },
  letters: {
    submode: 'explore', // 'explore' | 'quiz'
    quizTarget: null,
    quizOptions: []
  },
  emotions: {
    submode: 'mirror', // 'mirror' | 'quiz'
    selectedId: 'happy',
    quizScenario: null
  },
  rules: {
    currentIndex: 0
  }
};

/* ==========================================================================
   DONNÉES PÉDAGOGIQUES (ADAPTÉES AUX ENFANTS DE 3 ANS)
   ========================================================================== */

const COUNTING_THEMES = [
  { emoji: '🍎', singular: 'pomme rouge', plural: 'pommes rouges' },
  { emoji: '⭐', singular: 'étoile dorée', plural: 'étoiles dorées' },
  { emoji: '🥚', singular: 'œuf de dinosaure', plural: 'œufs de dinosaure' },
  { emoji: '🎈', singular: 'ballon bleu', plural: 'ballons' },
  { emoji: '🍓', singular: 'fraise sucrée', plural: 'fraises sucrées' },
  { emoji: '☁️', singular: 'petit nuage', plural: 'petits nuages' },
  { emoji: '🦖', singular: 'petit copain dino', plural: 'petits copains dinos' }
];

const FRENCH_NUMBER_WORDS = [
  'Zéro', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq',
  'Six', 'Sept', 'Huit', 'Neuf', 'Dix'
];

const ALPHABET_DATA = [
  { letter: 'A', word: 'Avion', emoji: '✈️', phrase: 'A comme Avion qui vole dans le ciel bleu !' },
  { letter: 'B', word: 'Ballon', emoji: '🎈', phrase: 'B comme Ballon qui rebondit bien haut !' },
  { letter: 'C', word: 'Chat', emoji: '🐱', phrase: 'C comme Chat qui fait miaou !' },
  { letter: 'D', word: 'Dinosaure', emoji: '🦕', phrase: 'D comme Dinosaure, c’est moi, Petit Dino !' },
  { letter: 'E', word: 'Étoile', emoji: '⭐', phrase: 'E comme Étoile qui brille dans la nuit !' },
  { letter: 'F', word: 'Fraise', emoji: '🍓', phrase: 'F comme Fraise, miam c’est délicieux !' },
  { letter: 'L', word: 'Lune', emoji: '🌙', phrase: 'L comme Lune qui veille sur ton dodo !' },
  { letter: 'M', word: 'Maman', emoji: '❤️', phrase: 'M comme Maman qui fait de gros câlins !' },
  { letter: 'N', word: 'Nuage', emoji: '☁️', phrase: 'N comme Nuage tout blanc dans le ciel !' },
  { letter: 'O', word: 'Ours', emoji: '🐻', phrase: 'O comme Ours en peluche tout doux !' },
  { letter: 'P', word: 'Pomme', emoji: '🍎', phrase: 'P comme Pomme croquante !' },
  { letter: 'S', word: 'Soleil', emoji: '☀️', phrase: 'S comme Soleil qui réchauffe la journée !' },
  { letter: 'T', word: 'Train', emoji: '🚂', phrase: 'T comme Train qui fait tchou-tchou !' },
  { letter: 'V', word: 'Voiture', emoji: '🚗', phrase: 'V comme Voiture qui roule vite, vroum !' }
];

const EMOTIONS_DATA = [
  {
    id: 'happy',
    name: 'Content / Joyeux',
    emoji: '😊',
    image: 'assets/dino-emotion-happy.jpg',
    description: 'Grand sourire et yeux qui brillent !',
    voiceText: 'Regarde ! Ici je suis très content et joyeux ! Je fais un grand sourire parce que je joue avec toi !',
    tip: 'Quand on est joyeux, on a envie de sourire, de chanter et de sauter !'
  },
  {
    id: 'sad',
    name: 'Triste',
    emoji: '😢',
    image: 'assets/dino-emotion-sad.jpg',
    description: 'Bouche vers le bas et petite larme.',
    voiceText: 'Oh… Ici je suis triste. J’ai une petite larme. Un gros câlin ou en parler à Papa et Maman aide à se sentir mieux.',
    tip: 'Astuce de Dino : demander un gros câlin doux quand on a du chagrin.'
  },
  {
    id: 'surprised',
    name: 'Surpris / Étonné',
    emoji: '😮',
    image: 'assets/dino-emotion-surprised.jpg',
    description: 'Grands yeux ronds et bouche en O !',
    voiceText: 'Oh là là ! Je suis surpris ! Mes yeux sont tout grands et ma bouche fait un rond : Oh !',
    tip: 'On fait cette tête quand on voit une belle surprise ou un tour de magie !'
  },
  {
    id: 'angry',
    name: 'Fâché / En colère',
    emoji: '😠',
    image: 'assets/dino-emotion-angry.jpg',
    description: 'Sourcils froncés et bras croisés.',
    voiceText: 'Grrr… Ici je suis fâché, mes sourcils sont froncés. Pour me calmer, je respire tout doucement comme si je soufflais sur une fleur : fffff…',
    tip: 'Astuce calme : souffler 3 fois tout doucement comme un petit dragon calme.'
  }
];

const EMOTION_QUIZ_SCENARIOS = [
  {
    question: "Petit Dino reçoit un gros câlin et un ballon pour jouer ! Comment se sent-il ?",
    targetId: 'happy',
    icon: '🎈🥰'
  },
  {
    question: "Oh non… La glace de Petit Dino est tombée par terre. Comment se sent-il ?",
    targetId: 'sad',
    icon: '🍦💧'
  },
  {
    question: "Coucou ! Un papillon multicolore se pose tout à coup sur le nez de Dino ! Quel visage fait-il ?",
    targetId: 'surprised',
    icon: '🦋✨'
  },
  {
    question: "La grande tour de cubes de Dino vient de tomber et il fronce les sourcils. Quel visage est fâché ?",
    targetId: 'angry',
    icon: '🧱😤'
  }
];

const RULES_DATA = [
  {
    title: "Ranger ses jouets",
    situationEmoji: "🧸",
    question: "Tu as fini de jouer avec tes cubes et ton ours. Que fait-on maintenant ?",
    good: {
      emoji: "🧺✅",
      label: "Ranger les jouets dans le coffre",
      feedback: "Bravo ! Quand on range ses jouets dans le coffre, la chambre reste toute belle et personne ne trébuche !"
    },
    bad: {
      emoji: "💥❌",
      label: "Laisser tout traîner par terre",
      feedback: "Oups ! Si on laisse les jouets partout par terre, on risque de marcher dessus et de les casser. Essaie l'autre carte !"
    }
  },
  {
    title: "Dire les mots magiques",
    situationEmoji: "🍪",
    question: "Papa ou Maman te donne un bon goûter. Quel est le mot magique ?",
    good: {
      emoji: "🙏😊",
      label: "Dire « Merci beaucoup ! » avec un sourire",
      feedback: "Oui ! « S'il te plaît » et « Merci » sont des mots magiques qui font plaisir à tout le monde !"
    },
    bad: {
      emoji: "😠❌",
      label: "Arracher le goûter sans rien dire",
      feedback: "Oh… C'est plus doux et poli de sourire et de dire « Merci ! ». Montre-moi la bonne carte !"
    }
  },
  {
    title: "Se laver les mains",
    situationEmoji: "🧼",
    question: "C'est l'heure de passer à table pour manger. Que fait Petit Dino avant ?",
    good: {
      emoji: "🫧👐",
      label: "Se laver les mains avec de l'eau et du savon",
      feedback: "Super ! Des mains toutes propres avec des bulles de savon chassent les petits microbes !"
    },
    bad: {
      emoji: "🐾❌",
      label: "Manger avec les mains toutes sales",
      feedback: "Oups ! Il y a de la terre sur les pattes de Dino ! Il vaut mieux les laver au savon d'abord."
    }
  },
  {
    title: "Partager avec les copains",
    situationEmoji: "⚽",
    question: "Un petit copain aimerait jouer au ballon avec toi au parc. Que fais-tu ?",
    good: {
      emoji: "🤝🦕",
      label: "Partager le ballon et jouer ensemble",
      feedback: "Génial ! C'est tellement plus amusant de partager et de jouer à deux !"
    },
    bad: {
      emoji: "🙅‍♂️❌",
      label: "Cacher le ballon et pousser le copain",
      feedback: "Oh non, pousser fait mal et rend triste. Choisis plutôt le bon geste pour jouer ensemble !"
    }
  },
  {
    title: "Attendre son tour",
    situationEmoji: "🛝",
    question: "Il y a déjà un enfant en haut du toboggan. Que fait Petit Dino ?",
    good: {
      emoji: "⏳😊",
      label: "Attendre calmement son tour derrière",
      feedback: "Bravo champion ! En attendant son tour, tout le monde glisse en sécurité sans se faire mal !"
    },
    bad: {
      emoji: "🏃‍♂️💥",
      label: "Doubler et pousser dans l'escalier",
      feedback: "Attention ! Pousser sur le toboggan est dangereux. Montre comment Dino attend calmement !"
    }
  },
  {
    title: "Parler doucement à l'intérieur",
    situationEmoji: "🤫",
    question: "Petit frère ou petite sœur fait la sieste dans la maison. Comment fait Dino ?",
    good: {
      emoji: "🧦🤫",
      label: "Marcher à petits pas et parler tout bas",
      feedback: "Chut… Bravo ! Tu as une douce petite voix calme, bébé peut bien dormir !"
    },
    bad: {
      emoji: "📢🥁",
      label: "Crier très fort et taper des pieds",
      feedback: "Oh là là, ça fait trop de bruit pour la maison ! Essayons plutôt la voix douce."
    }
  },
  {
    title: "Mettre à la poubelle",
    situationEmoji: "🍌",
    question: "Petit Dino a fini de manger sa banane. Où met-on la peau de banane ?",
    good: {
      emoji: "🗑️✨",
      label: "La mettre dans la poubelle",
      feedback: "Parfait ! Mettre les déchets à la poubelle garde la maison et la nature toutes propres !"
    },
    bad: {
      emoji: "🍌💨",
      label: "La jeter par terre sur le tapis",
      feedback: "Attention, on pourrait glisser dessus ! Où doit-elle aller ?"
    }
  }
];

const STICKERS_CATALOG = [
  { id: 's1', name: 'Dino Sourire', emoji: '🦕', starsNeeded: 0 },
  { id: 's2', name: 'Roi des Chiffres', emoji: '🔢', starsNeeded: 2 },
  { id: 's3', name: 'Étoile Bleue', emoji: '🌟', starsNeeded: 4 },
  { id: 's4', name: 'Ami des Lettres', emoji: '🔤', starsNeeded: 6 },
  { id: 's5', name: 'Cœur Joyeux', emoji: '💚', starsNeeded: 8 },
  { id: 's6', name: 'Super Poli', emoji: '👑', starsNeeded: 10 },
  { id: 's7', name: 'Arc-en-Ciel', emoji: '🌈', starsNeeded: 12 },
  { id: 's8', name: 'Fusée du Ciel', emoji: '🚀', starsNeeded: 15 }
];

/* ==========================================================================
   AUDIO & SYNTHÈSE VOCALE FRANÇAISE
   ========================================================================== */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSoundEffect(type) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (type === 'pop' || type === 'count') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.14);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  } else if (type === 'success') {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.24, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.28);
    });
  } else if (type === 'encourage') {
    const notes = [380, 330];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      gain.gain.setValueAtTime(0.16, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.22);
    });
  } else if (type === 'giggle') {
    const notes = [587.33, 698.46, 783.99, 698.46, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.2, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.14);
    });
  }
}

/* ==========================================================================
   CONTRÔLEUR DE LA MASCOTTE « PETIT DINO »
   ========================================================================== */

let speechTimeout = null;

function setDinoReaction(state, speechText = null, options = {}) {
  const card = document.getElementById('mascot-card');
  const badge = document.getElementById('mascot-state-badge');
  const img3d = document.getElementById('dino-3d-img');
  const videoEl = document.getElementById('dino-video-player');
  const speechEl = document.getElementById('dino-speech-text');
  const floaters = document.getElementById('reaction-floaters');
  const svgMouth = document.getElementById('svg-mouth');

  const stateBadges = {
    idle: '🦕 Prêt à jouer !',
    talking: '🗣️ Petit Dino te parle...',
    celebrate: '🎉 Hourra ! Bravo !',
    encourage: '🤔 Essaie encore, tu vas réussir !',
    surprised: '😮 Oh ! Quelle surprise !',
    happy: '😊 Petit Dino est tout joyeux !',
    sad: '😢 Petit Dino a besoin d’un câlin',
    angry: '😠 Petit Dino souffle pour se calmer'
  };

  const stateFloaters = {
    idle: ['✨', '⭐', '💚'],
    talking: ['🎵', '💬', '✨'],
    celebrate: ['🎉', '🌟', '🏆'],
    encourage: ['💡', '👍', '💙'],
    surprised: ['❗', '😮', '✨'],
    happy: ['😊', '💛', '🌟'],
    sad: ['💧', '💙', '🫂'],
    angry: ['💨', '🍃', '💙']
  };

  card.dataset.state = state;
  badge.textContent = stateBadges[state] || stateBadges.idle;

  // Update floating particles around Dino
  const icons = stateFloaters[state] || stateFloaters.idle;
  floaters.innerHTML = `
    <span class="floater f1">${icons[0]}</span>
    <span class="floater f2">${icons[1]}</span>
    <span class="floater f3">${icons[2]}</span>
  `;

  // Update 2D image or Higgsfield video for current state
  const media = AppState.customMedia[state] || AppState.customMedia.idle;
  if (media.type === 'video') {
    img3d.classList.add('hidden');
    videoEl.classList.remove('hidden');
    if (media.poster) {
      videoEl.poster = media.poster;
    }
    if (!videoEl.src.endsWith(media.url)) {
      videoEl.src = media.url;
      videoEl.load();
    }
    videoEl.play().catch(() => {
      if (media.poster) {
        videoEl.classList.add('hidden');
        img3d.classList.remove('hidden');
        img3d.src = media.poster;
      }
    });
  } else {
    videoEl.classList.add('hidden');
    img3d.classList.remove('hidden');
    img3d.src = media.url;
  }

  // Update SVG rig expression
  if (svgMouth) {
    if (state === 'sad') {
      svgMouth.setAttribute('d', 'M102 132 Q128 112 154 132');
      svgMouth.setAttribute('fill', 'none');
    } else if (state === 'surprised') {
      svgMouth.setAttribute('d', 'M118 115 A12 14 0 1 0 138 115 A12 14 0 1 0 118 115');
      svgMouth.setAttribute('fill', '#991B1B');
    } else if (state === 'encourage') {
      svgMouth.setAttribute('d', 'M106 124 Q128 134 150 122');
      svgMouth.setAttribute('fill', 'none');
    } else {
      svgMouth.setAttribute('d', 'M98 118 Q128 144 158 118 Z');
      svgMouth.setAttribute('fill', '#991B1B');
    }
  }

  // Highlight active mood chip
  document.querySelectorAll('.mood-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.mood === state);
  });

  // Update speech bubble and speak in French
  if (speechText) {
    AppState.lastInstruction = speechText.replace(/<[^>]*>/g, '');
    speechEl.innerHTML = speechText;
    if (!options.silent) {
      speakFrench(AppState.lastInstruction, state);
    }
  }
}

function speakFrench(text, afterState = 'idle') {
  clearTimeout(speechTimeout);

  if (!AppState.voiceEnabled || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.96; // Slightly slower & clearer for a 3-year-old
    utterance.pitch = 1.22; // Friendly cheerful young mascot voice

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr') && /thomas|amelie|audrey|marie|google/i.test(v.name))
      || voices.find(v => v.lang.startsWith('fr'));
    if (frVoice) {
      utterance.voice = frVoice;
    }

    const card = document.getElementById('mascot-card');
    utterance.onstart = () => {
      if (afterState === 'idle') {
        card.dataset.state = 'talking';
      }
    };
    utterance.onend = () => {
      if (card.dataset.state === 'talking') {
        card.dataset.state = 'idle';
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    // Ignore speech errors on restricted browsers
  }
}

function spawnCelebrationConfetti() {
  const layer = document.getElementById('celebration-layer');
  const symbols = ['⭐', '🌟', '✨', '🎉', '🎈', '🦕', '💚', '💙'];

  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.textContent = symbols[i % symbols.length];
    el.style.left = `${10 + Math.random() * 80}%`;
    el.style.top = `${25 + Math.random() * 40}%`;
    el.style.animationDelay = `${Math.random() * 0.25}s`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }
}

function awardStar(count = 1) {
  AppState.stars += count;
  localStorage.setItem('dinociel_stars', String(AppState.stars));
  const starEl = document.getElementById('star-count-value');
  starEl.textContent = AppState.stars;
  playSoundEffect('success');
  spawnCelebrationConfetti();
}

/* ==========================================================================
   NAVIGATION ENTRE LES MONDES ÉDUCATIFS
   ========================================================================== */

function switchWorld(worldId) {
  AppState.currentWorld = worldId;

  document.querySelectorAll('.world-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.world === worldId);
  });

  if (worldId === 'home') renderHomeWorld();
  else if (worldId === 'counting') startNewCountingRound(true);
  else if (worldId === 'letters') renderLettersWorld();
  else if (worldId === 'emotions') renderEmotionsWorld();
  else if (worldId === 'rules') renderRulesWorld();
  else if (worldId === 'stickers') renderStickersWorld();
}

/* ==========================================================================
   ACCUEIL — LES 4 MONDES DE PETIT DINO
   ========================================================================== */

function renderHomeWorld() {
  const stage = document.getElementById('activity-stage');
  setDinoReaction(
    'idle',
    "Coucou ! Je suis <strong>Petit Dino</strong> ! Choisis une activité bleu ciel pour apprendre en t'amusant !"
  );

  stage.innerHTML = `
    <div class="home-welcome-banner">
      <div>
        <h2>🌤️ Bienvenue dans le monde de Petit Dino !</h2>
        <p>Tout est pensé pour les enfants de 3 ans : écoute la voix de Petit Dino et touche les grandes cartes !</p>
      </div>
      <button class="btn-primary-action" id="btn-start-adventure">
        🚀 Commencer à jouer
      </button>
    </div>

    <div class="home-grid">
      <button class="home-world-card" data-goto="counting">
        <div class="world-card-icon">🔢</div>
        <div class="world-card-info">
          <h3>1. Apprendre à Compter</h3>
          <p>Touche les pommes, les étoiles et les œufs de Dino pour compter ensemble de 1 à 10 !</p>
        </div>
      </button>

      <button class="home-world-card" data-goto="letters">
        <div class="world-card-icon">🔤</div>
        <div class="world-card-info">
          <h3>2. Les Lettres & les Sons</h3>
          <p>Découvre l'alphabet en images et en sons : A comme Avion, D comme Dinosaure !</p>
        </div>
      </button>

      <button class="home-world-card" data-goto="emotions">
        <div class="world-card-icon">😊</div>
        <div class="world-card-info">
          <h3>3. Les Expressions Faciales</h3>
          <p>Observe le visage de Petit Dino : joyeux, triste, surpris ou fâché, et comprends tes émotions !</p>
        </div>
      </button>

      <button class="home-world-card" data-goto="rules">
        <div class="world-card-icon">🌟</div>
        <div class="world-card-info">
          <h3>4. Respecter les Règles</h3>
          <p>Apprends les bons gestes du quotidien : ranger ses jouets, dire merci, partager et attendre son tour !</p>
        </div>
      </button>
    </div>
  `;

  stage.querySelector('#btn-start-adventure').addEventListener('click', () => {
    playSoundEffect('pop');
    switchWorld('counting');
  });

  stage.querySelectorAll('.home-world-card').forEach(card => {
    card.addEventListener('click', () => {
      playSoundEffect('pop');
      switchWorld(card.dataset.goto);
    });
  });
}

/* ==========================================================================
   MONDE 1 : APPRENDRE À COMPTER AVEC PETIT DINO
   ========================================================================== */

function startNewCountingRound(speakIntro = true) {
  const max = AppState.counting.levelMax;
  const target = Math.floor(Math.random() * max) + 1;
  const theme = COUNTING_THEMES[Math.floor(Math.random() * COUNTING_THEMES.length)];

  AppState.counting.targetCount = target;
  AppState.counting.currentItem = theme;
  AppState.counting.countedSet = new Set();

  // Build 3 distinct number choices including target
  const choices = new Set([target]);
  while (choices.size < 3) {
    choices.add(Math.floor(Math.random() * max) + 1);
  }
  AppState.counting.options = Array.from(choices).sort((a, b) => a - b);

  renderCountingWorld();

  if (speakIntro) {
    const label = target > 1 ? theme.plural : theme.singular;
    setDinoReaction(
      'idle',
      `Touche chaque <strong>${theme.singular}</strong> pour compter avec moi, puis choisis le bon chiffre ! Combien y a-t-il de ${label} ?`
    );
  }
}

function renderCountingWorld() {
  const stage = document.getElementById('activity-stage');
  const { targetCount, currentItem, countedSet, options, levelMax } = AppState.counting;

  let objectsHtml = '';
  for (let i = 0; i < targetCount; i++) {
    const isCounted = countedSet.has(i);
    const badgeOrder = isCounted ? Array.from(countedSet).indexOf(i) + 1 : '';
    objectsHtml += `
      <button class="countable-item ${isCounted ? 'counted' : ''}" data-index="${i}" aria-label="Objet ${i + 1}">
        <span>${currentItem.emoji}</span>
        ${isCounted ? `<span class="counted-badge">${badgeOrder}</span>` : ''}
      </button>
    `;
  }

  const choicesHtml = options
    .map(num => `<button class="number-choice-btn" data-num="${num}">${num}</button>`)
    .join('');

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>🔢 Je compte avec Petit Dino</h2>
        <p>Touche les images une par une pour les compter à voix haute !</p>
      </div>
      <div class="submode-pills">
        <button class="submode-btn ${levelMax === 5 ? 'active' : ''}" data-max="5">🌱 1 à 5 (3 ans)</button>
        <button class="submode-btn ${levelMax === 10 ? 'active' : ''}" data-max="10">🚀 1 à 10 (Grand)</button>
      </div>
    </div>

    <div class="counting-arena">
      <div class="counting-prompt-banner">
        Combien vois-tu de <strong>${targetCount > 1 ? currentItem.plural : currentItem.singular}</strong> ${currentItem.emoji} ?
      </div>

      <div class="counting-objects-grid">
        ${objectsHtml}
      </div>

      <p style="font-weight:700; color: var(--sky-muted);">
        Objets touchés : <strong>${countedSet.size} / ${targetCount}</strong> — Choisis le chiffre :
      </p>

      <div class="number-choices-row">
        ${choicesHtml}
      </div>
    </div>

    <div class="activity-footer">
      <button class="btn-primary-action" id="btn-next-counting">
        🔄 Autre question
      </button>
    </div>
  `;

  // Level switch buttons
  stage.querySelectorAll('.submode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.counting.levelMax = Number(btn.dataset.max);
      playSoundEffect('pop');
      startNewCountingRound(true);
    });
  });

  // Tap individual objects to count out loud
  stage.querySelectorAll('.countable-item').forEach(itemBtn => {
    itemBtn.addEventListener('click', () => {
      const idx = Number(itemBtn.dataset.index);
      if (!AppState.counting.countedSet.has(idx)) {
        AppState.counting.countedSet.add(idx);
      }
      const currentTotal = AppState.counting.countedSet.size;
      playSoundEffect('count');
      renderCountingWorld();

      const word = FRENCH_NUMBER_WORDS[currentTotal] || String(currentTotal);
      if (currentTotal === targetCount) {
        setDinoReaction(
          'happy',
          `<strong>${word} !</strong> Tu as tout compté : il y en a <strong>${targetCount}</strong> ! Maintenant, touche le chiffre <strong>${targetCount}</strong> en bas !`
        );
      } else {
        setDinoReaction('talking', `<strong>${word} !</strong> Continue de toucher les ${currentItem.plural} !`);
      }
    });
  });

  // Number answer buttons
  stage.querySelectorAll('.number-choice-btn').forEach(numBtn => {
    numBtn.addEventListener('click', () => {
      const chosen = Number(numBtn.dataset.num);
      if (chosen === targetCount) {
        numBtn.classList.add('correct');
        awardStar(1);
        const word = FRENCH_NUMBER_WORDS[targetCount];
        setDinoReaction(
          'celebrate',
          `🎉 <strong>Bravo !</strong> C'est bien <strong>${targetCount}</strong> (${word}) ${targetCount > 1 ? currentItem.plural : currentItem.singular} ! Tu gagnes une étoile !`
        );
        setTimeout(() => {
          if (AppState.currentWorld === 'counting') {
            startNewCountingRound(true);
          }
        }, 2800);
      } else {
        numBtn.classList.add('wrong');
        playSoundEffect('encourage');
        setDinoReaction(
          'encourage',
          `🤔 Oups, ce n'est pas ${chosen}. Touche chaque ${currentItem.singular} ${currentItem.emoji} en haut pour compter avec moi !`
        );
      }
    });
  });

  stage.querySelector('#btn-next-counting').addEventListener('click', () => {
    playSoundEffect('pop');
    startNewCountingRound(true);
  });
}

/* ==========================================================================
   MONDE 2 : LES LETTRES & L'ALPHABET DE PETIT DINO
   ========================================================================== */

function startLetterQuizRound() {
  const target = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
  const pool = [target];
  while (pool.length < 3) {
    const candidate = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    if (!pool.some(x => x.letter === candidate.letter)) {
      pool.push(candidate);
    }
  }
  AppState.letters.quizTarget = target;
  AppState.letters.quizOptions = pool.sort(() => Math.random() - 0.5);
}

function renderLettersWorld() {
  const stage = document.getElementById('activity-stage');
  const submode = AppState.letters.submode;

  if (submode === 'quiz' && !AppState.letters.quizTarget) {
    startLetterQuizRound();
  }

  let bodyHtml = '';

  if (submode === 'explore') {
    setDinoReaction(
      'idle',
      "Touche une grande carte pour entendre la lettre et le mot avec moi ! Par exemple : <strong>D comme Dinosaure</strong> !"
    );

    const cardsHtml = ALPHABET_DATA.map(
      (item, idx) => `
        <button class="letter-card" data-idx="${idx}">
          <span class="letter-big">${item.letter}</span>
          <span class="letter-emoji">${item.emoji}</span>
          <span class="letter-word">${item.word}</span>
        </button>
      `
    ).join('');

    bodyHtml = `
      <div class="letters-grid">
        ${cardsHtml}
      </div>
    `;
  } else {
    const target = AppState.letters.quizTarget;
    setDinoReaction(
      'idle',
      `Montre-moi la lettre <strong>${target.letter}</strong> comme <strong>${target.word}</strong> ${target.emoji} !`
    );

    const optionsHtml = AppState.letters.quizOptions
      .map(
        opt => `
          <button class="quiz-card-btn" data-letter="${opt.letter}">
            <span class="letter-big" style="font-size:3.5rem;">${opt.letter}</span>
            <span class="letter-emoji" style="font-size:3.2rem;">${opt.emoji}</span>
            <span class="letter-word" style="font-size:1.3rem;">${opt.word}</span>
          </button>
        `
      )
      .join('');

    bodyHtml = `
      <div class="counting-arena">
        <div class="counting-prompt-banner">
          Où est la lettre <strong>« ${target.letter} »</strong> comme <strong>${target.word} ${target.emoji}</strong> ?
        </div>
        <div class="quiz-options-grid">
          ${optionsHtml}
        </div>
      </div>
      <div class="activity-footer">
        <button class="btn-primary-action" id="btn-next-letter-quiz">🔄 Autre lettre</button>
      </div>
    `;
  }

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>🔤 L'Alphabet de Petit Dino</h2>
        <p>Découvre le son des lettres et les mots en images !</p>
      </div>
      <div class="submode-pills">
        <button class="submode-btn ${submode === 'explore' ? 'active' : ''}" data-mode="explore">📖 Découvrir</button>
        <button class="submode-btn ${submode === 'quiz' ? 'active' : ''}" data-mode="quiz">🎯 Petit Jeu</button>
      </div>
    </div>
    ${bodyHtml}
  `;

  stage.querySelectorAll('.submode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.letters.submode = btn.dataset.mode;
      if (AppState.letters.submode === 'quiz') {
        startLetterQuizRound();
      }
      playSoundEffect('pop');
      renderLettersWorld();
    });
  });

  if (submode === 'explore') {
    stage.querySelectorAll('.letter-card').forEach(card => {
      card.addEventListener('click', () => {
        stage.querySelectorAll('.letter-card').forEach(c => c.classList.remove('speaking'));
        card.classList.add('speaking');
        const item = ALPHABET_DATA[Number(card.dataset.idx)];
        playSoundEffect('pop');
        setDinoReaction(
          'happy',
          `<strong>${item.letter}</strong> ! ${item.phrase}`
        );
      });
    });
  } else {
    stage.querySelectorAll('.quiz-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.letter;
        const target = AppState.letters.quizTarget;
        if (chosen === target.letter) {
          btn.classList.add('correct');
          awardStar(1);
          setDinoReaction(
            'celebrate',
            `🎉 <strong>Super !</strong> C'est bien la lettre <strong>${target.letter}</strong> comme <strong>${target.word}</strong> !`
          );
          setTimeout(() => {
            if (AppState.currentWorld === 'letters' && AppState.letters.submode === 'quiz') {
              startLetterQuizRound();
              renderLettersWorld();
            }
          }, 2600);
        } else {
          btn.classList.add('wrong');
          playSoundEffect('encourage');
          setDinoReaction(
            'encourage',
            `🤔 Regarde bien l'image : cherche <strong>${target.letter}</strong> comme <strong>${target.word} ${target.emoji}</strong> !`
          );
        }
      });
    });

    const nextBtn = stage.querySelector('#btn-next-letter-quiz');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        playSoundEffect('pop');
        startLetterQuizRound();
        renderLettersWorld();
      });
    }
  }
}

/* ==========================================================================
   MONDE 3 : LES EXPRESSIONS FACIALES & ÉMOTIONS DE PETIT DINO
   ========================================================================== */

function startEmotionQuizRound() {
  const scenario = EMOTION_QUIZ_SCENARIOS[Math.floor(Math.random() * EMOTION_QUIZ_SCENARIOS.length)];
  AppState.emotions.quizScenario = scenario;
}

function renderEmotionsWorld() {
  const stage = document.getElementById('activity-stage');
  const submode = AppState.emotions.submode;

  if (submode === 'quiz' && !AppState.emotions.quizScenario) {
    startEmotionQuizRound();
  }

  let contentHtml = '';

  if (submode === 'mirror') {
    const currentEmotion = EMOTIONS_DATA.find(e => e.id === AppState.emotions.selectedId) || EMOTIONS_DATA[0];
    setDinoReaction(
      currentEmotion.id,
      `<strong>${currentEmotion.emoji} ${currentEmotion.name}</strong> : ${currentEmotion.voiceText}<br><small>💡 ${currentEmotion.tip}</small>`
    );

    const cardsHtml = EMOTIONS_DATA.map(
      emo => `
        <button class="emotion-card ${emo.id === currentEmotion.id ? 'selected' : ''}" data-emo="${emo.id}">
          <img src="${emo.image}" alt="${emo.name}" class="emotion-portrait" />
          <span class="emotion-title">${emo.emoji} ${emo.name}</span>
          <span class="emotion-desc">${emo.description}</span>
        </button>
      `
    ).join('');

    contentHtml = `
      <div class="emotions-grid">
        ${cardsHtml}
      </div>
    `;
  } else {
    const scenario = AppState.emotions.quizScenario;
    setDinoReaction('idle', scenario.question);

    const choicesHtml = EMOTIONS_DATA.map(
      emo => `
        <button class="quiz-card-btn" data-emo="${emo.id}">
          <img src="${emo.image}" alt="${emo.name}" class="emotion-portrait" />
          <span class="emotion-title">${emo.emoji} ${emo.name}</span>
        </button>
      `
    ).join('');

    contentHtml = `
      <div class="counting-arena">
        <div class="rule-situation-emoji">${scenario.icon}</div>
        <div class="counting-prompt-banner">${scenario.question}</div>
        <div class="quiz-options-grid">
          ${choicesHtml}
        </div>
      </div>
      <div class="activity-footer">
        <button class="btn-primary-action" id="btn-next-emotion-quiz">🔄 Autre histoire</button>
      </div>
    `;
  }

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>😊 Les Expressions Faciales de Petit Dino</h2>
        <p>Touche un visage de Petit Dino pour imiter et comprendre les émotions !</p>
      </div>
      <div class="submode-pills">
        <button class="submode-btn ${submode === 'mirror' ? 'active' : ''}" data-mode="mirror">🪞 Miroir de Dino</button>
        <button class="submode-btn ${submode === 'quiz' ? 'active' : ''}" data-mode="quiz">🎯 Jeu des Visages</button>
      </div>
    </div>
    ${contentHtml}
  `;

  stage.querySelectorAll('.submode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.emotions.submode = btn.dataset.mode;
      if (AppState.emotions.submode === 'quiz') {
        startEmotionQuizRound();
      }
      playSoundEffect('pop');
      renderEmotionsWorld();
    });
  });

  if (submode === 'mirror') {
    stage.querySelectorAll('.emotion-card').forEach(card => {
      card.addEventListener('click', () => {
        AppState.emotions.selectedId = card.dataset.emo;
        playSoundEffect('pop');
        renderEmotionsWorld();
      });
    });
  } else {
    stage.querySelectorAll('.quiz-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.emo;
        const scenario = AppState.emotions.quizScenario;
        const targetEmo = EMOTIONS_DATA.find(e => e.id === scenario.targetId);

        if (chosen === scenario.targetId) {
          btn.classList.add('correct');
          awardStar(1);
          setDinoReaction(
            'celebrate',
            `🎉 <strong>Bravo !</strong> C'est bien le visage <strong>${targetEmo.name}</strong> ${targetEmo.emoji} !`
          );
          setTimeout(() => {
            if (AppState.currentWorld === 'emotions' && AppState.emotions.submode === 'quiz') {
              startEmotionQuizRound();
              renderEmotionsWorld();
            }
          }, 2700);
        } else {
          btn.classList.add('wrong');
          playSoundEffect('encourage');
          setDinoReaction(
            'encourage',
            `🤔 Regarde bien les yeux et la bouche de Petit Dino : cherche le visage <strong>${targetEmo.name}</strong> !`
          );
        }
      });
    });

    const nextBtn = stage.querySelector('#btn-next-emotion-quiz');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        playSoundEffect('pop');
        startEmotionQuizRound();
        renderEmotionsWorld();
      });
    }
  }
}

/* ==========================================================================
   MONDE 4 : APPRENDRE À RESPECTER LES RÈGLES & BONS GESTES
   ========================================================================== */

function renderRulesWorld() {
  const stage = document.getElementById('activity-stage');
  const rule = RULES_DATA[AppState.rules.currentIndex % RULES_DATA.length];

  // Randomize left/right order so the child observes the cards
  const choices = [
    { ...rule.good, isGood: true },
    { ...rule.bad, isGood: false }
  ].sort(() => Math.random() - 0.5);

  setDinoReaction(
    'idle',
    `<strong>${rule.title}</strong> : ${rule.question} Touche la carte qui montre le bon geste !`
  );

  const choicesHtml = choices
    .map(
      (c, i) => `
        <button class="rule-choice-btn" data-good="${c.isGood}" data-idx="${i}">
          <span class="rule-choice-emoji">${c.emoji}</span>
          <span class="rule-choice-label">${c.label}</span>
        </button>
      `
    )
    .join('');

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>🌟 Les Bons Gestes avec Petit Dino</h2>
        <p>Situation ${AppState.rules.currentIndex + 1} sur ${RULES_DATA.length} — Apprendre à vivre ensemble et respecter les règles</p>
      </div>
      <div class="submode-pills">
        <button class="submode-btn active" id="btn-rule-next-top">➡️ Situation suivante</button>
      </div>
    </div>

    <div class="rule-scenario-card">
      <div class="rule-situation-emoji">${rule.situationEmoji}</div>
      <h3 style="font-size:1.3rem; color: var(--sky-accent-dark);">${rule.title}</h3>
      <p class="rule-question">${rule.question}</p>

      <div class="rule-choices-grid">
        ${choicesHtml}
      </div>
    </div>
  `;

  stage.querySelectorAll('.rule-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isGood = btn.dataset.good === 'true';
      if (isGood) {
        btn.classList.add('quiz-card-btn', 'correct');
        awardStar(1);
        setDinoReaction('celebrate', `🎉 ${rule.good.feedback}`);
        setTimeout(() => {
          if (AppState.currentWorld === 'rules') {
            AppState.rules.currentIndex = (AppState.rules.currentIndex + 1) % RULES_DATA.length;
            renderRulesWorld();
          }
        }, 3400);
      } else {
        btn.classList.add('quiz-card-btn', 'wrong');
        playSoundEffect('encourage');
        setDinoReaction('encourage', `🤔 ${rule.bad.feedback}`);
      }
    });
  });

  stage.querySelector('#btn-rule-next-top').addEventListener('click', () => {
    playSoundEffect('pop');
    AppState.rules.currentIndex = (AppState.rules.currentIndex + 1) % RULES_DATA.length;
    renderRulesWorld();
  });
}

/* ==========================================================================
   MONDE 5 : ALBUM DE GOMMETTES & ÉTOILES
   ========================================================================== */

function renderStickersWorld() {
  const stage = document.getElementById('activity-stage');

  setDinoReaction(
    'celebrate',
    `Bravo ! Tu as déjà gagné <strong>${AppState.stars} étoiles</strong> ⭐ ! Touche tes gommettes débloquées !`
  );

  const stickersHtml = STICKERS_CATALOG.map(st => {
    const unlocked = AppState.stars >= st.starsNeeded;
    return `
      <div class="sticker-slot ${unlocked ? 'unlocked' : 'locked'}" data-name="${st.name}" data-unlocked="${unlocked}">
        <span class="sticker-emoji">${st.emoji}</span>
        <span class="sticker-name">${st.name}</span>
        <span style="font-size:0.85rem; color: var(--sky-muted); font-weight:700;">
          ${unlocked ? '✅ Débloqué !' : `🔒 ${st.starsNeeded} ⭐`}
        </span>
      </div>
    `;
  }).join('');

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>🏆 Mon Album de Gommettes</h2>
        <p>Plus tu joues avec Petit Dino, plus tu gagnes d'étoiles et de gommettes !</p>
      </div>
    </div>

    <div class="stickers-grid">
      ${stickersHtml}
    </div>
  `;

  stage.querySelectorAll('.sticker-slot.unlocked').forEach(slot => {
    slot.addEventListener('click', () => {
      playSoundEffect('giggle');
      spawnCelebrationConfetti();
      setDinoReaction(
        'celebrate',
        `Youpi ! C'est ta gommette <strong>${slot.dataset.name}</strong> ! Tu es un super champion !`
      );
    });
  });
}

/* ==========================================================================
   INITIALISATION & ÉVÉNEMENTS GLOBAUX
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize star counter display
  document.getElementById('star-count-value').textContent = AppState.stars;

  // Preload French voices if available
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  // World navigation tabs
  document.querySelectorAll('.world-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      playSoundEffect('pop');
      switchWorld(tab.dataset.world);
    });
  });

  // Brand home button & stickers button
  document.getElementById('btn-home-brand').addEventListener('click', () => {
    playSoundEffect('pop');
    switchWorld('home');
  });

  document.getElementById('btn-stickers-quick').addEventListener('click', () => {
    playSoundEffect('pop');
    switchWorld('stickers');
  });

  // Toggle between 3D Illustrated Dino & Vector SVG Animated Rig
  document.getElementById('btn-toggle-style').addEventListener('click', () => {
    playSoundEffect('pop');
    const c3d = document.getElementById('dino-3d-container');
    const csvg = document.getElementById('dino-svg-container');
    const label = document.getElementById('dino-style-label');

    if (AppState.dinoRenderMode === '3d') {
      AppState.dinoRenderMode = 'svg';
      c3d.classList.add('hidden');
      csvg.classList.remove('hidden');
      label.textContent = 'Dino Vecteur SVG';
    } else {
      AppState.dinoRenderMode = '3d';
      csvg.classList.add('hidden');
      c3d.classList.remove('hidden');
      label.textContent = 'Dino Dessin 2D';
    }
  });

  // Toggle French voice synthesis
  const voiceBtn = document.getElementById('btn-toggle-voice');
  voiceBtn.addEventListener('click', () => {
    AppState.voiceEnabled = !AppState.voiceEnabled;
    voiceBtn.classList.toggle('active', AppState.voiceEnabled);
    voiceBtn.setAttribute('aria-pressed', String(AppState.voiceEnabled));
    document.getElementById('voice-icon').textContent = AppState.voiceEnabled ? '🔊' : '🔇';
    if (AppState.voiceEnabled) {
      speakFrench(AppState.lastInstruction);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  });

  // Replay speech button
  document.getElementById('btn-replay-speech').addEventListener('click', () => {
    playSoundEffect('pop');
    AppState.voiceEnabled = true;
    voiceBtn.classList.add('active');
    document.getElementById('voice-icon').textContent = '🔊';
    speakFrench(AppState.lastInstruction);
  });

  // Tickle / Greet Dino button & stage click
  const tickleHandler = () => {
    playSoundEffect('giggle');
    spawnCelebrationConfetti();
    const phrases = [
      "Hihihi ! Ça chatouille ! Tu es mon meilleur ami !",
      "Roaaar tout doux ! Je suis Petit Dino et j'adore apprendre avec toi !",
      "Youpi ! On s'amuse trop bien ensemble dans les nuages !"
    ];
    const msg = phrases[Math.floor(Math.random() * phrases.length)];
    setDinoReaction('celebrate', msg);
  };

  document.getElementById('btn-tickle-dino').addEventListener('click', tickleHandler);
  document.getElementById('mascot-stage').addEventListener('click', tickleHandler);

  // Quick mood reaction buttons
  document.querySelectorAll('.mood-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const mood = chip.dataset.mood;
      playSoundEffect(mood === 'celebrate' ? 'success' : 'pop');
      const messages = {
        idle: "Je suis calme et prêt à t'écouter !",
        celebrate: "Hourra ! Bravo champion, je saute de joie pour toi !",
        encourage: "Ce n'est pas grave si on se trompe, on essaie encore ensemble !",
        surprised: "Oh là là ! Quelle belle surprise !"
      };
      if (mood === 'celebrate') spawnCelebrationConfetti();
      setDinoReaction(mood, messages[mood]);
    });
  });

  // Higgsfield Studio Modal
  const hfModal = document.getElementById('higgsfield-modal');
  document.getElementById('btn-higgsfield-studio').addEventListener('click', () => {
    playSoundEffect('pop');
    hfModal.classList.remove('hidden');
  });

  document.getElementById('btn-close-higgsfield').addEventListener('click', () => {
    hfModal.classList.add('hidden');
  });

  hfModal.addEventListener('click', e => {
    if (e.target === hfModal) hfModal.classList.add('hidden');
  });

  // Copy Higgsfield prompts
  document.querySelectorAll('.btn-copy-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.copy || '');
      const prev = btn.textContent;
      btn.textContent = '✅ Copié !';
      setTimeout(() => { btn.textContent = prev; }, 1600);
    });
  });

  // Import custom Higgsfield images or video loops (.mp4 / .webm / .jpg / .png)
  document.querySelectorAll('.hf-file-input').forEach(input => {
    input.addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const targetState = input.dataset.targetState || 'idle';
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');

      AppState.customMedia[targetState] = {
        type: isVideo ? 'video' : 'image',
        url
      };

      setDinoReaction(
        targetState,
        `Super ! Ton fichier Higgsfield (${file.name}) est maintenant actif pour la réaction « ${targetState} » !`
      );
      hfModal.classList.add('hidden');
    });
  });

  // Initial render
  renderHomeWorld();
});
