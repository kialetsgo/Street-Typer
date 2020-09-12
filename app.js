'use strict'

const words = [
    [ 
        "next",
        "short",
        "nice",
        "bottle",
        "full",
        "soda",
        "vast",
        "glue",
        "close",
        "hurry",
        "robin",
        "trace",
        "rock",
        "absent",
        "cover",
        "note",
        "burst",
        "relax",
        "group",
        "sad",
        "rob",
        "yell",
        "pop",
        "mix",
        "fix",
        "hot",
        "pin",
        "hill",
        "wiry",
        "dirt",
    ],
    [
        "paddle",
        "answer",
        "awesome",
        "distance",
        "fertile",
        "wakeful",
        "belief",
        "slippery",
        "bizarre",
        "learned",
        "vivacious",
        "grandmother",
        "illegal",
        "thirsty",
        "wholesale",
        "tenuous",
        "skillful",
        "deteriorate",
        "poised",
        "humorous",
        "scrape",
        "replace",
        "languid",
        "adjoining",
        "interesting",
        "stranger",
        "polite",
        "scissors",
        "brainy",
        "interrogation",  
    ]
]

let wordCount = 0
let level = 0
let score = 0
let highScore = 0
let inputEl = document.querySelector('#word-input')
let scoreEl = document.querySelector('.current-score')
let highScoreEl = document.querySelector('.high-score')
let wordDisplay = document.querySelector('.word-list')
let easyButton = document.querySelector('#easy')
let hardButton = document.querySelector('#hard')

function setCurrentScore() {
    score += 1;
    scoreEl.innerHTML = score
}

function displayWordList(difficulty) {
    for (let i = 0; i < words[difficulty].length; i++) {
         let li = document.createElement("li")
         li.classList.add('word')
         li.append(words[difficulty][i])
         wordDisplay.append(li)
     }
 }

 function displayCurrentWord(count) {
     let currentWordEl = document.querySelector('.current-word')
     if (wordCount < words[level].length) {
         currentWordEl.innerHTML = words[level][count]
     }
     else {
         currentWordEl.innerHTML = ""
     }
 }

function setHighScore() {
    if (score > highScore) {
         highScore = score;
         highScoreEl.innerHTML = highScore
        //  localStorage.setItem('highScore', highScore)
    }
    score = 0;
    scoreEl.innerHTML = score
}

function gameOver() {

}

function startGame() {

}

window.onload = function() {
    $("#static-modal").modal('show')

    // let retrievedScores = localStorage.getItem('highscore')
    // console.log(retrievedScores)
    easyButton.addEventListener('click', function() {
        let liEl = document.querySelectorAll('.word')
        if (liEl.length == 0) {
            level = 0
            displayWordList(level)
            displayCurrentWord(wordCount)
            $("#static-modal").modal('hide');
        } 
    })

    hardButton.addEventListener('click', function() {
        let liEl = document.querySelectorAll('.word')
        if (liEl.length == 0) {
            level = 1;
            displayWordList(level)
            displayCurrentWord(wordCount)
            $("#static-modal").modal('hide');
        }  
    })

    //onchange for "enter" key
    inputEl.oninput = function() {
        
        let liEl = document.querySelectorAll('.word')
            if (wordCount !== words[level].length) {
                if (inputEl.value === words[level][wordCount]) { 
                    liEl[wordCount].style.color = 'green'
                    setTimeout(() => {
                        liEl[wordCount].innerHTML = ""
                        wordCount += 1;
                        displayCurrentWord(wordCount)
                        inputEl.value = ""
                        setCurrentScore()
                    }, 200);
                }
                else if(inputEl.value.length === words[level][wordCount].length && inputEl.value !== words[level][wordCount]) {
                    inputEl.value = ""
                }
                else {
                    liEl[wordCount].style.color = 'red'
                    // inputEl.value = ""
                }
            }
            else {
                alert("Game Over")
                // $("#static-modal").modal('show');

                // clear input field
                inputEl.value = ""

                // clear word display
                let liEl = document.querySelectorAll('.word')
                for(let i = 0; i < liEl.length; i++) {
                    liEl[i].innerHTML = ""
                }
                setHighScore()
            }
    }
};