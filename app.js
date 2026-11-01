/**
 * DinoCiel — Application Éducative Interactive (Dès 3 ans)
 * Mascotte : Petit Dino (100% généré sur Higgsfield en dessin 2D homogène)
 * Design : Bleu ciel & Blanc pur — Tient en 1 seule page sur tous les iPhones (100dvh)
 */

const AppState = {
  currentWorld: 'home',
  stars: Number(localStorage.getItem('dinociel_stars') || 3),
  voiceEnabled: true,
  useVideoAnimations: false, // Par défaut : uniquement les images 2D Higgsfield (bascule possible vers vidéos Higgsfield)
  lastInstruction: "Coucou ! Je m'appelle Petit Dino ! Choisis un jeu avec moi !",
  higgsfieldMedia: {
    idle: { image: 'assets/dino-idle.jpg', video: 'assets/dino-idle.mp4' },
    talking: { image: 'assets/dino-idle.jpg', video: 'assets/dino-idle.mp4' },
    celebrate: { image: 'assets/dino-celebrate.jpg', video: 'assets/dino-celebrate.mp4' },
    encourage: { image: 'assets/dino-encourage.jpg', video: 'assets/dino-encourage.mp4' },
    surprised: { image: 'assets/dino-emotion-surprised.jpg', video: 'assets/dino-idle.mp4' },
    happy: { image: 'assets/dino-emotion-happy.jpg', video: 'assets/dino-celebrate.mp4' },
    sad: { image: 'assets/dino-emotion-sad.jpg', video: 'assets/dino-encourage.mp4' },
    angry: { image: 'assets/dino-emotion-angry.jpg', video: 'assets/dino-encourage.mp4' }
  },
  counting: {
    levelMax: 5,
    targetCount: 3,
    countedSet: new Set(),
    currentItem: null,
    options: []
  },
  letters: {
    submode: 'explore', // 'explore' | 'quiz'
    page: 0,
    pageSize: 6, // 6 lettres par page (grille 3x2) pour tenir sur 1 écran iPhone sans scroll
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
  { emoji: '🍎', singular: 'pomme', plural: 'pommes' },
  { emoji: '⭐', singular: 'étoile', plural: 'étoiles' },
  { emoji: '🥚', singular: 'œuf de dino', plural: 'œufs de dino' },
  { emoji: '🎈', singular: 'ballon', plural: 'ballons' },
  { emoji: '🍓', singular: 'fraise', plural: 'fraises' },
  { emoji: '☁️', singular: 'nuage', plural: 'nuages' }
];

const FRENCH_NUMBER_WORDS = [
  'Zéro', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq',
  'Six', 'Sept', 'Huit', 'Neuf', 'Dix'
];

const ALPHABET_DATA = [
  { letter: 'A', word: 'Avion', emoji: '✈️', phrase: 'A comme Avion qui vole dans le ciel bleu !' },
  { letter: 'B', word: 'Ballon', emoji: '🎈', phrase: 'B comme Ballon qui rebondit bien haut !' },
  { letter: 'C', word: 'Chat', emoji: '🐱', phrase: 'C comme Chat qui fait miaou !' },
  { letter: 'D', word: 'Dino', emoji: '🦕', phrase: 'D comme Dinosaure, c’est moi, Petit Dino !' },
  { letter: 'E', word: 'Étoile', emoji: '⭐', phrase: 'E comme Étoile qui brille dans la nuit !' },
  { letter: 'F', word: 'Fraise', emoji: '🍓', phrase: 'F comme Fraise, miam c’est délicieux !' },
  { letter: 'L', word: 'Lune', emoji: '🌙', phrase: 'L comme Lune qui veille sur ton dodo !' },
  { letter: 'M', word: 'Maman', emoji: '❤️', phrase: 'M comme Maman qui fait de gros câlins !' },
  { letter: 'N', word: 'Nuage', emoji: '☁️', phrase: 'N comme Nuage tout blanc dans le ciel !' },
  { letter: 'O', word: 'Ours', emoji: '🐻', phrase: 'O comme Ours en peluche tout doux !' },
  { letter: 'P', word: 'Pomme', emoji: '🍎', phrase: 'P comme Pomme croquante !' },
  { letter: 'S', word: 'Soleil', emoji: '☀️', phrase: 'S comme Soleil qui réchauffe la journée !' }
];

const EMOTIONS_DATA = [
  {
    id: 'happy',
    name: 'Joyeux',
    emoji: '😊',
    image: 'assets/dino-emotion-happy.jpg',
    description: 'Grand sourire et yeux rieurs !',
    voiceText: 'Regarde ! Ici je suis très content et joyeux ! Je fais un grand sourire !'
  },
  {
    id: 'sad',
    name: 'Triste',
    emoji: '😢',
    image: 'assets/dino-emotion-sad.jpg',
    description: 'Petite larme et besoin d’un câlin.',
    voiceText: 'Oh… Ici je suis triste. Un gros câlin doux aide à se sentir beaucoup mieux.'
  },
  {
    id: 'surprised',
    name: 'Surpris',
    emoji: '😮',
    image: 'assets/dino-emotion-surprised.jpg',
    description: 'Grands yeux ronds et bouche en O !',
    voiceText: 'Oh là là ! Je suis surpris ! Mes yeux sont tout grands et ma bouche fait Oh !'
  },
  {
    id: 'angry',
    name: 'Fâché',
    emoji: '😠',
    image: 'assets/dino-emotion-angry.jpg',
    description: 'Sourcils froncés : on souffle doucement.',
    voiceText: 'Grrr… Ici je suis fâché. Pour me calmer, je souffle tout doucement comme sur une fleur : fffff…'
  }
];

const EMOTION_QUIZ_SCENARIOS = [
  {
    question: "Petit Dino reçoit un gros câlin et un ballon ! Comment se sent-il ?",
    targetId: 'happy',
    icon: '🎈'
  },
  {
    question: "Oh non… La glace de Petit Dino est tombée par terre. Comment se sent-il ?",
    targetId: 'sad',
    icon: '🍦'
  },
  {
    question: "Un joli papillon se pose tout à coup sur le nez de Dino ! Quel visage fait-il ?",
    targetId: 'surprised',
    icon: '🦋'
  },
  {
    question: "La tour de cubes est tombée et Dino fronce les sourcils. Quel visage est fâché ?",
    targetId: 'angry',
    icon: '🧱'
  }
];

const RULES_DATA = [
  {
    title: "Ranger ses jouets",
    situationEmoji: "🧸",
    question: "Tu as fini de jouer avec tes cubes. Que fait-on maintenant ?",
    good: {
      emoji: "🧺✅",
      label: "Ranger dans le coffre",
      feedback: "Bravo ! Quand on range ses jouets, la chambre reste toute belle !"
    },
    bad: {
      emoji: "💥❌",
      label: "Tout laisser par terre",
      feedback: "Oups ! On risque de marcher dessus. Choisis l'autre carte !"
    }
  },
  {
    title: "Dire les mots magiques",
    situationEmoji: "🍪",
    question: "On te donne un bon goûter. Quel est le mot magique ?",
    good: {
      emoji: "🙏😊",
      label: "Dire « Merci ! » avec un sourire",
      feedback: "Oui ! « S'il te plaît » et « Merci » sont les mots magiques !"
    },
    bad: {
      emoji: "😠❌",
      label: "Prendre sans rien dire",
      feedback: "C'est plus poli de dire « Merci ! ». Montre la bonne carte !"
    }
  },
  {
    title: "Se laver les mains",
    situationEmoji: "🧼",
    question: "C'est l'heure de manger à table. Que fait Petit Dino avant ?",
    good: {
      emoji: "🫧👐",
      label: "Se laver les mains au savon",
      feedback: "Super ! Des mains toutes propres chassent les petits microbes !"
    },
    bad: {
      emoji: "🐾❌",
      label: "Garder les mains sales",
      feedback: "Oups ! Il vaut mieux les laver avec de l'eau et du savon d'abord."
    }
  },
  {
    title: "Partager avec les copains",
    situationEmoji: "⚽",
    question: "Un copain aimerait jouer au ballon avec toi. Que fais-tu ?",
    good: {
      emoji: "🤝🦕",
      label: "Partager et jouer ensemble",
      feedback: "Génial ! C'est tellement plus amusant de partager et jouer à deux !"
    },
    bad: {
      emoji: "🙅‍♂️❌",
      label: "Pousser le copain",
      feedback: "Oh non, pousser fait mal. Choisis le bon geste pour jouer ensemble !"
    }
  },
  {
    title: "Attendre son tour",
    situationEmoji: "🛝",
    question: "Il y a déjà un enfant sur le toboggan. Que fait Petit Dino ?",
    good: {
      emoji: "⏳😊",
      label: "Attendre calmement son tour",
      feedback: "Bravo champion ! Tout le monde glisse en sécurité !"
    },
    bad: {
      emoji: "🏃‍♂️💥",
      label: "Doubler et pousser",
      feedback: "Attention, pousser dans l'escalier est dangereux. Essaie l'autre carte !"
    }
  },
  {
    title: "Mettre à la poubelle",
    situationEmoji: "🍌",
    question: "Petit Dino a fini sa banane. Où met-on la peau ?",
    good: {
      emoji: "🗑️✨",
      label: "Dans la poubelle",
      feedback: "Parfait ! Mettre à la poubelle garde la maison toute propre !"
    },
    bad: {
      emoji: "🍌💨",
      label: "Par terre sur le tapis",
      feedback: "Attention, on pourrait glisser dessus ! Où doit-elle aller ?"
    }
  }
];

const STICKERS_CATALOG = [
  { id: 's1', name: 'Ami Dino', emoji: '🦕', starsNeeded: 0 },
  { id: 's2', name: 'Chiffres', emoji: '🔢', starsNeeded: 2 },
  { id: 's3', name: 'Étoile', emoji: '🌟', starsNeeded: 4 },
  { id: 's4', name: 'Lettres', emoji: '🔤', starsNeeded: 6 },
  { id: 's5', name: 'Sourire', emoji: '💚', starsNeeded: 8 },
  { id: 's6', name: 'Champion', emoji: '👑', starsNeeded: 10 },
  { id: 's7', name: 'Arc-en-ciel', emoji: '🌈', starsNeeded: 12 },
  { id: 's8', name: 'Fusée', emoji: '🚀', starsNeeded: 15 }
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
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.13);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'success') {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.22, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  } else if (type === 'encourage') {
    const notes = [380, 330];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.13);
      gain.gain.setValueAtTime(0.15, now + idx * 0.13);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.13 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.13);
      osc.stop(now + idx * 0.13 + 0.2);
    });
  } else if (type === 'giggle') {
    const notes = [587.33, 698.46, 783.99, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.18, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.13);
    });
  }
}

