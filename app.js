let currentCategory = null;
let currentNominees = [];
let currentNomineeIndex = 0;
let keyboardHandler = null;
let revealMode = false;
let currentRevealIndex = 0;
let revealData = null;

const alternativeImages = {
  Dylan: ["Dylan.png", "Dylan_2.png"],
};

function getImagePath(name) {
  const alternatives = alternativeImages[name];
  if (alternatives && Math.random() < 0.2) {
    const randomIndex = Math.floor(Math.random() * alternatives.length);
    return `cops/${alternatives[randomIndex]}`;
  }

  const imgExt = name === "Lodu" ? "jpg" : "png";
  return `cops/${name}.${imgExt}`;
}

function initApp() {
  displayCategories();

  document.getElementById("back-btn").addEventListener("click", () => {
    showView("categories");
  });

  document.getElementById("start-reveal-btn").addEventListener("click", () => {
    startReveal();
  });

  document.getElementById("stats-btn").addEventListener("click", () => {
    showView("stats");
  });
}

function displayCategories() {
  const grid = document.getElementById("categories-view");
  grid.innerHTML = "";

  Object.keys(awardsData).forEach((category) => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML = `<h3>${category}</h3>`;
    card.addEventListener("click", () => openCategory(category));
    grid.appendChild(card);
  });
}

function openCategory(category) {
  currentCategory = category;
  const data = awardsData[category];
  currentNominees = data.nominees;
  currentNomineeIndex = 0;

  const categoryName = document.getElementById("category-name");
  categoryName.textContent = category;
  categoryName.classList.remove("small");

  const mainHeader = document.querySelector(".main-header");
  mainHeader.classList.add("hidden");

  const nomineesList = document.getElementById("nominees-list");
  nomineesList.innerHTML = "";

  if (keyboardHandler) {
    document.removeEventListener("keydown", keyboardHandler);
  }

  keyboardHandler = (e) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      if (revealMode) {
        showNextReveal();
      } else {
        showNextNominee();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!revealMode && currentNomineeIndex >= currentNominees.length) {
        startReveal();
      }
    }
  };

  document.addEventListener("keydown", keyboardHandler);

  document.getElementById("reveal-section").classList.add("hidden");
  document.getElementById("reveal-section").classList.remove("finished");
  document.getElementById("start-reveal-btn").classList.remove("hidden");
  document.getElementById("nominees-section").classList.remove("hidden");

  showView("ceremony");
}

function showNextNominee() {
  if (currentNomineeIndex >= currentNominees.length) {
    return;
  }

  const nominee = currentNominees[currentNomineeIndex];
  const nomineesList = document.getElementById("nominees-list");

  const card = document.createElement("div");
  card.className = "nominee-card";

  const imgPath = getImagePath(nominee);

  card.innerHTML = `
    <div class="nominee-image-container">
      <img src="${imgPath}" alt="${nominee}" class="nominee-image">
    </div>
    <div class="nominee-name">${nominee}</div>
  `;
  nomineesList.appendChild(card);

  currentNomineeIndex++;
}

function showView(view) {
  const categoriesView = document.getElementById("categories-view");
  const ceremonyView = document.getElementById("ceremony-view");
  const statsView = document.getElementById("stats-view");
  const mainHeader = document.querySelector(".main-header");

  if (view === "categories") {
    categoriesView.classList.remove("hidden");
    ceremonyView.classList.add("hidden");
    statsView.classList.add("hidden");
    mainHeader.classList.remove("hidden");
    
    if (keyboardHandler) {
      document.removeEventListener("keydown", keyboardHandler);
      keyboardHandler = null;
    }
  } else if (view === "stats") {
    categoriesView.classList.add("hidden");
    ceremonyView.classList.add("hidden");
    statsView.classList.remove("hidden");
    mainHeader.classList.add("hidden");

    statsView.innerHTML = displayStats();

    document.getElementById("close-stats-btn").addEventListener("click", () => {
      showView("categories");
    });
  } else {
    categoriesView.classList.add("hidden");
    ceremonyView.classList.remove("hidden");
    statsView.classList.add("hidden");
    mainHeader.classList.add("hidden");
  }
}

