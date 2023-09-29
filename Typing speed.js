let second = 60, wpm = 0, record = 0, accuracy = 100;
let timer;
let start = false;

//The game starts when the first character was written in the user text box.
function startGame() {
    if (!start) {
        timer = setInterval(runTime, 1000);
        start = true;
    }
}

//The timer count down from 60 to 0. If the minute elapsed, the game ends.
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

//The game is restarted
function restart () {
    window.location.reload();
}

/*The game ends and the pop-up occurs displaying the statistics of the game
 finished and the button to start a new game*/
function endGame() {
    clearInterval(timer);
    if (wpm > record) {
        record = wpm;
    }
    document.getElementsByClassName("wpm")[0].innerText = "WPM: " + wpm;
    document.getElementsByClassName("record")[0].innerText = "RECORD: " + record + " WPM";
    document.getElementsByClassName("accuracy")[0].innerText = "ACCURACY: " + accuracy + "%";
    document.getElementsByClassName("pop-up")[0].style.visibility = "visible";
}

document.getElementsByClassName("newText")[0].addEventListener("keydown", startGame);
