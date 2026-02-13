// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Set Valentine's Day date (February 14th of current year)
  const today = new Date();
  const currentYear = today.getFullYear();
  let valentineDate = new Date(currentYear, 1, 14); // February is month 1 (0-indexed)

  // If Valentine's Day has passed this year, set for next year
  if (today > valentineDate) {
    valentineDate = new Date(currentYear + 1, 1, 14);
  }

  window.valentineDate = valentineDate;

  // Create floating hearts
  createHearts();

  // Start countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Set initial active section
  showSection("landing");

  // Add scroll event listener for section transitions
  let isScrolling = false;
  window.addEventListener("wheel", function (e) {
    if (isScrolling) return;

    isScrolling = true;
    const sections = [
      "landing",
      "message",
      "memories",
      "proposal",
      "gallery",
      "countdown",
    ];
    const currentIndex = sections.indexOf(getCurrentSection());

    if (e.deltaY > 0 && currentIndex < sections.length - 1) {
      // Scroll down
      navigateTo(sections[currentIndex + 1]);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      // Scroll up
      navigateTo(sections[currentIndex - 1]);
    }

    setTimeout(() => {
      isScrolling = false;
    }, 800);
  });

  // Add touch events for mobile
  let touchStartY = 0;
  window.addEventListener("touchstart", function (e) {
    touchStartY = e.touches[0].clientY;
  });

  window.addEventListener("touchend", function (e) {
    if (isScrolling) return;

    const touchEndY = e.changedTouches[0].clientY;
    const sections = [
      "landing",
      "message",
      "memories",
      "proposal",
      "gallery",
      "countdown",
    ];
    const currentIndex = sections.indexOf(getCurrentSection());

    if (touchStartY - touchEndY > 50 && currentIndex < sections.length - 1) {
      // Swipe up
      isScrolling = true;
      navigateTo(sections[currentIndex + 1]);
      setTimeout(() => {
        isScrolling = false;
      }, 800);
    } else if (touchEndY - touchStartY > 50 && currentIndex > 0) {
      // Swipe down
      isScrolling = true;
      navigateTo(sections[currentIndex - 1]);
      setTimeout(() => {
        isScrolling = false;
      }, 800);
    }
  });

  // Add keyboard support for proposal
  document.addEventListener("keydown", function (e) {
    const currentSection = getCurrentSection();

    if (currentSection === "proposal") {
      if (e.key === "y" || e.key === "Y" || e.key === "Enter") {
        answerYes();
      } else if (e.key === "n" || e.key === "N") {
        answerNo();
      }
    }
  });
});

// Navigation function
function navigateTo(sectionId) {
  showSection(sectionId);
  updateNavigationDots(sectionId);

  // Scroll to section
  document.getElementById(sectionId).scrollIntoView({
    behavior: "smooth",
  });
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Show selected section
  document.getElementById(sectionId).classList.add("active");
}

function getCurrentSection() {
  const activeSection = document.querySelector(".section.active");
  return activeSection ? activeSection.id : "landing";
}

