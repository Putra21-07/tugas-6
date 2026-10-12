// Data Soal (5 Soal)
const QUIZ_DATA = [
  {
    question: "Apa kepanjangan dari DOM dalam JavaScript?",
    options: ["Data Object Model", "Document Object Model", "Digital Ordinance Model", "Desktop Object Mode"],
    answerIndex: 1
  },
  {
    question: "Method mana yang digunakan untuk menyimpan data permanen di browser?",
    options: ["sessionStorage.setItem()", "cookie.write()", "localStorage.setItem()", "browser.store()"],
    answerIndex: 2
  },
  {
    question: "Keyword ES6 mana yang digunakan untuk variabel bersifat immutable / tidak dapat dideklarasikan ulang?",
    options: ["var", "let", "const", "static"],
    answerIndex: 2
  },
  {
    question: "Teknik memasangkan 1 event listener pada elemen parent untuk menangani event anak-anaknya disebut...",
    options: ["Event Bubbling", "Event Delegation", "Event Capturing", "Event Handling"],
    answerIndex: 1
  },
  {
    question: "Properti DOM mana yang paling aman digunakan untuk mencegah XSS saat memasukkan teks?",
    options: ["innerHTML", "outerHTML", "textContent", "document.write"],
    answerIndex: 2
  }
];

// State Aplikasi
let currentQuestionIndex = 0;
let currentScore = 0;
const STORAGE_KEY = "quiz_high_score";

// Elemen DOM
const highScoreDisplay = document.getElementById("high-score-display");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const progressText = document.getElementById("progress-text");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const scoreLiveText = document.getElementById("score-live-text");
const nextBtn = document.getElementById("next-btn");
const finalScoreText = document.getElementById("final-score-text");
const restartBtn = document.getElementById("restart-btn");

// Inisialisasi Aplikasi
const initApp = () => {
  loadHighScore();
  currentQuestionIndex = 0;
  currentScore = 0;
  scoreLiveText.textContent = `Skor: ${currentScore}`;
  resultSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  renderQuestion();
};

// Baca High Score dari LocalStorage
const loadHighScore = () => {
  const savedHighScore = localStorage.getItem(STORAGE_KEY) || 0;
  highScoreDisplay.textContent = savedHighScore;
};

// Simpan High Score ke LocalStorage
const updateHighScore = (score) => {
  const savedHighScore = Number(localStorage.getItem(STORAGE_KEY) || 0);
  if (score > savedHighScore) {
    localStorage.setItem(STORAGE_KEY, score);
    highScoreDisplay.textContent = score;
  }
};

// Render Soal & Opsi Jawaban (Aman XSS dengan textContent)
const renderQuestion = () => {
  nextBtn.classList.add("hidden");
  optionsContainer.textContent = ""; // Kosongkan container tanpa innerHTML

  const currentData = QUIZ_DATA[currentQuestionIndex];
  progressText.textContent = `Soal ${currentQuestionIndex + 1} dari ${QUIZ_DATA.length}`;
  questionText.textContent = currentData.question;

  currentData.options.forEach((optionText, index) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = optionText; // Safe XSS
    button.dataset.index = index;
    optionsContainer.appendChild(button);
  });
};

// Handler Opsi Jawaban (Event Delegation)
const handleOptionSelect = (e) => {
  const selectedBtn = e.target.closest(".option-btn");
  if (!selectedBtn || selectedBtn.disabled) return;

  const selectedIndex = parseInt(selectedBtn.dataset.index, 10);
  const correctIndex = QUIZ_DATA[currentQuestionIndex].answerIndex;
  const allButtons = optionsContainer.querySelectorAll(".option-btn");

  allButtons.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === correctIndex) {
    selectedBtn.classList.add("correct");
    currentScore += 20;
    scoreLiveText.textContent = `Skor: ${currentScore}`;
  } else {
    selectedBtn.classList.add("wrong");
    allButtons[correctIndex].classList.add("correct");
  }

  nextBtn.classList.remove("hidden");
};

// Handler Navigasi Soal
const handleNextQuestion = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < QUIZ_DATA.length) {
    renderQuestion();
  } else {
    showResults();
  }
};

// Tampilkan Layar Hasil
const showResults = () => {
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  finalScoreText.textContent = `Skor Akhir Kamu: ${currentScore} / 100`;
  updateHighScore(currentScore);
};

// Event Listeners
optionsContainer.addEventListener("click", handleOptionSelect);
nextBtn.addEventListener("click", handleNextQuestion);
restartBtn.addEventListener("click", initApp);

document.addEventListener("DOMContentLoaded", initApp);