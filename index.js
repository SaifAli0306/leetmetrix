document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  document.getElementById("date").textContent = today.toDateString();

  document.getElementById("search").addEventListener("click", async () => {
    const username = document.getElementById("user-name").value.trim();
    if (!username) return alert("Please enter a username");

    try {
      // 1. Fetch LeetCode Stats
      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      const data = await res.json();

     if (data.status === "error") {
  alert("User not found!");
  return;
}

      }

      // 2. Update progress circles and stats
      updateProgress("easy-circle", "easy-percent", data.easySolved, data.totalEasy);
      updateProgress("medium-circle", "medium-percent", data.mediumSolved, data.totalMedium);
      updateProgress("hard-circle", "hard-percent", data.hardSolved, data.totalHard);

      document.getElementById("easy-box").innerText = `${data.easySolved}/${data.totalEasy}`;
      document.getElementById("medium-box").innerText = `${data.mediumSolved}/${data.totalMedium}`;
      document.getElementById("hard-box").innerText = `${data.hardSolved}/${data.totalHard}`;

      document.getElementById("total-solved").innerText = `Total Solved: ${data.totalSolved}`;
      document.getElementById("ranking").innerText = `Ranking: ${data.ranking}`;
      document.getElementById("contribution").innerText = `Contribution: ${data.contributionPoints}`;

      document.getElementById("more-data").innerHTML = `
        <p><strong>Recent Submission Stats:</strong> ${data.recentSubmissions?.length || 'N/A'}</p>
        <p><strong>Acceptance Rate:</strong> ${data.acceptanceRate || 'N/A'}%</p>
        <p><strong>Reputation:</strong> ${data.reputation || 0}</p>
      `;

      // 3. Fetch Real Recent Submissions from Vercel-Hosted API
      const submissionRes = await fetch(`https://leetmetrix.vercel.app/api/submissions?username=${username}`);
      const realSubmissions = await submissionRes.json();

      const tbody = document.querySelector("#submissions-table tbody");
      tbody.innerHTML = realSubmissions.slice(0, 5).map(sub => `
        <tr>
          <td>${sub.title}</td>
          <td>${sub.statusDisplay}</td>
          <td>${new Date(sub.timestamp * 1000).toLocaleString()}</td>
        </tr>
      `).join("");

      // 4. Simulated Contest Data
      const contests = [
        { name: "Weekly Contest 400", rank: 512, score: 380, date: "2024-06-01" },
        { name: "Biweekly Contest 120", rank: 210, score: 450, date: "2024-05-18" }
      ];

      const contestTbody = document.querySelector("#contest-table tbody");
      contestTbody.innerHTML = contests.map(contest => `
        <tr>
          <td>${contest.name}</td>
          <td>${contest.rank}</td>
          <td>${contest.score}</td>
          <td>${contest.date}</td>
        </tr>
      `).join("");

    } catch (error) {
      alert("Error fetching data. Please check username or try again later.");
      console.error(error);
    }
  });

  // 🔧 Update circular progress visual and percent text
  function updateProgress(circleId, percentId, solved, total) {
    const percent = total === 0 ? 0 : ((solved / total) * 100).toFixed(1);
    document.getElementById(circleId).style.setProperty("--progress", `${percent}%`);
    document.getElementById(percentId).innerText = `${percent}%`;
  }
});
