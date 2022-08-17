const playground = document.getElementById('game');
const expression = document.getElementById('expression');
const startBtn = document.getElementById('startBtn');
const userAnswer = document.getElementById('answer');
const buttonCheck = document.getElementById('check');
const countdown = document.getElementById('countdown');
const levelInfo = document.getElementById('levelInfo');
const saveProgress = document.getElementById('saveProgress');
const keyboard = document.querySelectorAll('.key');
let link = saveProgress.outerHTML;
const speech = document.getElementById('speech');
import {strategies} from "./strategy.js";


const operations = ['+', '-', '*', '/'];
let level = 1;
let x, y, result;
let expr = ''; 
let action = '';
let resultLength = 0;
//number of right answers
let count = 0;
//number of rounds in each game
let rounds = 0;
let roundsNum;
let clickEvent = false;
let timer;
let countdownCounter;
let countdownStep;
let startGame = false;
let continueGame = true;
let isPaused = false;
//timer
let limit = 0;
let highScore = 0;

function init() {
    clear();
    userAnswer.focus();
    [x, y, action] = generateTwoNumbers(strategies[level-1]);
    timer = strategies[level-1].time;
    roundsNum = strategies[level-1].roundsNum;
    countdownCounter = timer / 1000;
    countdownStep = 100 / countdownCounter; 
    expr = `<span class="number">${x}</span> <span class="action">${action}</span> <span class="number">${y}</span>`;
    expression.innerHTML = expr;
    console.log(x, action, y);
    rounds += 1;
    result = calc(x, y, action);
    resultLength = result.toString().length;
    return result;
}

function calc(x, y, operation) {
    switch (operation) {
        case '+' :
            return x + y;
            break;
        case '-' :
            return x - y;
            break;
        case '*' :
            return x * y;
            break;
        case '/' :
            return x / y;
            break;    
    }
}

//generate two random numbers depending on their volume
function generateTwoNumbers({vol1, vol2, action}) {
    let a = (vol1 == 1) ? 9 : 90;
    let b = (vol2 == 1) ? 9 : 90;
    let c = action;
    let x = createNumber(a);
    let y = createNumber(b);
    let z = createAction(c);
    return (y > x && z == '-') ? [y, x, z] : [x, y, z];
}

//create random number depending on level
function createNumber(a) {
    let plus;
    plus = (a / 10 > 1) ? 10 : 1;
    return Math.round(Math.random() * a + plus);
}

//plus, minus, divide, multiple
function createAction(operation) {
    return operations[operation];
}

function backLight(bool) {
    userAnswer.style.border = (bool) ?  '1px solid #53ff6a' : '1px solid crimson';
}

//check if user's answer is correct
function checkAnswer(userAnswerInput, rightAnswer) {
    buttonCheck.disabled = true;
    userAnswer.disabled = true;
    if(Number(userAnswerInput) === Number(rightAnswer)){
        count += 1;
        backLight(true);
        //clear(true);
        return true;
    } else {
        backLight(false);
        //clear(false);
        continueGame = false;
        //ending the old session to a start a new one
        recognition.addEventListener("end", () => {
            recognition.start();
        });
        gameOver();
        return false;
    }
}

//init game
function createExpression() {
    return createNumber() + ' ' + createAction('+') + ' ' + createNumber();
}

function clear() {
    x = y = result = 0;
    expr = action = '';
    userAnswer.value = '';
    expression.innerHTML = '';
    buttonCheck.removeEventListener('click', this);
    buttonCheck.disabled = false;
    userAnswer.disabled = false;
    continueGame = true;
};

// userAnswer.addEventListener('input', () => {
//     if(userAnswer.value.length == resultLength) {
//         if(checkAnswer(userAnswer.value, result)) {
//             //newround();
//             highScore += timer - limit;
//             expression.innerHTML = (pass) ? 'Правильно!' : 'Помилка!';
//             console.log('keyboard check: ', userAnswer.value, result, 'rounds: ', rounds, 'right: ', count, 'highScore: ', highScore);
//         }
//     }
// })

keyboard.forEach( key => {
    key.addEventListener('click', () => {
        userAnswer.value += key.innerText;
        console.log(userAnswer.value.length, resultLength, userAnswer.value.length == resultLength);
        if(userAnswer.value.length == resultLength) {
            if(checkAnswer(userAnswer.value, result)) {
                //newround();
                highScore += timer - limit;
                expression.innerHTML = 'Правильно!';
                console.log('keyboard check: ', userAnswer.value, result, 'rounds: ', rounds, 'right: ', count, 'highScore: ', highScore);
            } else {
                gameOver();
            }
        }
    });   
});

saveProgress.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(e, level);
        localStorage.setItem('levelMax', level);
        localStorage.setItem('highScore', highScore);
        e.target.innerText='saved';
})

buttonCheck.addEventListener('click', (e) => {
    //console.log(e.type === 'click');
    let pass = checkAnswer(userAnswer.value, result);
    if(pass) highScore += timer - limit;
    if(pass){
        expression.innerHTML = 'Правильно!';
    } else {
        gameOver();
    }
        console.log('button clicked: ', userAnswer.value, result, 'rounds: ', rounds, 'right: ', count, 'highScore: ', highScore);
})

