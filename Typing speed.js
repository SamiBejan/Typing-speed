let modelText = document.querySelector(".modelText");
let userText = document.querySelector(".userText");
let textArray = new Array(1214), wordLimit = [-1], newWordLimit = [-1];
let second = 60, wordsCnt = 0, correctWords = 0, deletedChar = '', modelOffset = 0;
let timer, text;
let start = false, doubleSpace = false;

addText();

//The model text is formatted as an array of span elements and displayed in the upper box. 
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
            wordLimit.push(i);
        }
    }
    wordLimit.push(textArray.length);
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
    if (second === 50) {
        endGame();
    }
}

/*The previously deleted character is returned. It is relevant to know
if the previously deleted character was a white space or not. */
function getDeletedChar() {
    deletedChar = userText.value[userText.value.length - 1];
}

/*With each new white space added, we mark the end of the current written word.
If a white space is deleted, it is also deleted from the array.*/
function setNewWordLimits(e) {
    let ind = userText.value.length - 1;
    if (e.inputType === "insertText" && /\s/.test(userText.value[ind])) {
        newWordLimit.push(ind);
    } else if (e.inputType === "deleteContentBackward" && /\s/.test(deletedChar)) {
        newWordLimit.pop();
    }
}

/*With each character written after a white space, the number of written words is incremented.*/
function incrementWords(e) {
    let input = userText.value, ind = userText.value.length - 1;
    if (e.inputType === "insertText" && !/\s/.test(input[ind]) && (ind === 0 || /\s/.test(input[ind - 1]))) {
        ++wordsCnt;
    } 
}

//The function prevents the user to introduce two consecutive double white spaces.
function preventDoubleSpace(e) {
    let input = userText.value, ind = userText.value.length - 1;
    if (e.inputType === "insertText" && /\s/.test(input[ind]) && (ind === 0 || /\s/.test(input[ind - 1]))) {
        --ind;
        userText.value = userText.value.slice(0, -1);
        doubleSpace = true;
    }
    doubleSpace = false;
}

/*If the user introduces a white space, the index is automatically moved just before the new word.This also means adding 
additional white space at the end of the user text so that its index gets before the new word. Also if the user deletes a
white space and there is an additional white space gap until the next character, the entire gap is deleted.*/
function jumpIndex(e) {
    let ind = userText.value.length - 1, lg = ind - newWordLimit[wordsCnt - 1], modelInd = wordLimit[wordsCnt - 1] + lg;
    if (e.inputType === "insertText" && /\s/.test(userText.value[ind]) && (modelInd < wordLimit[wordsCnt] || ind < wordLimit[wordsCnt])) {
        while (modelInd < wordLimit[wordsCnt]) {
            ++modelInd;
            ++modelOffset;
        }
        if (ind < wordLimit[wordsCnt]) {
            while (ind < wordLimit[wordsCnt]) {
                userText.value += " ";
                ++ind;
            }
            newWordLimit[wordsCnt] = ind;
        }
    } else if (e.inputType === "deleteContentBackward" && /\s/.test(deletedChar) && /\s/.test(userText.value[ind])) {
        while (/\s/.test(userText.value[ind])) {
            userText.value = userText.value.slice(0, -1);
            --ind;
        } 
    }
}

/*This function checks the correctness of the text written by the user by comparing each new written character with the character 
located on the same position of the correspondent model word. If these two are the same, the character from the model text becomes green. 
If not, it becomes red. If a written word becomes longer than the correspondent model word, no character is coloured. If a character is erased 
from the written text, the already coloured character from the model text located on the right side of the current cursor position loses its colour.*/
function checkLetter(e) {
    let input = userText.value, ind = userText.value.length - 1, lg = ind - newWordLimit[wordsCnt - 1];
    let modelLg = wordLimit[wordsCnt] - (wordLimit[wordsCnt - 1] + 1), modelInd = wordLimit[wordsCnt - 1] + lg + modelOffset;
    if (e.inputType === "insertText" && lg <= modelLg && !/\s/.test(textArray[modelInd].innerText) && input[ind] != textArray[modelInd].innerText) {
        textArray[modelInd].classList.remove("correct"); 
        textArray[modelInd].classList.add("wrong");
    } else if (e.inputType === "insertText" && lg <= modelLg && !/\s/.test(textArray[modelInd].innerText)) {
        textArray[modelInd].classList.add("correct");    
    } else if (e.inputType === "deleteContentBackward" && lg <= modelLg) {
        textArray[modelInd + 1].classList.remove("wrong");
        textArray[modelInd + 1].classList.remove("correct"); 
    }
    modelOffset = 0;
}