function updateNavigationDots(sectionId) {
  const sections = [
    "landing",
    "message",
    "memories",
    "proposal",
    "gallery",
    "countdown",
  ];
  const dots = document.querySelectorAll(".dot");

  dots.forEach((dot, index) => {
    if (sections[index] === sectionId) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Create floating hearts
function createHearts() {
  const heartsContainer = document.querySelector(".hearts-background");
  if (!heartsContainer) return;

  // Create 15 hearts
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");

    // Random position
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 10 + 5;

    heart.style.left = `${left}%`;
    heart.style.top = `${top}%`;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${Math.random() * 5}s`;
    heart.style.opacity = Math.random() * 0.5 + 0.3;

    heartsContainer.appendChild(heart);
  }
}

// Countdown timer
function updateCountdown() {
  if (!window.valentineDate) return;

  const now = new Date().getTime();
  const distance = window.valentineDate.getTime() - now;

  if (distance < 0) {
    // Valentine's Day has arrived!
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days
    .toString()
    .padStart(2, "0");
  document.getElementById("hours").textContent = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").textContent = seconds
    .toString()
    .padStart(2, "0");
}

// Music control
function toggleMusic() {
  const audio = document.getElementById("loveSong");
  const button = document.getElementById("musicBtn");

  if (audio.paused) {
    audio.play();
    button.innerHTML = '<i class="fas fa-pause"></i><span>Pause Music</span>';
  } else {
    audio.pause();
    button.innerHTML =
      '<i class="fas fa-music"></i><span>Play Love Song</span>';
  }
}

// Add click effect on buttons
document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("nav-btn") ||
    e.target.closest(".nav-btn") ||
    e.target.classList.contains("answer-btn") ||
    e.target.closest(".answer-btn")
  ) {
    const btn =
      e.target.classList.contains("nav-btn") ||
      e.target.classList.contains("answer-btn")
        ? e.target
        : e.target.closest(".nav-btn") || e.target.closest(".answer-btn");

    // Create ripple effect
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    btn.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
});

// Proposal Section Functions
function answerYes() {
  const yesResponse = document.getElementById("yesResponse");
  const noResponse = document.getElementById("noResponse");
  const answerButtons = document.querySelector(".answer-buttons");

  // Hide buttons, show yes response
  answerButtons.style.display = "none";
  yesResponse.style.display = "block";
  noResponse.style.display = "none";

  // Create celebration effect
  createConfetti();
  playCelebrationSound();

  // Send romantic notification (simulated)
  sendRomanticNotification();
}

function answerNo() {
  const yesResponse = document.getElementById("yesResponse");
  const noResponse = document.getElementById("noResponse");
  const answerButtons = document.querySelector(".answer-buttons");

  // Hide buttons, show no response
  answerButtons.style.display = "none";
  noResponse.style.display = "block";
  yesResponse.style.display = "none";

  // Make the No button move away when hovered
  const noBtn = document.querySelector(".no-btn");
  noBtn.style.position = "relative";
  noBtn.style.transition = "all 0.3s";

  // Add funny movement to No button
  noBtn.addEventListener("mouseover", function () {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    this.style.transform = `translate(${x}px, ${y}px)`;
  });

  noBtn.addEventListener("click", function (e) {
    // Prevent multiple clicks
    e.stopPropagation();
    // Button runs away on click
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 300 - 150;
    this.style.transform = `translate(${x}px, ${y}px)`;
  });
}

function createConfetti() {
  const container = document.querySelector(".confetti-container");
  const colors = [
    "#7E57C2",
    "#9575CD",
    "#B39DDB",
    "#D1C4E9",
    "#E1BEE7",
    "#F3E5F5",
  ];

  // Clear existing confetti
  container.innerHTML = "";

  // Create 150 pieces of confetti
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // Random properties
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 1 + 1;
    const delay = Math.random() * 2;

    confetti.style.backgroundColor = color;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.left = `${left}%`;
    confetti.style.animationDuration = `${duration}s`;
    confetti.style.animationDelay = `${delay}s`;
    confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";

    container.appendChild(confetti);

    // Remove confetti after animation
    setTimeout(() => {
      if (confetti.parentNode === container) {
        confetti.remove();
      }
    }, 2000);
  }
}

function playCelebrationSound() {
  // Create a celebratory sound effect
  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play a happy melody
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime + 0.3); // C6

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.log("Audio context not supported, but celebration continues!");
  }
}

function sendRomanticNotification() {
  // Simulate sending a romantic message
  console.log("💝 Sending romantic notification to Vee...");
  console.log("📱 Check her phone for a sweet message!");

  // If you want to actually send a text, you'd need to integrate with an SMS API
  // For now, we'll just display a message
  setTimeout(() => {
    alert(
      "💖 Taonga,\nIn you, I've found everything I never knew I was looking for. \nYou're not just my love - you're my home, my peace, my happiness.\nI promise to make every single one as special as you are to me.\nWith you, every day is more than Valentine's Day.\n\nForever and always,\nJoe❤️ ",
    );
  }, 1500);
}

// Auto-play music for romantic effect
window.addEventListener("load", function () {
  // Auto-start music after a short delay
  setTimeout(() => {
    const audio = document.getElementById("loveSong");
    const button = document.getElementById("musicBtn");

    if (audio && !audio.paused) {
      audio
        .play()
        .then(() => {
          button.innerHTML =
            '<i class="fas fa-pause"></i><span>Pause Music</span>';
        })
        .catch((e) => {
          console.log("Auto-play was prevented:", e);
          // Update button to show play icon
          button.innerHTML =
            '<i class="fas fa-music"></i><span>Play Love Song</span>';
        });
    }
  }, 2000);
});
