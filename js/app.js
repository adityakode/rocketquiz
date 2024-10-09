let currentQuestionIndex = 0;
let selectedOption = null;
let questions = [];

// Fetch questions from JSON file
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    displayQuestion();
  });

// Display current question
function displayQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question-image').src = `images/${question.image}`;
  document.getElementById('question-text').innerText = question.questionText;

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  question.answerOptions.forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.classList.add('py-2', 'px-4', 'border', 'border-gray-300', 'rounded-lg', 'hover:bg-blue-200', 'transition-colors');
    optionBtn.innerText = option.answerText;
    optionBtn.dataset.index = index;

    optionBtn.addEventListener('click', () => {
      selectedOption = index;
      updateOptionStyles();
    });

    optionsContainer.appendChild(optionBtn);
  });

  updateOptionStyles();
  updateNavigationButtons();
}

// Update option button styles
function updateOptionStyles() {
  const buttons = document.querySelectorAll('#options-container button');
  buttons.forEach((btn, index) => {
    btn.classList.remove('bg-blue-300', 'text-white');
    if (selectedOption === index) {
      btn.classList.add('bg-blue-300', 'text-white');
    }
  });
}

// Handle submit button click
document.getElementById('submit-btn').addEventListener('click', () => {
  const question = questions[currentQuestionIndex];
  const correctOptionIndex = question.answerOptions.findIndex(option => option.isCorrect);

  const buttons = document.querySelectorAll('#options-container button');
  buttons.forEach((btn, index) => {
    btn.classList.remove('bg-blue-300');
    if (index === correctOptionIndex) {
      btn.classList.add('bg-green-300', 'text-white');
    } else if (index === selectedOption) {
      btn.classList.add('bg-red-300', 'text-white');
    }
  });
});

// Handle next and previous buttons
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    selectedOption = null;
    displayQuestion();
  }
});

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    selectedOption = null;
    displayQuestion();
  }
});

// Update navigation buttons state
function updateNavigationButtons() {
  document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
  document.getElementById('next-btn').disabled = currentQuestionIndex === questions.length - 1;
}
