const username = localStorage.username,
  category = localStorage.category,
  questionsNum = localStorage.questionsNum;

// Current Question Number
let questionNumber = 1;
let questionsArray = [];
let leaderBoard = localStorage.leaderboard
  ? JSON.parse(localStorage.leaderboard)
  : {
      20: [],
      18: [],
      16: [],
      14: [],
      12: [],
      10: [],
      8: [],
      6: [],
      4: [],
      2: [],
    };

const root = document.querySelector(".ques");
const nextBtn = document.querySelector(".next");
const leaderBoardBtn = document.querySelector(".board");

const apiURL = `https://api.trivia.willfry.co.uk/questions?limit=${questionsNum}&categories=`;

// Fetch data from Trivia API
async function fetchData() {
  const response = await fetch(`${apiURL}${category}`);
  const data = await response.json();
  createQuestionsArray(data);
}

function createQuestionsArray(data) {
  questionsArray = data.map((q) => {
    return {
      question: q.question,
      correctAnswer: q.correctAnswer,
      allAnswers: [
        ...[...q.incorrectAnswers.slice(0, 3), q.correctAnswer].sort(
          () => Math.random() - 0.5
        ),
      ],
    };
  });
  // Render the first question in the questionsArray
  renderQuestion(questionNumber - 1);
}

function renderQuestion(questionIdx) {
  // Disable the next Button
  nextBtn.classList.add("not-active");

  const mcq = questionsArray[questionIdx];
  const questionWrapper = document.createElement("div");
  const mcqNum = document.createElement("span");
  mcqNum.className = "question-number";
  mcqNum.textContent = `Question ${questionNumber}/${questionsNum}`;
  const question = document.createElement("p");
  question.className = "question";
  question.textContent = mcq.question;
  const answers = document.createElement("ol");
  answers.className = "answers";
  answers.setAttribute("type", "A");
  mcq.allAnswers.forEach((ans) => {
    const li = document.createElement("li");
    li.setAttribute("onclick", "checkTrue(this)");
    li.textContent = ans;
    answers.append(li);
  });
  questionWrapper.append(mcqNum, question, answers);
  root.append(questionWrapper);
}

// Fetch data from API and render the first question
fetchData();

let triesCount = 1;
let score = 0;

// Checks if the answer is true or not
function checkTrue(ans) {
  if (triesCount === 1) {
    const correctAnswer = questionsArray[questionNumber - 1].correctAnswer;
    const clickedAnswer = ans.textContent;
    if (correctAnswer === clickedAnswer) {
      ans.classList.add("correct");
      score++;
    } else {
      ans.classList.add("wrong");
      [...document.querySelectorAll("li")].forEach((li) => {
        if (li.textContent === correctAnswer) li.classList.add("correct");
      });
    }
    nextBtn.classList.remove("not-active");
  }
  triesCount++;
}

/* 
  if a player scores higher than the half of the questions,
  'Well Done' message will
  appear when finishing the game
  otherwise, 'Ops' message will appear.
*/
function scoreMessage() {
  nextBtn.classList.remove("not-active");
  nextBtn.textContent = "Try again";
  leaderBoardBtn.classList.add("active");
  const messageWrapper = document.createElement("section");
  messageWrapper.className = "score-message";
  let message;
  if (score > Math.trunc(questionsNum / 2)) message = "Well Done";
  else message = "Ops";
  messageWrapper.innerHTML = `<b>${message}</b>,
  <span class="player">${username}</span>
  Your score is <span class="score">${score}/${questionsNum}</span>`;
  root.append(messageWrapper);
  addToLeaderboard();
}

function addToLeaderboard() {
  let playerIdx = leaderBoard[questionsNum].findIndex(
    (player) => player.name === username
  );
  // if player plays for the first time
  if (playerIdx === -1) {
    leaderBoard[questionsNum].push({ name: username, score: score });
  } else {
    // if the previous score of this player is higher than the current score, don't edit the player score
    leaderBoard[questionsNum] = leaderBoard[questionsNum].map((p, idx) => {
      if (idx === playerIdx && score > p.score)
        return { name: p.name, score: score };
      else return p;
    });
  }
  localStorage.leaderboard = JSON.stringify(leaderBoard);
  leaderBoard = JSON.parse(localStorage.leaderboard);
}

// Move to the next question when click on the 'Next' button
// if it was the last question, it'll move to the player score
// and change the textContent of it to 'Try again'
nextBtn.addEventListener("click", function () {
  if (this.textContent === "Try again") location.reload();
  if (!this.classList.contains("not-active")) {
    triesCount = 1;
    questionNumber++;
    root.innerHTML = "";
    if (questionNumber <= questionsNum) renderQuestion(questionNumber - 1);
    else scoreMessage();
  }
});
