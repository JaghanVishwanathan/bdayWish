(function () {
  "use strict";

  const STORAGE_KEY = "birthdayHuntProgress";

  const PAGES = {
    index: 0,
    clue1: 1,
    clue2: 2,
    clue3: 3,
    clue4: 4,
    clue5: 5,
    finish: 6,
  };

  const PAGE_ROUTES = [
    "index.html",
    "clue1.html",
    "clue2.html",
    "clue3.html",
    "clue4.html",
    "clue5.html",
    "finish.html",
  ];

  /* ── Progress ── */

  function getProgress() {
    const val = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return isNaN(val) ? 0 : Math.min(Math.max(val, 0), 6);
  }

  function setProgress(level) {
    localStorage.setItem(STORAGE_KEY, String(level));
  }

  function getPageId() {
    const file = window.location.pathname.split("/").pop() || "index.html";
    const key = file.replace(".html", "");
    return key in PAGES ? key : "index";
  }

  function getRequiredLevel() {
    return PAGES[getPageId()];
  }

  function redirectToProgress() {
    const progress = getProgress();
    const required = getRequiredLevel();
    if (required <= progress) return;

    const target = PAGE_ROUTES[progress];
    if (target && target !== window.location.pathname.split("/").pop()) {
      window.location.replace(target);
    }
  }

  /* ── Page transitions ── */

  function navigateTo(url) {
    document.body.classList.add("page-exit");
    setTimeout(() => {
      window.location.href = url;
    }, 350);
  }

  /* ── Floating hearts ── */

  function createHearts() {
    const container = document.querySelector(".hearts-bg");
    if (!container) return;

    const hearts = ["💗", "💕", "💖", "💝", "🩷"];
    for (let i = 0; i < 12; i++) {
      const el = document.createElement("span");
      el.className = "heart";
      el.textContent = hearts[i % hearts.length];
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDuration = 8 + Math.random() * 10 + "s";
      el.style.animationDelay = Math.random() * 8 + "s";
      el.style.fontSize = 0.9 + Math.random() * 1.2 + "rem";
      container.appendChild(el);
    }
  }

  /* ── Progress bar ── */

  function initProgressBar(percent) {
    const fill = document.querySelector(".progress-fill");
    const label = document.querySelector(".progress-percent");
    if (!fill) return;

    requestAnimationFrame(() => {
      fill.style.width = percent + "%";
    });
    if (label) label.textContent = percent + "%";
  }

  /* ── Typewriter ── */

  function typewriter(element, text, speed, callback) {
    if (!element) {
      if (callback) callback();
      return;
    }

    element.textContent = "";
    element.classList.add("typing");
    let i = 0;

    function tick() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(tick, speed);
      } else {
        element.classList.remove("typing");
        if (callback) callback();
      }
    }

    tick();
  }

  /* ── Confetti ── */

  let confettiRunning = false;
  let confettiPieces = [];
  let confettiCtx = null;
  let confettiCanvas = null;

  function initConfetti() {
    confettiCanvas = document.getElementById("confetti-canvas");
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext("2d");
    resizeConfetti();
    window.addEventListener("resize", resizeConfetti);
  }

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function burstConfetti(duration) {
    if (!confettiCanvas || !confettiCtx) return;

    confettiCanvas.style.display = "block";
    confettiPieces = [];

    const colors = ["#f8b4d9", "#d4c4f0", "#b8e8d4", "#ffd4b8", "#e891b0", "#fff176", "#81d4fa"];
    for (let i = 0; i < 120; i++) {
      confettiPieces.push({
        x: confettiCanvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: confettiCanvas.height * 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -14 - 4,
        size: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }

    if (!confettiRunning) {
      confettiRunning = true;
      animateConfetti();
    }

    if (duration) {
      setTimeout(stopConfetti, duration);
    }
  }

  function animateConfetti() {
    if (!confettiCtx || !confettiCanvas) return;

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    let alive = 0;
    confettiPieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.spin;

      if (p.y < confettiCanvas.height + 20) alive++;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;

      if (p.shape === "rect") {
        confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();
    });

    if (alive > 0 && confettiRunning) {
      requestAnimationFrame(animateConfetti);
    } else {
      stopConfetti();
    }
  }

  function stopConfetti() {
    confettiRunning = false;
    if (confettiCanvas) confettiCanvas.style.display = "none";
    confettiPieces = [];
  }

  function startFinishConfetti() {
    if (!confettiCanvas || !confettiCtx) return;

    confettiCanvas.style.display = "block";
    confettiPieces = [];

    const colors = ["#f8b4d9", "#d4c4f0", "#b8e8d4", "#ffd4b8", "#e891b0", "#fff176"];
    for (let i = 0; i < 200; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 6,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }

    confettiRunning = true;
    loopFinishConfetti();
  }

  function loopFinishConfetti() {
    if (!confettiRunning || !confettiCtx) return;

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;

      if (p.y > confettiCanvas.height) {
        p.y = -10;
        p.x = Math.random() * confettiCanvas.width;
      }

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;

      if (p.shape === "rect") {
        confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();
    });

    requestAnimationFrame(loopFinishConfetti);
  }

  /* ── Optional success chime ── */

  function playSuccessSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (_) {
      /* audio not available */
    }
  }

  /* ── Answer checking ── */

  function normalizeAnswer(str) {
    return str
      .trim()
      .toLowerCase()
      .replace(/^the\s+/, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ");
  }

  function isCorrectAnswer(input, accepted) {
    const normalized = normalizeAnswer(input);
    return accepted.some((a) => normalizeAnswer(a) === normalized);
  }

  /* ── Start page ── */

  function initStartPage() {
    const btn = document.getElementById("start-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      setProgress(1);
      navigateTo("clue1.html");
    });
  }

  /* ── Clue page ── */

  function initCluePage(config) {
    const required = config.clueNumber;
    const currentProgress = getProgress();

    if (currentProgress < required) {
      redirectToProgress();
      return;
    }

    initProgressBar(config.progress);
    setProgress(Math.max(currentProgress, required));

    const storyEl = document.getElementById("story-text");
    const form = document.getElementById("clue-form");
    const reveal = document.getElementById("reveal-section");
    const input = document.getElementById("answer-input");
    const submitBtn = document.getElementById("submit-btn");
    const errorEl = document.getElementById("hint-error");
    const continueBtn = document.getElementById("continue-btn");

    typewriter(storyEl, config.story, 28);

    function handleSubmit() {
      const answer = input.value;
      if (!answer.trim()) {
        errorEl.textContent = "Type your guess first!";
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 450);
        return;
      }

      if (!isCorrectAnswer(answer, config.answers)) {
        errorEl.textContent = "Not quite — try again!";
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 450);
        return;
      }

      errorEl.textContent = "";
      submitBtn.disabled = true;
      input.disabled = true;
      form.classList.add("hidden");
      reveal.classList.add("visible");

      burstConfetti(2500);
      playSuccessSound();

      if (config.specialReveal) {
        handleSpecialReveal(config);
      }

      setProgress(required + 1);
    }

    submitBtn.addEventListener("click", handleSubmit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSubmit();
    });

    if (continueBtn && !config.specialReveal) {
      continueBtn.addEventListener("click", () => {
        navigateTo(config.nextPage);
      });
    }
  }

  function handleSpecialReveal() {
    const nameEl = document.getElementById("special-name");
    const jokeEl = document.getElementById("joke-text");
    const realReveal = document.getElementById("real-reveal");
    const finishBtn = document.getElementById("finish-btn");

    if (nameEl) {
      nameEl.style.display = "block";
      setTimeout(() => {
        if (jokeEl) jokeEl.style.display = "block";
        if (realReveal) realReveal.style.display = "block";
        if (finishBtn) finishBtn.style.display = "block";
      }, 3000);
    }

    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        setProgress(6);
        navigateTo("finish.html");
      });
    }
  }

  /* ── Finish page ── */

  function initFinishPage() {
    if (getProgress() < 6) {
      redirectToProgress();
      return;
    }

    initProgressBar(100);
    startFinishConfetti();

    const playAgain = document.getElementById("play-again-btn");
    if (playAgain) {
      playAgain.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEY);
        navigateTo("index.html");
      });
    }
  }

  /* ── Boot ── */

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-enter");
    createHearts();
    initConfetti();

    const pageId = getPageId();

    if (pageId !== "index" && pageId !== "finish") {
      redirectToProgress();
    }

    if (pageId === "index") {
      initStartPage();
    } else if (pageId === "finish") {
      initFinishPage();
    } else if (window.CLUE_CONFIG) {
      initCluePage(window.CLUE_CONFIG);
    }
  });

  window.BirthdayHunt = {
    getProgress,
    setProgress,
    navigateTo,
    burstConfetti,
  };
})();
