let currentCategory = null;

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

  const categoryName = document.getElementById("category-name");
  categoryName.textContent = category;
  categoryName.classList.remove("small");

  const nomineesList = document.getElementById("nominees-list");
  nomineesList.innerHTML = "";

  data.nominees.forEach((nominee, index) => {
    setTimeout(() => {
      const card = document.createElement("div");
      card.className = "nominee-card";
      card.textContent = nominee;
      nomineesList.appendChild(card);
    }, index * 120);
  });

  document.getElementById("reveal-section").classList.add("hidden");
  document.getElementById("reveal-section").classList.remove("finished");
  document.getElementById("start-reveal-btn").classList.remove("hidden");
  document.getElementById("nominees-section").classList.remove("hidden");

  showView("ceremony");
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
  const ceremonyView = document.getElementById("ceremony-view");
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

  const positions = [
    { rank: "TOP 3", class: "top3", delay: 2000 },
    { rank: "TOP 2", class: "top2", delay: 2500 },
    { rank: "TOP 1", class: "top1", delay: 3000 },
  ];

  for (let i = Math.min(2, rankings.length - 1); i >= 0; i--) {
    const position = positions[2 - i];
    const [name, stats] = rankings[i];

    await revealWinner(position.rank, name, stats, position.class);
    await sleep(position.delay);
  }

  displayPodium(rankings);
  
  backBtn.classList.remove("hidden");
  categoryName.classList.remove("hidden");
  categoryName.classList.add("small");
  revealSection.classList.add("finished");
  ceremonyView.style.position = "";
  ceremonyView.style.top = "";
  ceremonyView.style.left = "";
  ceremonyView.style.right = "";
  ceremonyView.style.bottom = "";
  ceremonyView.style.zIndex = "";
  ceremonyView.style.background = "";
}

function revealWinner(rank, name, stats, className) {
  return new Promise((resolve) => {
    const display = document.getElementById("winner-display");
    display.innerHTML = `
            <div class="category-label">${currentCategory}</div>
            <div class="winner-rank ${className}">${rank}</div>
            <div class="winner-name ${className}">${name}</div>
            <div class="winner-stats">
                ${stats.total_points} points
                <br>
                (Top 1: ${stats["Top 1"]} • Top 2: ${stats["Top 2"]} • Top 3: ${stats["Top 3"]})
            </div>
        `;

    setTimeout(resolve, 1000);
  });
}

function displayPodium(rankings) {
  const display = document.getElementById("winner-display");
  const top3 = rankings.slice(0, 3);
  
  let podiumHTML = '<div class="podium-container">';
  
  top3.forEach((ranking, index) => {
    const [name, stats] = ranking;
    const classes = ['top1', 'top2', 'top3'];
    const ranks = ['TOP 1', 'TOP 2', 'TOP 3'];
    const className = classes[index];
    const rank = ranks[index];
    
    podiumHTML += `
      <div class="podium-item">
        <div class="podium-rank ${className}">${rank}</div>
        <div class="podium-name ${className}">${name}</div>
        <div class="podium-stats">
          ${stats.total_points} points
          <br>
          (Top 1: ${stats["Top 1"]} • Top 2: ${stats["Top 2"]} • Top 3: ${stats["Top 3"]})
        </div>
      </div>
    `;
  });
  
  podiumHTML += '</div>';
  display.innerHTML = podiumHTML;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", initApp);
