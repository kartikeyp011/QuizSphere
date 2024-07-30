const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

// Get domain from query parameters
const urlParams = new URLSearchParams(window.location.search);
const domain = urlParams.get('domain');

// Load questions based on domain
async function loadQuestion() {
    const APIUrl = `https://opentdb.com/api.php?amount=1&category=${domain}`;
    const result = await fetch(APIUrl);
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}

// Event listeners
function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function() {
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});

// Display question and options
function showQuestion(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li>${index + 1}. <