async function startReveal() {
  if (keyboardHandler) {
    document.removeEventListener("keydown", keyboardHandler);
    keyboardHandler = null;
  }

  revealMode = true;
  currentRevealIndex = 0;

  const ceremonyView = document.getElementById("ceremony-view");
  const ceremonyHeader = document.querySelector(".ceremony-header-fixed");
  const backBtn = document.getElementById("back-btn");
  const categoryName = document.getElementById("category-name");
  const startBtn = document.getElementById("start-reveal-btn");
  const nomineesSection = document.getElementById("nominees-section");
  const revealSection = document.getElementById("reveal-section");

  ceremonyView.style.position = "fixed";
  ceremonyView.style.top = "0";
  ceremonyView.style.left = "0";
  ceremonyView.style.right = "0";
  ceremonyView.style.bottom = "0";
  ceremonyView.style.zIndex = "1000";
  ceremonyView.style.background =
    "linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)";

  startBtn.classList.add("hidden");
  nomineesSection.classList.add("hidden");
  backBtn.classList.add("hidden");
  categoryName.classList.add("hidden");
  revealSection.classList.remove("hidden");

  const data = awardsData[currentCategory];
  const rankings = data.rankings;

  revealData = {
    rankings: rankings,
    positions: [
      { rank: "TOP 3", class: "top3", index: Math.min(2, rankings.length - 1) },
      { rank: "TOP 2", class: "top2", index: 1 },
      { rank: "TOP 1", class: "top1", index: 0 },
    ],
    ceremonyView,
    backBtn,
    categoryName,
    revealSection
  };

  keyboardHandler = (e) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      showNextReveal();
    }
  };

  document.addEventListener("keydown", keyboardHandler);

  showNextReveal();
}

function showNextReveal() {
  if (!revealData || currentRevealIndex >= revealData.positions.length) {
    if (currentRevealIndex === revealData.positions.length) {
      finishReveal();
    }
    return;
  }

  const position = revealData.positions[currentRevealIndex];
  const [name, stats] = revealData.rankings[position.index];

  revealWinner(position.rank, name, stats, position.class);

  currentRevealIndex++;
}

function finishReveal() {
  displayPodium(revealData.rankings);

  revealData.backBtn.classList.remove("hidden");
  revealData.categoryName.classList.remove("hidden");
  revealData.categoryName.classList.add("small");
  revealData.revealSection.classList.add("finished");
  revealData.ceremonyView.style.position = "";
  revealData.ceremonyView.style.top = "";
  revealData.ceremonyView.style.left = "";
  revealData.ceremonyView.style.right = "";
  revealData.ceremonyView.style.bottom = "";
  revealData.ceremonyView.style.zIndex = "";
  revealData.ceremonyView.style.background = "";

  revealMode = false;
  revealData = null;

  if (keyboardHandler) {
    document.removeEventListener("keydown", keyboardHandler);
    keyboardHandler = null;
  }
}

function revealWinner(rank, name, stats, className) {
  const display = document.getElementById("winner-display");
  const imgPath = getImagePath(name);

  display.innerHTML = `
          <div class="category-label">${currentCategory}</div>
          <div class="winner-rank ${className}">${rank}</div>
          <div class="winner-image-container ${className}">
            <img src="${imgPath}" alt="${name}" class="winner-image">
          </div>
          <div class="winner-name ${className}">${name}</div>
          <div class="winner-stats">
              ${stats.total_points} points
              <br>
              (Top 1: ${stats["Top 1"]} • Top 2: ${stats["Top 2"]} • Top 3: ${stats["Top 3"]})
          </div>
      `;
}

function displayPodium(rankings) {
  const display = document.getElementById("winner-display");
  const top3 = rankings.slice(0, 3);

  let podiumHTML = '<div class="podium-title">🏆 Podium 🏆</div><div class="podium-container">';

  top3.forEach((ranking, index) => {
    const [name, stats] = ranking;
    const classes = ["top1", "top2", "top3"];
    const ranks = ["TOP 1", "TOP 2", "TOP 3"];
    const className = classes[index];
    const rank = ranks[index];
    const imgPath = getImagePath(name);

    podiumHTML += `
      <div class="podium-item">
        <div class="podium-rank ${className}">${rank}</div>
        <div class="podium-image-container">
          <img src="${imgPath}" alt="${name}" class="podium-image">
        </div>
        <div class="podium-name ${className}">${name}</div>
        <div class="podium-stats">
          ${stats.total_points} points
          <br>
          (Top 1: ${stats["Top 1"]} • Top 2: ${stats["Top 2"]} • Top 3: ${stats["Top 3"]})
        </div>
      </div>
    `;
  });

  podiumHTML += "</div>";
  display.innerHTML = podiumHTML;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", initApp);
