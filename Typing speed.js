let second = 60;
let timer;
let start = false;

function startGame() {
    if (!start) {
        timer = setInterval(runTime, 1000);
        start = true;
    }
}

function runTime() {
    --second;
    document.querySelector(".time").innerText = "00:" + second;
}

function restart () {
    window.location.reload();
}

document.getElementsByClassName("newText")[0].addEventListener("keydown", startGame);