/* ==========================================================================
   CONTRÔLEUR DE LA MASCOTTE « PETIT DINO » (100% HIGGSFIELD)
   ========================================================================== */

function setDinoReaction(state, speechText = null, options = {}) {
  const card = document.getElementById('mascot-card');
  const badge = document.getElementById('mascot-state-badge');
  const imgEl = document.getElementById('dino-3d-img');
  const videoEl = document.getElementById('dino-video-player');
  const speechEl = document.getElementById('dino-speech-text');
  const floaters = document.getElementById('reaction-floaters');

  const stateBadges = {
    idle: '🦕 Petit Dino',
    talking: '🗣️ Petit Dino parle...',
    celebrate: '🎉 Bravo !',
    encourage: '🤔 Essaie encore !',
    surprised: '😮 Oh !',
    happy: '😊 Joyeux !',
    sad: '😢 Câlin doux',
    angry: '😠 On souffle...'
  };

  const stateFloaters = {
    idle: ['✨', '⭐'],
    talking: ['🎵', '💬'],
    celebrate: ['🎉', '🌟'],
    encourage: ['💡', '👍'],
    surprised: ['❗', '✨'],
    happy: ['😊', '💛'],
    sad: ['💧', '💙'],
    angry: ['💨', '🍃']
  };

  card.dataset.state = state;
  if (badge) badge.textContent = stateBadges[state] || stateBadges.idle;

  const icons = stateFloaters[state] || stateFloaters.idle;
  floaters.innerHTML = `
    <span class="floater f1">${icons[0]}</span>
    <span class="floater f2">${icons[1]}</span>
  `;

  const media = AppState.higgsfieldMedia[state] || AppState.higgsfieldMedia.idle;

  if (AppState.useVideoAnimations && media.video) {
    imgEl.classList.add('hidden');
    videoEl.classList.remove('hidden');
    videoEl.poster = media.image;
    if (!videoEl.src.endsWith(media.video)) {
      videoEl.src = media.video;
      videoEl.load();
    }
    videoEl.play().catch(() => {
      videoEl.classList.add('hidden');
      imgEl.classList.remove('hidden');
      imgEl.src = media.image;
    });
  } else {
    videoEl.classList.add('hidden');
    imgEl.classList.remove('hidden');
    imgEl.src = media.image;
  }

  if (speechText) {
    AppState.lastInstruction = speechText.replace(/<[^>]*>/g, '');
    speechEl.innerHTML = speechText;
    if (!options.silent) {
      speakFrench(AppState.lastInstruction, state);
    }
  }
}