userAnswer.addEventListener("keypress", (e) => {
    // If the user presses the "Enter" key on the keyboard
    if (e.key === "Enter") {
      // Cancel the default action, if needed
      e.preventDefault();
      // Trigger the button element with a click
      buttonCheck.click();
    }
  });

userAnswer.addEventListener('keyup', () => {
    if(userAnswer.value.length == resultLength) {
        if(checkAnswer(userAnswer.value, result)) {
            //newround();
            highScore += timer - limit;
            expression.innerHTML = 'Правильно!';
            console.log('keyup event: ', userAnswer.value, result, 'rounds: ', rounds, 'right: ', count, 'highScore: ', highScore);
        } else {
            gameOver();
        }
    }
})

function gameOver() {
    clearInterval(gogo);
    expression.innerHTML = `Game over!`;
    buttonCheck.disabled = true;
    userAnswer.disabled = true;
    startBtn.value = 'Start again';
    startBtn.onclick = () => { window.location.reload(); };
    startBtn.disabled = false;
    return;
}

function nextLevel() {
    expression.innerHTML = 'Перемога!';
    startBtn.disabled = false;
    startBtn.value = 'Next Level ' + level;
    startBtn.onclick = () => { newround(level) };
    userAnswer.disabled = true;
    startBtn.disabled = false;
    isPaused = true;
    return;  
}

function createAnimation(step) {
    step = step / 1000;
    let stepsMax = 1000 / timer * 100;
    let width = 100 - step * stepsMax;
    
    if(width > 60) {
        countdown.style.backgroundColor = '#21c700';
        document.getElementById('game').style = "outline: 3px solid #21c700;";
    } else if (width > 30 && width <=60) {
        countdown.style.backgroundColor = '#e0ff32';
        document.getElementById('game').style = "outline: 3px solid #e0ff32;";
    } else {
        countdown.style.backgroundColor = 'crimson';
        document.getElementById('game').style = "outline: 3px solid crimson;";
    }
    countdown.style.width = width + '%';
}

// refactoring

function newround() {
    if(!startGame) return;
    console.log('level: ', level, limit, timer, 'right answers: ', count, 'current round: ', rounds, 'total rounds: ', roundsNum);
    isPaused = false;
    startBtn.disabled = true;
    if(count !== rounds && limit == timer) {
        gameOver();
    }
    result = (limit == 0) ? init() : result;

    levelInfo.innerHTML = `level: ${level} | ${count}/${roundsNum} | Hige Score: ${highScore}`;
    if(count == rounds) {
        limit = 0;

        if(rounds == roundsNum) {
            level += 1;
            count = rounds = 0;
            return nextLevel();
            
        }
        newround(level);
    }
    createAnimation(limit);
    limit += 1000;
}

let gogo = setInterval(()=> {
    if(!isPaused) {
        newround(level);
    }
}, 1000);

startBtn.value = 'Start Level ' + level;
startBtn.addEventListener('click', () => {
    startGame = true;
    recognition.start();
    newround(level);
})

// startBtn.onclick = () => { 
//     startGame = true;
//     recognition.start();
//     newround(level);
// };


// SPEECH RECOGNITION


const button1 = document.querySelector("#btn1");
const button2 = document.querySelector("#btn2");

//set up the speech reconition webkit
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'uk';

//create an eventlistener for our recognition
recognition.addEventListener("result", (e) => {
    console.log(e.results);
  //mapping through the speech list to join to words together
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  //to then show the content in our chat section

  if (e.results[0].isFinal) {

    if(text.length < 4){
        userAnswer.value = text;
    } else {
        speech.innerText = text;
    }
    if(text.includes("два")) {
        userAnswer.value = 2;
    }
    if(text.includes("три")) {
        userAnswer.value = 3;
    }
    if(text.includes("честь")) {
        userAnswer.value = 6;
    }
    if(text.includes("steam") || text.includes("Steam")) {
        userAnswer.value = 7;
    }
    let pass = checkAnswer(userAnswer.value, result);
    if(pass) highScore += timer - limit;
    expression.innerHTML = (pass) ? 'Правильно!' : 'Помилка!';
    console.log('speech recognition: ', userAnswer.value, result, 'rounds: ', rounds, 'right: ', count, 'highScore: ', highScore);

    let playAgain = ["заново", "спочатку", "наново", "поїхали", "давай"]
    if (playAgain.includes(text)) {
        window.location.reload();        
    }
    if (text.includes("наступний рівень")) {
        newround(level);  
        userAnswer.value = '';      
    }
  }

});



//ending the old session to a start a new one
// recognition.addEventListener("end", () => {
//     recognition.start();
// });
  
// document.addEventListener("DOMContentLoaded", () => {
//     recognition.start();
// });

button1.addEventListener("click", () => {
    recognition.start();
});
  
button2.addEventListener("click", () => {
    recognition.abort();
});
  