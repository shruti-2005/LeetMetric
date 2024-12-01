document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Unable to fetch user details. Please check the username.");
      }

      const userData = await response.json();
      console.log("User Data:", userData);

      displayUserData(userData);
    } catch (error) {
      statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(userData) {
    if (!userData.totalSolved) {
      statsContainer.innerHTML = `<p>User not found or no data available</p>`;
      return;
    }

    updateProgress(userData.easySolved, userData.totalEasy, easyLabel, easyProgressCircle);
    updateProgress(userData.mediumSolved, userData.totalMedium, mediumLabel, mediumProgressCircle);
    updateProgress(userData.hardSolved, userData.totalHard, hardLabel,hardProgressCircle);

    const cardsData = [
      { label: "Total Problems Solved", value: userData.totalSolved },
      { label: "Easy Problems Solved", value: userData.easySolved },
      { label: "Medium Problems Solved", value: userData.mediumSolved },
      { label: "Hard Problems Solved", value: userData.hardSolved },
    ];

    cardStatsContainer.innerHTML = cardsData
      .map(
        (data) => `
        <div class="card">
          <h4>${data.label}</h4>
          <p>${data.value}</p>
        </div>`
      )
      .join("");
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