function speakFrench(text, afterState = 'idle') {
  if (!AppState.voiceEnabled || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.96;
    utterance.pitch = 1.2;

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
  const symbols = ['⭐', '🌟', '✨', '🎉', '🎈', '🦕', '💚'];

  for (let i = 0; i < 16; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.textContent = symbols[i % symbols.length];
    el.style.left = `${12 + Math.random() * 76}%`;
    el.style.top = `${25 + Math.random() * 40}%`;
    el.style.animationDelay = `${Math.random() * 0.2}s`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
}

function awardStar(count = 1) {
  AppState.stars += count;
  localStorage.setItem('dinociel_stars', String(AppState.stars));
  document.getElementById('star-count-value').textContent = AppState.stars;
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
   ACCUEIL — LES 4 MONDES DE PETIT DINO (Grille 2x2 sur 1 page)
   ========================================================================== */

function renderHomeWorld() {
  const stage = document.getElementById('activity-stage');
  setDinoReaction(
    'idle',
    "Coucou ! Je suis <strong>Petit Dino</strong> ! Touche un jeu pour apprendre avec moi !"
  );

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>🌤️ Choisis ton jeu avec Petit Dino</h2>
        <p>Appuie sur une grande carte pour commencer !</p>
      </div>
    </div>

    <div class="home-grid">
      <button class="home-world-card" data-goto="counting">
        <div class="world-card-icon">🔢</div>
        <div class="world-card-info">
          <h3>Compter</h3>
          <p>Compte les pommes, étoiles et œufs de Dino !</p>
        </div>
      </button>

      <button class="home-world-card" data-goto="letters">
        <div class="world-card-icon">🔤</div>
        <div class="world-card-info">
          <h3>Les Lettres</h3>
          <p>Découvre l'alphabet en images et en sons !</p>
        </div>
      </button>

      <button class="home-world-card" data-goto="emotions">
        <div class="world-card-icon">😊</div>
        <div class="world-card-info">
          <h3>Émotions</h3>
          <p>Joyeux, triste, surpris ou fâché avec Dino !</p>
        </div>
      </button>

      <button class="home-world-card" data-goto="rules">
        <div class="world-card-icon">🌟</div>
        <div class="world-card-info">
          <h3>Les Règles</h3>
          <p>Ranger, dire merci, partager et attendre son tour !</p>
        </div>
      </button>
    </div>
  `;

  stage.querySelectorAll('.home-world-card').forEach(card => {
    card.addEventListener('click', () => {
      playSoundEffect('pop');
      switchWorld(card.dataset.goto);
    });
  });
}

/* ==========================================================================
   MONDE 1 : APPRENDRE À COMPTER (1 à 5 / 1 à 8)
   ========================================================================== */

function startNewCountingRound(speakIntro = true) {
  const max = AppState.counting.levelMax;
  const target = Math.floor(Math.random() * max) + 1;
  const theme = COUNTING_THEMES[Math.floor(Math.random() * COUNTING_THEMES.length)];

  AppState.counting.targetCount = target;
  AppState.counting.currentItem = theme;
  AppState.counting.countedSet = new Set();

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
      `Touche chaque <strong>${theme.singular}</strong> pour compter, puis choisis combien il y a de ${label} !`
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
      <button class="countable-item ${isCounted ? 'counted' : ''}" data-index="${i}">
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
        <h2>🔢 Je compte avec Dino</h2>
      </div>
      <div class="submode-pills">
        <button class="submode-btn ${levelMax === 5 ? 'active' : ''}" data-max="5">1 à 5</button>
        <button class="submode-btn ${levelMax === 8 ? 'active' : ''}" data-max="8">1 à 8</button>
      </div>
    </div>

    <div class="counting-arena">
      <div class="counting-prompt-banner">
        Combien vois-tu de <strong>${targetCount > 1 ? currentItem.plural : currentItem.singular}</strong> ${currentItem.emoji} ?
      </div>

      <div class="counting-objects-grid">
        ${objectsHtml}
      </div>

      <div class="number-choices-row">
        ${choicesHtml}
      </div>
    </div>
  `;

  stage.querySelectorAll('.submode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.counting.levelMax = Number(btn.dataset.max);
      playSoundEffect('pop');
      startNewCountingRound(true);
    });
  });

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
          `<strong>${word} !</strong> Il y en a <strong>${targetCount}</strong> ! Touche le chiffre <strong>${targetCount}</strong> !`
        );
      } else {
        setDinoReaction('talking', `<strong>${word} !</strong> Continue !`);
      }
    });
  });

  stage.querySelectorAll('.number-choice-btn').forEach(numBtn => {
    numBtn.addEventListener('click', () => {
      const chosen = Number(numBtn.dataset.num);
      if (chosen === targetCount) {
        numBtn.classList.add('correct');
        awardStar(1);
        const word = FRENCH_NUMBER_WORDS[targetCount];
        setDinoReaction(
          'celebrate',
          `🎉 <strong>Bravo !</strong> C'est bien <strong>${targetCount}</strong> (${word}) !`
        );
        setTimeout(() => {
          if (AppState.currentWorld === 'counting') {
            startNewCountingRound(true);
          }
        }, 2300);
      } else {
        numBtn.classList.add('wrong');
        playSoundEffect('encourage');
        setDinoReaction(
          'encourage',
          `🤔 Oups, touche chaque ${currentItem.singular} ${currentItem.emoji} pour compter avec moi !`
        );
      }
    });
  });
}

