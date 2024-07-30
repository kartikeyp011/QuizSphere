const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

// Function to get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get topic from query parameter
const topic = getQueryParam('topic');

// Function to map topic names to category IDs
function getCategoryId(topic) {
    const categories = {
        general_knowledge: 'General Knowledge',
        science: 'Science',
        math: 'Mathematics',
        computers: 'Computers',
        sports: 'Sports',
        animals: 'Animals'
    };
    return categories[topic] || 'General Knowledge'; // Default to general knowledge if topic not found
}

// load question from API
async function loadQuestion() {
    const APIUrl = `https://the-trivia-api.com/api/questions?categories=${encodeURIComponent(getCategoryId(topic))}&limit=1`;
    try {
        const result = await fetch(`${APIUrl}`);
        if (!result.ok) {
            throw new Error('Failed to fetch question');
        }
        const data = await result.json();
        if (!data || data.length === 0) {
            throw new Error('No questions found');
        }
        _result.innerHTML = "";
        showQuestion(data[0]);
    } catch (error) {
        console.error(error);
        _result.innerHTML = `<p>Error loading question. Please try again later.</p>`;
    }
}

// event listeners
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});

// display question and options
function showQuestion(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.correctAnswer; // Adjust to correct field
    const incorrectAnswers = data.incorrectAnswers; // Adjust to correct field
    const optionsList = [...incorrectAnswers];
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer);

    _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    _options.innerHTML = optionsList.map((option, index) => `
        <li> ${index + 1}. <span>${option}</span> </li>
    `).join('');

    selectOption();
}

// options selection
function selectOption() {
    _options.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', function() {
            const activeOption = _options.querySelector('.selected');
            if (activeOption) {
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// answer checking
function checkAnswer() {
    _checkBtn.disabled = true;
    const selectedOption = _options.querySelector('.selected');
    if (selectedOption) {
        const selectedAnswer = selectedOption.querySelector('span').textContent;
        if (selectedAnswer === HTMLDecode(correctAnswer)) {
            correctScore++;
            _result.innerHTML = `<p><i class="fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class="fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class="fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        setTimeout(function(){
            console.log("");
        }, 5000);

        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}
