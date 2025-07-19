// ──────────────────────────────────────────────
// LeetMatrix  –  index.js  (updated 2025‑07‑19)
// ──────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // show today’s date
  document.getElementById("date").textContent = new Date().toDateString();

  // click handler for the Search button
  document.getElementById("search").addEventListener("click", async () => {
    const username = document.getElementById("user-name").value.trim();
    if (!username) return alert("Please enter a username");

    try {
      /* 1️⃣  Main profile / progress stats  */
      const statsRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      const stats = await statsRes.json();

      if (stats.status === "error") {
        alert("User not found!");
        return;
      }

      // update progress rings
      updateProgress("easy-circle", "easy-percent", stats.easySolved,   stats.totalEasy);
      updateProgress("medium-circle", "medium-percent", stats.mediumSolved, stats.totalMedium);
      updateProgress("hard-circle", "hard-percent", stats.hardSolved,   stats.totalHard);

      // numeric boxes
      document.getElementById("easy-box").innerText   = `${stats.easySolved}/${stats.totalEasy}`;
      document.getElementById("medium-box").innerText = `${stats.mediumSolved}/${stats.totalMedium}`;
      document.getElementById("hard-box").innerText   = `${stats.hardSolved}/${stats.totalHard}`;

      // cards
      document.getElementById("total-solved").innerText = `Total Solved: ${stats.totalSolved}`;
      document.getElementById("ranking").innerText      = `Ranking: ${stats.ranking}`;
      document.getElementById("contribution").innerText = `Contribution: ${stats.contributionPoints}`;

      // extra info
      document.getElementById("more-data").innerHTML = `
        <p><strong>Acceptance Rate:</strong> ${stats.acceptanceRate}%</p>
        <p><strong>Reputation:</strong> ${stats.reputation}</p>
      `;

      /* 2️⃣  Recent submissions from YOUR Vercel backend  */
      const subRes = await fetch(`https://leetmetrix.vercel.app/api/submissions?username=${username}`);
      const submissions = await subRes.json();

      const tbody = document.querySelector("#submissions-table tbody");
      tbody.innerHTML = submissions.slice(0, 5).map(sub => `
        <tr>
          <td>${sub.title}</td>
          <td>${sub.statusDisplay}</td>
          <td>${new Date(sub.timestamp * 1000).toLocaleString()}</td>
        </tr>
      `).join("");

      /* 3️⃣  (Optional) simulated contest data */
      const contests = [
        { name: "Weekly Contest 400", rank: 512, score: 380, date: "2024‑06‑01" },
        { name: "Biweekly Contest 120", rank: 210, score: 450, date: "2024‑05‑18" }
      ];
      const contestTbody = document.querySelector("#contest-table tbody");
      contestTbody.innerHTML = contests.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.rank}</td>
          <td>${c.score}</td>
          <td>${c.date}</td>
        </tr>
      `).join("");

    } catch (err) {
      console.error(err);
      alert("Network error – please try again later.");
    }
  });

  /* 🔧 helper to update circular progress ring & percent label */
  function updateProgress(circleId, percentId, solved, total) {
    const pct = total ? ((solved / total) * 100).toFixed(1) : 0;
    document.getElementById(circleId).style.setProperty("--progress", `${pct}%`);
    document.getElementById(percentId).innerText = `${pct}%`;
  }
});