/* ==========================================================================
   MONDE 2 : LES LETTRES (Grille 3x2 paginée pour tenir en 1 page iPhone)
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
  const { submode, page, pageSize } = AppState.letters;
  const totalPages = Math.ceil(ALPHABET_DATA.length / pageSize);

  if (submode === 'quiz' && !AppState.letters.quizTarget) {
    startLetterQuizRound();
  }

  let bodyHtml = '';

  if (submode === 'explore') {
    setDinoReaction(
      'idle',
      "Touche une lettre pour l'écouter avec moi : <strong>D comme Dinosaure</strong> !"
    );

    const startIdx = page * pageSize;
    const pageItems = ALPHABET_DATA.slice(startIdx, startIdx + pageSize);

    const cardsHtml = pageItems.map(
      (item, idx) => `
        <button class="letter-card" data-idx="${startIdx + idx}">
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
      <div class="activity-footer">
        <button class="btn-primary-action" id="btn-more-letters">
          ➡️ Autres lettres (${page + 1}/${totalPages})
        </button>
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
            <span class="letter-big">${opt.letter}</span>
            <span class="letter-emoji">${opt.emoji}</span>
            <span class="letter-word">${opt.word}</span>
          </button>
        `
      )
      .join('');

    bodyHtml = `
      <div class="counting-arena">
        <div class="counting-prompt-banner">
          Où est <strong>« ${target.letter} »</strong> comme <strong>${target.word} ${target.emoji}</strong> ?
        </div>
        <div class="quiz-options-grid">
          ${optionsHtml}
        </div>
      </div>
    `;
  }

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>🔤 Les Lettres</h2>
      </div>
      <div class="submode-pills">
        <button class="submode-btn ${submode === 'explore' ? 'active' : ''}" data-mode="explore">📖 Découvrir</button>
        <button class="submode-btn ${submode === 'quiz' ? 'active' : ''}" data-mode="quiz">🎯 Jeu</button>
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
        setDinoReaction('happy', `<strong>${item.letter}</strong> ! ${item.phrase}`);
      });
    });

    const moreBtn = stage.querySelector('#btn-more-letters');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        playSoundEffect('pop');
        AppState.letters.page = (AppState.letters.page + 1) % totalPages;
        renderLettersWorld();
      });
    }
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
            `🎉 <strong>Super !</strong> C'est bien <strong>${target.letter}</strong> comme <strong>${target.word}</strong> !`
          );
          setTimeout(() => {
            if (AppState.currentWorld === 'letters' && AppState.letters.submode === 'quiz') {
              startLetterQuizRound();
              renderLettersWorld();
            }
          }, 2200);
        } else {
          btn.classList.add('wrong');
          playSoundEffect('encourage');
          setDinoReaction(
            'encourage',
            `🤔 Cherche <strong>${target.letter}</strong> comme <strong>${target.word} ${target.emoji}</strong> !`
          );
        }
      });
    });
  }
}

/* ==========================================================================
   MONDE 3 : EXPRESSIONS FACIALES (Grille 2x2 Higgsfield en 1 page)
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
      `<strong>${currentEmotion.emoji} ${currentEmotion.name}</strong> : ${currentEmotion.voiceText}`
    );

    const cardsHtml = EMOTIONS_DATA.map(
      emo => `
        <button class="emotion-card ${emo.id === currentEmotion.id ? 'selected' : ''}" data-emo="${emo.id}">
          <img src="${emo.image}" alt="${emo.name}" class="emotion-portrait" />
          <div class="emotion-info">
            <span class="emotion-title">${emo.emoji} ${emo.name}</span>
            <span class="emotion-desc">${emo.description}</span>
          </div>
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
        <button class="emotion-card" data-emo="${emo.id}">
          <img src="${emo.image}" alt="${emo.name}" class="emotion-portrait" />
          <div class="emotion-info">
            <span class="emotion-title">${emo.emoji} ${emo.name}</span>
          </div>
        </button>
      `
    ).join('');

    contentHtml = `
      <div class="counting-prompt-banner">${scenario.icon} ${scenario.question}</div>
      <div class="emotions-grid">
        ${choicesHtml}
      </div>
    `;
  }

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>😊 Les Émotions de Dino</h2>
      </div>
      <div class="submode-pills">
        <button class="submode-btn ${submode === 'mirror' ? 'active' : ''}" data-mode="mirror">🪞 Visages</button>
        <button class="submode-btn ${submode === 'quiz' ? 'active' : ''}" data-mode="quiz">🎯 Jeu</button>
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
    stage.querySelectorAll('.emotion-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.emo;
        const scenario = AppState.emotions.quizScenario;
        const targetEmo = EMOTIONS_DATA.find(e => e.id === scenario.targetId);

        if (chosen === scenario.targetId) {
          btn.classList.add('quiz-card-btn', 'correct');
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
          }, 2200);
        } else {
          btn.classList.add('quiz-card-btn', 'wrong');
          playSoundEffect('encourage');
          setDinoReaction(
            'encourage',
            `🤔 Regarde bien Petit Dino : cherche le visage <strong>${targetEmo.name}</strong> !`
          );
        }
      });
    });
  }
}

/* ==========================================================================
   MONDE 4 : RESPECTER LES RÈGLES (1 page sans défilement)
   ========================================================================== */

