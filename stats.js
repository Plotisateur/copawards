function calculateStats() {
  const participants = [
    "Aloïs",
    "Damien",
    "Dylan",
    "Flo",
    "Hubert",
    "Jonathan",
    "Julia",
    "Lodu",
    "Momo",
    "PA",
    "Sachin",
    "Seb",
    "Skander",
    "Stan",
    "Thibaud",
    "Thomas",
    "Willy",
    "Yoan",
    "Youcef",
  ];

  const participantStats = {};
  participants.forEach((p) => {
    participantStats[p] = {
      nominations: 0,
      medals: 0,
      points: 0,
      top1: 0,
      categories: [],
    };
  });

  Object.entries(awardsData).forEach(([category, data]) => {
    data.nominees.forEach((nominee) => {
      participantStats[nominee].nominations++;
    });

    data.rankings.forEach(([name, stats], index) => {
      participantStats[name].points += stats.total_points;

      if (index === 0) {
        participantStats[name].top1++;
        participantStats[name].medals++;
        participantStats[name].categories.push({
          category,
          rank: 1,
          points: stats.total_points,
        });
      } else if (index === 1 || index === 2) {
        participantStats[name].medals++;
        participantStats[name].categories.push({
          category,
          rank: index + 1,
          points: stats.total_points,
        });
      }
    });
  });

  const mostNominated = Object.entries(participantStats).sort(
    (a, b) => b[1].nominations - a[1].nominations
  )[0];

  const leastNominated = Object.entries(participantStats)
    .filter(([_, stats]) => stats.nominations > 0)
    .sort((a, b) => a[1].nominations - b[1].nominations)[0];

  const top1Royal = Object.entries(participantStats).sort(
    (a, b) => b[1].top1 - a[1].top1
  )[0];

  const mostMedals = Object.entries(participantStats).sort(
    (a, b) => b[1].medals - a[1].medals
  )[0];

  const leastMedals = Object.entries(participantStats)
    .filter(([_, stats]) => stats.medals > 0)
    .sort((a, b) => a[1].medals - b[1].medals)[0];

  const mostPoints = Object.entries(participantStats).sort(
    (a, b) => b[1].points - a[1].points
  )[0];

  const leastPoints = Object.entries(participantStats)
    .filter(([_, stats]) => stats.points > 0)
    .sort((a, b) => a[1].points - b[1].points)[0];

  let biggestVictory = { category: "", name: "", points: 0, margin: 0 };
  let smallestVictory = { category: "", name: "", points: 0, margin: Infinity };

  Object.entries(awardsData).forEach(([category, data]) => {
    if (data.rankings.length >= 2) {
      const [first, second] = data.rankings;
      const margin = first[1].total_points - second[1].total_points;

      if (margin > biggestVictory.margin) {
        biggestVictory = {
          category,
          name: first[0],
          points: first[1].total_points,
          margin,
        };
      }

      if (margin < smallestVictory.margin) {
        smallestVictory = {
          category,
          name: first[0],
          points: first[1].total_points,
          margin,
        };
      }
    }
  });

  let tightestTop = { category: "", margin: Infinity };
  let loosestTop = { category: "", margin: 0 };

  Object.entries(awardsData).forEach(([category, data]) => {
    if (data.rankings.length >= 3) {
      const topThree = data.rankings.slice(0, 3);
      const maxPoints = topThree[0][1].total_points;
      const minPoints = topThree[2][1].total_points;
      const margin = maxPoints - minPoints;

      if (margin < tightestTop.margin) {
        tightestTop = { category, margin };
      }

      if (margin > loosestTop.margin) {
        loosestTop = { category, margin };
      }
    }
  });

  return {
    mostNominated,
    leastNominated,
    top1Royal,
    mostMedals,
    leastMedals,
    mostPoints,
    leastPoints,
    biggestVictory,
    smallestVictory,
    tightestTop,
    loosestTop,
  };
}

function displayStats() {
  const stats = calculateStats();

  const statsHTML = `
    <div class="stats-container">
      <h2 class="stats-title">📊 Statistiques de la Cérémonie</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🌟</div>
          <div class="stat-label">Le plus nommé</div>
          <div class="stat-value">${stats.mostNominated[0]}</div>
          <div class="stat-detail">${stats.mostNominated[1].nominations} nominations</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💤</div>
          <div class="stat-label">Le moins nommé</div>
          <div class="stat-value">${stats.leastNominated[0]}</div>
          <div class="stat-detail">${stats.leastNominated[1].nominations} nominations</div>
        </div>

        <div class="stat-card highlight">
          <div class="stat-icon">👑</div>
          <div class="stat-label">Le Top 1 Royal</div>
          <div class="stat-value">${stats.top1Royal[0]}</div>
          <div class="stat-detail">${stats.top1Royal[1].top1} victoires</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏅</div>
          <div class="stat-label">Le plus grand nombre de médailles</div>
          <div class="stat-value">${stats.mostMedals[0]}</div>
          <div class="stat-detail">${stats.mostMedals[1].medals} médailles</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🥉</div>
          <div class="stat-label">Le plus petit nombre de médailles</div>
          <div class="stat-value">${stats.leastMedals[0]}</div>
          <div class="stat-detail">${stats.leastMedals[1].medals} médailles</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💯</div>
          <div class="stat-label">Le plus grand nombre de points</div>
          <div class="stat-value">${stats.mostPoints[0]}</div>
          <div class="stat-detail">${stats.mostPoints[1].points} points</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📉</div>
          <div class="stat-label">Le plus petit nombre de points</div>
          <div class="stat-value">${stats.leastPoints[0]}</div>
          <div class="stat-detail">${stats.leastPoints[1].points} points</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🚀</div>
          <div class="stat-label">La plus grosse victoire</div>
          <div class="stat-value">${stats.biggestVictory.name}</div>
          <div class="stat-detail">${stats.biggestVictory.category} (+${stats.biggestVictory.margin} pts)</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">😅</div>
          <div class="stat-label">La plus petite victoire</div>
          <div class="stat-value">${stats.smallestVictory.name}</div>
          <div class="stat-detail">${stats.smallestVictory.category} (+${stats.smallestVictory.margin} pts)</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-label">Le Top le plus serré</div>
          <div class="stat-value">${stats.tightestTop.category}</div>
          <div class="stat-detail">Écart de ${stats.tightestTop.margin} pts</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-label">Le Top le moins serré</div>
          <div class="stat-value">${stats.loosestTop.category}</div>
          <div class="stat-detail">Écart de ${stats.loosestTop.margin} pts</div>
        </div>
      </div>

      <button id="close-stats-btn" class="back-btn" style="margin: 30px auto; display: block;">← Retour aux catégories</button>
    </div>
  `;

  return statsHTML;
}
