'use strict';

// ###### GAME LOGIC ###### //

// CURRENT FEATURES
// time-based typing game
// words are randomized every time game is restarted
// word display list will only show maximum 5 words
// word display list will "scroll" everytime a word is typed
// End game condition: given 30 seconds, finish typing all words given or when time = 0
// points given according to word length
// inputfield will auto clear if inputfield value length =  word length + 1
// minus 1 point for every wrong input
// game over screen with restart button after the game is over
// local storage for high score

// DOING
// beautify
// include sound effects

// normal:
// first 10: 4 letter words
// next 5: 6 letter word
// next 5: 8 letter word
// next 2: 10 letter word

// ########################## //

let originalWordArray = [
  [
    'firm',
    'tape',
    'hero',
    'yell',
    'fire',
    'your',
    'wish',
    'word',
    'zero',
    'rank',
    'notice',
    'borrow',
    'master',
    'honest',
    'danger',
    'dialogue',
    'division',
    'response',
    'broccoli',
    'mourning',
    'negligence',
    'deficiency',
  ],
  [
    'embox',
    'close',
    'theft',
    'glory',
    'coast',
    'trunk',
    'truth',
    'pitch',
    'treat',
    'habit',
    'laser',
    'berry',
    'whole',
    'flock',
    'still',
    'notice',
    'borrow',
    'master',
    'honest',
    'danger',
    'triangle',
    'disagree',
    'flourish',
    'magazine',
    'negative',
    'proposal',
    'marathon',
    'abundant',
    'positive',
    'document',
  ],
];
// global variables
let words = []; // new array to store sorted words
let wordCount = 0; // initializing word count for each level
let level = 0; // level set to 0 as default (easy mode)
let score = 0;
let highScore = 0;
let countdown = 30000; // time given to play the game
let isPlaying = false; // game play

// dom
let inputEl = document.querySelector('#word-input');
let scoreEl = document.querySelector('.current-score');
let highScoreEl = document.querySelector('.high-score');
let wordDisplayEl = document.querySelector('.word-list');
let timerEl = document.querySelector('.seconds');
let currentWordEl = document.querySelector('.current-word');
let ryuIdle = document.querySelector('#ryu-idle');
let ryuHadoken = document.querySelector('#ryu-hadoken');
let boss = document.querySelector('#boss');

// modal
let modalGameStartEl = document.querySelector('.modal-gamestart');
let modalCoverEl = document.querySelector('.modal-cover');
let modalGameOverEl = document.querySelector('.modal-gameover');
let modalInstructionEl = document.querySelector('.modal-instructions');
let modalScoreEl = document.querySelector('#modal-score');
let modalHighScoreEl = document.querySelector('#modal-highscore');

// buttons
let easyButton = document.querySelector('#easy');
let hardButton = document.querySelector('#hard');
let restartButton = document.querySelector('#restart');

// functions
function shuffleWords() {
  let newWordArray1 = [];
  let newWordArray2 = [];

  while (originalWordArray[0].length !== 0) {
    let random1 = Math.floor(Math.random() * originalWordArray[0].length);
    newWordArray1.push(originalWordArray[0][random1]);
    originalWordArray[0].splice(random1, 1);
  }

  while (originalWordArray[1].length !== 0) {
    let random2 = Math.floor(Math.random() * originalWordArray[1].length);
    newWordArray2.push(originalWordArray[1][random2]);
    originalWordArray[1].splice(random2, 1);
  }
  newWordArray1.sort(function (a, b) {
    // ASC  -> a.length - b.length
    // DESC -> b.length - a.length
    return a.length - b.length;
  });
  // console.log(newWordArray1);
  newWordArray2.sort(function (a, b) {
    // ASC  -> a.length - b.length
    // DESC -> b.length - a.length
    return a.length - b.length;
  });
  // console.log(newWordArray2);
  words.push(newWordArray1, newWordArray2);
}

function addScore() {
  score += currentWordEl.innerHTML.length;
  scoreEl.innerHTML = score;
}

function deductScore() {
  if (score > 0) {
    score -= 1;
    scoreEl.innerHTML = score;
  }
}

function setHighScore() {
  if (score > highScore) {
    highScore = score;
    highScoreEl.innerHTML = highScore;
    modalHighScoreEl.innerHTML = 'High Score: ' + highScore;
    localStorage.setItem('highScore', JSON.stringify(highScore));
  }
  modalHighScoreEl.innerHTML = 'High Score: ' + highScore;
  // score = 0;
  // scoreEl.innerHTML = score;
}

function displayHighScore() {
  let retrievedScores = localStorage.getItem('highScore');
  // after page refresh, highScore is being set back to 0, need to
  highScore = retrievedScores;
  if (highScoreEl.innerHTML === '') {
    highScoreEl.innerHTML = retrievedScores;
  }
}