function renderRulesWorld() {
  const stage = document.getElementById('activity-stage');
  const rule = RULES_DATA[AppState.rules.currentIndex % RULES_DATA.length];

  const choices = [
    { ...rule.good, isGood: true },
    { ...rule.bad, isGood: false }
  ].sort(() => Math.random() - 0.5);

  setDinoReaction(
    'idle',
    `<strong>${rule.title}</strong> : ${rule.question}`
  );

  const choicesHtml = choices
    .map(
      c => `
        <button class="rule-choice-btn" data-good="${c.isGood}">
          <span class="rule-choice-emoji">${c.emoji}</span>
          <span class="rule-choice-label">${c.label}</span>
        </button>
      `
    )
    .join('');

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>🌟 ${rule.title} (${AppState.rules.currentIndex + 1}/${RULES_DATA.length})</h2>
      </div>
      <div class="submode-pills">
        <button class="submode-btn active" id="btn-rule-next-top">➡️ Suivant</button>
      </div>
    </div>

    <div class="rule-scenario-card">
      <div class="rule-situation-emoji">${rule.situationEmoji}</div>
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
        }, 2800);
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
   MONDE 5 : GOMMETTES & ÉTOILES (Grille 4x2 sur 1 page)
   ========================================================================== */

function renderStickersWorld() {
  const stage = document.getElementById('activity-stage');

  setDinoReaction(
    'celebrate',
    `Bravo ! Tu as <strong>${AppState.stars} étoiles</strong> ⭐ ! Touche tes gommettes !`
  );

  const stickersHtml = STICKERS_CATALOG.map(st => {
    const unlocked = AppState.stars >= st.starsNeeded;
    return `
      <div class="sticker-slot ${unlocked ? 'unlocked' : 'locked'}" data-name="${st.name}">
        <span class="sticker-emoji">${st.emoji}</span>
        <span class="sticker-name">${st.name}</span>
        <span style="font-size:0.7rem; color: var(--sky-muted); font-weight:700;">
          ${unlocked ? '✅' : `🔒 ${st.starsNeeded}⭐`}
        </span>
      </div>
    `;
  }).join('');

  stage.innerHTML = `
    <div class="stage-header">
      <div class="stage-title-group">
        <h2>🏆 Mes Gommettes (${AppState.stars} ⭐)</h2>
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
        `Youpi ! C'est ta gommette <strong>${slot.dataset.name}</strong> !`
      );
    });
  });
}

