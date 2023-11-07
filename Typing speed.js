let modelText = document.querySelector(".modelText");
let userText = document.querySelector(".userText");
let textArray = new Array(1214), wordDelimiter = [-1];
let second = 60, wordsCnt = 0, correctWords = 0, ind = 0, prevInd = 0;
let timer, text;
let start = false;

addText();

//The model text is formatted as an array of span elements and displayed in the upper box //
function addText() {
    text = "I live in a house near the mountains. I have two brothers and one sister, and I was born last. My father teaches history, and my mother is a nurse at a big hospital. " + 
    "My brothers are very smart and work hard in school. My sister is a nervous girl, but she is very kind. My grandmother also lives with us. She came from Italy when I was two years old. " +
    "She has grown old, but she is still very strong. She cooks the best food! My family is very important to me. We do lots of things together. My brothers and I like to go on long walks in the mountains. " +
    "My sister likes to cook with my grandmother. On the weekends we all play board games together. We laugh and always have a good time. I love my family very much. " +
    "My favorite beach is called Emerson Beach. It is very long, with soft sand and palm trees. It is very beautiful. I like to make sandcastles and watch the sailboats go by. " +
    "Sometimes there are dolphins and whales in the water! Every morning we look for shells in the sand. I found fifteen big shells last year. I put them in a special place in my room. " +
    "This year I want to learn to surf. It is hard to surf, but so much fun! My sister is a good surfer. She says that she can teach me. I hope I can do it!"
    for (let i = 0; i < textArray.length; ++i) {
        textArray[i] = document.createElement("span");
        textArray[i].innerText = text[i];
        modelText.appendChild(textArray[i]);
        if (/\s/.test(text[i])) {
            wordDelimiter.push(i);
        }
    }
    wordDelimiter.push(textArray.length);
}

//The game starts when the first character was written in the user text box.
function startGame() {
    if (!start) {
        timer = setInterval(runTime, 1000);
        start = true;
    }
}

//The timer counts down from 60 to 0. If the minute elapsed, the game ends.
function runTime() {
    --second;
    let prefSec = '';
    if (second < 10) {
        prefSec = '0';
    }
    document.querySelector(".time").innerText = "00:" + prefSec + second;
    if (second === 0) {
        endGame();
    }
}

/*This function checks the correctness of the text wrote by the user by comparing each new written character with 
the character located on the same index in the model text. If they are the same, the character from the model text 
becomes green. If not, it becomes red. If a character is erased from the written text, the already coloured
character from the model text located on the right side of the current cursor position becomes black*/
function checkLetter() {
    ind = userText.innerText.length - 1;
    if (prevInd > ind && ind <= text.length - 1) {
        textArray[prevInd].classList.remove("wrong");
        textArray[prevInd].classList.remove("correct"); 
    }
    if (ind >= 0 && ind <= text.length - 1 && userText.innerText[ind] != textArray[ind].innerText) {
        textArray[ind].classList.remove("correct"); 
        textArray[ind].classList.add("wrong"); 
    } else if (ind >= 0 && ind <= text.length - 1 && userText.innerText[ind] == textArray[ind].innerText) {
        textArray[ind].classList.add("correct"); 
    }
    prevInd = ind;
}

/*This function compares each new written word with the correspondent word from the model text. 
If the written word is correct, it will receive a green background. If it's wrong, it will receive a red background.
If the user erases characters from a word, the background of that word disappears. The function also
counts the written words and the correct words*/
function checkWord() {
    let colour = " ", isCorrect = true;
    if (wordDelimiter[wordsCnt + 1] === ind + 1) {
        ++wordsCnt;
        if (userText.innerText.substring(wordDelimiter[wordsCnt - 1], wordDelimiter[wordsCnt]) == text.substring(wordDelimiter[wordsCnt - 1], wordDelimiter[wordsCnt])) {
            colour = "#d6f0b6";
            ++correctWords;
        } else {
            colour = "#fac8c8";
            isCorrect = false;
            if (correctWords === wordsCnt) {
                --correctWords;
            }
        }
        colourWord(colour);
    } else if (wordDelimiter[wordsCnt] > ind + 1) {
        colour = "#00000000";
        colourWord(colour);
        --wordsCnt;
        if (!isCorrect) {
            --correctWords;
        }
    }
}

/*Each new written word from the model text receives a background. 
If characters from that word are erased in the user text box, the background disappears*/
function colourWord(colour) {
    for (let i = wordDelimiter[wordsCnt - 1] + 1; i <= wordDelimiter[wordsCnt] - 1; ++i) {
        textArray[i].style.background = colour;
    }
}

//The game is restarted
function restart () {
    window.location.reload();
}

/*The game ends and the pop-up occurs displaying the statistics of the game
 finished and the button to start a new game*/
function endGame() {
    clearInterval(timer);
    document.getElementsByClassName("wpm")[0].innerText = "WPM: " + wordsCnt;
    document.getElementsByClassName("accuracy")[0].innerText = "ACCURACY: " +  parseInt(correctWords / wordsCnt * 100) + "%";
    document.getElementsByClassName("pop-up")[0].style.visibility = "visible";
}

userText.addEventListener("contextmenu", event => event.preventDefault());
userText.addEventListener("keydown", startGame);
userText.addEventListener("input", checkLetter);
userText.addEventListener("input", checkWord);