function displayWordList(wordCount) {
  for (let i = wordCount; i < wordCount + 5; i++) {
    let li = document.querySelectorAll('.word');
    li[i].classList.add('display');
    li[i].classList.remove('hide');
  }
}

function generateWordList(difficulty) {
  for (let i = 0; i < words[difficulty].length; i++) {
    let li = document.createElement('li');
    li.classList.add('word', 'hide');
    li.append(words[difficulty][i]);
    wordDisplayEl.append(li);
  }
}

function startTimer() {
  isPlaying = true;
  countdown = 29000;
  setInterval(() => {
    if (countdown != 0) {
      timerEl.innerHTML = countdown / 1000;
      countdown = countdown - 1000;
      return;
    }
    timerEl.innerHTML = countdown / 1000;
    gameOver();
  }, 1000);
}

function displayCurrentWord(count) {
  if (wordCount < words[level].length) {
    currentWordEl.innerHTML = words[level][count];
  } else {
    currentWordEl.innerHTML = 'GAME OVER';
    gameOver();
  }
}

function compareWords() {
  let liEl = document.querySelectorAll('.word');
  // only run for as long as the array length
  if (wordCount !== words[level].length) {
    if (inputEl.value === words[level][wordCount]) {
      liEl[wordCount].style.color = 'green';
      liEl[wordCount].innerHTML = '';
      wordCount += 1;
      hadokenOn();
      bossHit();
      // display next word
      displayCurrentWord(wordCount);
      // resetting input field
      inputEl.value = '';
      addScore();
      // update word list with next 5 words
      displayWordList(wordCount);
    } else if (
      inputEl.value.length === words[level][wordCount].length + 1 &&
      inputEl.value !== words[level][wordCount]
    ) {
      inputEl.value = '';
      deductScore();
    } else {
      liEl[wordCount].style.color = 'red';
    }
  } else {
    gameOver();
  }
}
function hadokenOn() {
  ryuIdle.style.display = 'none';
  ryuHadoken.style.display = 'inline-block';
  setTimeout(() => {
    ryuHadoken.style.display = 'none';
    ryuIdle.style.display = 'inline-block';
  }, 500);
}
function bossHit() {
  setTimeout(() => {
    boss.classList.add('boss-shake');
    setTimeout(() => {
      boss.classList.remove('boss-shake');
    }, 500);
  }, 500);
}
function gameOver() {
  countdown = 0;
  modalScoreEl.innerHTML = 'Your Final Score is ' + scoreEl.innerHTML;
  // clear input field
  inputEl.value = '';
  // clear word display
  let liEl = document.querySelectorAll('.word');
  for (let i = 0; i < liEl.length; i++) {
    liEl[i].innerHTML = '';
  }
  setHighScore();
  showGameOverModal();
}

function showInstructionModal() {
  modalCoverEl.style.display = 'block';
  modalInstructionEl.style.display = 'block';
}
function hideInstructionModal() {
  modalCoverEl.style.display = 'none';
  modalInstructionEl.style.display = 'none';
}
function showGameStartModal() {
  modalCoverEl.style.display = 'block';
  modalGameStartEl.style.display = 'block';
}
function hideGameStartModal() {
  modalCoverEl.style.display = 'none';
  modalGameStartEl.style.display = 'none';
}
function showGameOverModal() {
  modalCoverEl.style.display = 'block';
  modalGameOverEl.style.display = 'block';
}
function hideGameOverModal() {
  modalCoverEl.style.display = 'none';
  modalGameOverEl.style.display = 'none';
}

// actual deployment
window.onload = function () {
  hideGameOverModal();
  showGameStartModal();
  shuffleWords();
  displayHighScore();
  timerEl.innerHTML = countdown / 1000;

  // let retrievedScores = localStorage.getItem('highscore')
  // console.log(retrievedScores)

  modalGameStartEl.addEventListener('click', function () {
    hideGameStartModal();
    showInstructionModal();
  });

  easyButton.addEventListener('click', function () {
    let liEl = document.querySelectorAll('.word');
    if (liEl.length == 0) {
      level = 0;
      generateWordList(level);
      displayWordList(wordCount);
      displayCurrentWord(wordCount);
      hideInstructionModal();
    }
  });

  hardButton.addEventListener('click', function () {
    let liEl = document.querySelectorAll('.word');
    if (liEl.length == 0) {
      level = 1;
      generateWordList(level);
      displayWordList(wordCount);
      displayCurrentWord(wordCount);
      hideInstructionModal();
    }
  });

  restartButton.addEventListener('click', function () {
    location.reload();
    hideGameOverModal();
  });

  inputEl.oninput = function () {
    if (isPlaying != true) {
      startTimer();
    }
    compareWords();
  };
};