/*This function compares each new written word with the correspondent model word. If the written word is correct, it will receive a green background. 
If it's wrong, it will receive a red background. If the user deletes the white space after a word, the background of that word disappears. 
The function also counts the number of correct words.*/
function checkWord(e) {
    let colour = " ", input = userText.value, ind = userText.value.length - 1;
    let lg = ind - newWordLimit[wordsCnt - 1], modelInd = wordLimit[wordsCnt - 1] + lg;
    if (e.inputType === "insertText" && /\s/.test(input[ind]) && !doubleSpace &&
    input.substring(newWordLimit[wordsCnt - 1] + 1, ind) === text.substring(wordLimit[wordsCnt - 1] + 1, wordLimit[wordsCnt])) {
        colour = "#d6f0b6";
        ++correctWords;
        colourWord(colour);
    } else if (e.inputType === "insertText" && /\s/.test(input[ind]) && !doubleSpace)  {
        colour = "#fac8c8";
        colourWord(colour);
    } else if (e.inputType === "deleteContentBackward" && modelInd === wordLimit[wordsCnt] - 1) {
        colour = "#00000000";
        colourWord(colour);
        if (input.substring(newWordLimit[wordsCnt - 1] + 1, ind + 1) === text.substring(wordLimit[wordsCnt - 1] + 1, wordLimit[wordsCnt])) {
            --correctWords;
        }
    } 
}

/*Each new written word from the model text receives a background. 
If characters from that word are erased from the user text, the background disappears.*/
function colourWord(colour) {
    for (let i = wordLimit[wordsCnt - 1] + 1; i <= wordLimit[wordsCnt] - 1; ++i) {
        textArray[i].style.background = colour;
    }
}

/*If the last character from a word is deleted, the number of written words decreases.*/ 
function decrementWords(e) {
    let input = userText.value, ind = userText.value.length - 1;
    if (e.inputType === "deleteContentBackward" && !/\s/.test(deletedChar) && (ind === -1 || /\s/.test(input[ind]))) {
        --wordsCnt;
    }
}

//The user is prevented to delete a text selection. Text deletion can only be made one character at a time.
function preventSelectionDeletion() {
    let sel = userText.value.substring(userText.selectionStart, userText.selectionEnd);
    if (sel != "") {
        userText.onkeydown = function () {return false};
    } else {
        userText.onkeydown = function () {return true};
    }
}

//The user cannot edit in the middle of the text when the mousedown event is active.
function preventEditWhenMouseDown() {
    userText.readOnly = true;
}

//The user can start edit again if the click is released.
function startEdit() {
    userText.readOnly = false;
}

//The user is prevented from typing or deletion text inside the written word. This can only be done at the end of the text.
function moveCursorAtEnd() {
    if (userText.selectionStart != userText.value.length) {
        userText.selectionStart = userText.value.length
    }
}

//The game is restarted.
function restart () {
    window.location.reload();
}

//The game ends and the pop-up occurs displaying the statistics of the game  finished and the button to start a new game.
function endGame() {
    clearInterval(timer);
    document.getElementsByClassName("wpm")[0].innerText = "WPM: " + wordsCnt;
    document.getElementsByClassName("correctWords")[0].innerText = "CORRECT WORDS: " + correctWords;
    if (wordsCnt === 0) {
        document.getElementsByClassName("accuracy")[0].innerText = "ACCURACY: 0%";
    } else {
        document.getElementsByClassName("accuracy")[0].innerText = "ACCURACY: " +  parseInt(correctWords / wordsCnt * 100) + "%";
    }
    document.getElementsByClassName("pop-up")[0].style.visibility = "visible";
    userText.removeEventListener("keydown", startGame);
    userText.disabled = true;
}
 
userText.addEventListener("contextmenu", event => event.preventDefault());
userText.addEventListener("copy", event => event.preventDefault());
userText.addEventListener("cut", event => event.preventDefault());
userText.addEventListener("paste", event => event.preventDefault());
userText.addEventListener("dragstart", event => event.preventDefault());
userText.addEventListener("keydown", startGame);
userText.addEventListener("keydown", getDeletedChar);
userText.addEventListener("input", setNewWordLimits);
userText.addEventListener("input", incrementWords);
userText.addEventListener("input", preventDoubleSpace);
userText.addEventListener("input", jumpIndex);
userText.addEventListener("input", checkLetter);
userText.addEventListener("input", checkWord);
userText.addEventListener("input", decrementWords);
userText.addEventListener("mousemove", preventSelectionDeletion);
userText.addEventListener("click", moveCursorAtEnd);
userText.addEventListener("mousedown", preventEditWhenMouseDown);
userText.addEventListener("mouseup", startEdit);
