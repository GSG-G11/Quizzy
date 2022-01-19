const form = document.forms[0];
const questionsLimit = document.querySelector("#limit");
const questionsLimitNum = document.querySelector(".questions-limit");
let username,
  category,
  questionsNum = 10;

form.onsubmit = (e) => {
  e.preventDefault();
  username = document.querySelector("#username").value;
  category = document.querySelector("#category").value;
  localStorage.username = username;
  localStorage.category = category;
  localStorage.questionsNum = questionsNum;
  // TODO: Change path when deploying to GitHub Pages
  location.href = "../html/home.html";
};

questionsLimit.oninput = (e) => {
  questionsNum = e.target.value;
  questionsLimitNum.textContent = `${questionsNum} Questions`;
};
