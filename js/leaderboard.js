const root = document.querySelector("#root");

if (localStorage.leaderboard) {
  const leaderBoard = JSON.parse(localStorage.leaderboard);
  const arrayLeaderBoard = Object.entries(leaderBoard)
    .filter((arr) => arr[1].length > 0)
    .sort((a, b) => b[0] - a[0]);
  arrayLeaderBoard.forEach((category, idx) => createCategory(category, idx));
  root.append(accordion);
} else {
  const emptyLeaderBoard = document.createElement("div");
  emptyLeaderBoard.className = "empty-leaderboard";
  emptyLeaderBoard.textContent = "Sorry, No players Yet!!";
  root.append(emptyLeaderBoard);
}

function createCategory(cat, idx) {
  const scoreBox = document.createElement("div");
  scoreBox.className = `score-box ${idx === 0 ? "active" : ""}`;
  const showScoresBtn = document.createElement("button");
  showScoresBtn.className = `btn`;
  const buttonTxt = document.createTextNode(`Score - ${cat[0]}`);
  showScoresBtn.append(buttonTxt);
  const arrow = document.createElement("i");
  arrow.className = "fas fa-chevron-down";
  showScoresBtn.append(arrow);
  showScoresBtn.setAttribute("onclick", "showScoreHandler(this)");
  const boardBody = document.createElement("div");
  boardBody.className = "board-body";
  const ol = document.createElement("ol");
  cat[1]
    .sort((a, b) => b.score - a.score)
    .forEach((player) => {
      const li = document.createElement("li");
      const playerDiv = document.createElement("div");
      playerDiv.className = "player";
      const playerName = document.createElement("span");
      playerName.className = "name";
      playerName.textContent = player.name;
      const playerScore = document.createElement("span");
      playerScore.className = "score";
      playerScore.textContent = player.score;
      playerDiv.append(playerName, playerScore);
      li.append(playerDiv);
      ol.append(li);
    });
  boardBody.append(ol);
  scoreBox.append(showScoresBtn, boardBody);
  root.appendChild(scoreBox);
}

function showScoreHandler(obj) {
  const scoreWrapper = obj.parentElement;
  document.querySelectorAll(".score-box").forEach((box) => {
    if (box === scoreWrapper) {
      scoreWrapper.classList.add("active");
    } else box.classList.remove("active");
  });
}