/* ==========================================================================
   INITIALISATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('star-count-value').textContent = AppState.stars;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  document.querySelectorAll('.world-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      playSoundEffect('pop');
      switchWorld(tab.dataset.world);
    });
  });

  document.getElementById('btn-home-brand').addEventListener('click', () => {
    playSoundEffect('pop');
    switchWorld('home');
  });

  document.getElementById('btn-stickers-quick').addEventListener('click', () => {
    playSoundEffect('pop');
    switchWorld('stickers');
  });

  // Toggle between Higgsfield 2D Images (default) and Higgsfield Seedance 2.5 Videos
  const mediaBtn = document.getElementById('btn-toggle-media');
  mediaBtn.addEventListener('click', () => {
    playSoundEffect('pop');
    AppState.useVideoAnimations = !AppState.useVideoAnimations;
    document.getElementById('media-mode-icon').textContent = AppState.useVideoAnimations ? '🎬' : '🖼️';
    document.getElementById('media-mode-label').textContent = AppState.useVideoAnimations ? 'Vidéos 2D' : 'Images 2D';
    const currentState = document.getElementById('mascot-card').dataset.state || 'idle';
    setDinoReaction(currentState, null, { silent: true });
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

  document.getElementById('btn-replay-speech').addEventListener('click', () => {
    playSoundEffect('pop');
    AppState.voiceEnabled = true;
    voiceBtn.classList.add('active');
    document.getElementById('voice-icon').textContent = '🔊';
    speakFrench(AppState.lastInstruction);
  });

  const tickleHandler = () => {
    playSoundEffect('giggle');
    spawnCelebrationConfetti();
    const phrases = [
      "Hihihi ! Ça chatouille ! Tu es mon meilleur ami !",
      "Roaaar tout doux ! J'adore apprendre avec toi !",
      "Youpi ! On s'amuse trop bien ensemble !"
    ];
    setDinoReaction('celebrate', phrases[Math.floor(Math.random() * phrases.length)]);
  };

  document.getElementById('btn-tickle-dino').addEventListener('click', tickleHandler);
  document.getElementById('mascot-stage').addEventListener('click', tickleHandler);

  renderHomeWorld();
});
