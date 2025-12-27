const PLAYER_X = "X";
const PLAYER_O = "O";

const WINNING_COMBINATIONS = [
    { combo: [0, 1, 2], style: { width: "100%", height: "6px", top: "15%", left: "0", transform: "none" } },
    { combo: [3, 4, 5], style: { width: "100%", height: "6px", top: "50%", left: "0", transform: "none" } },
    { combo: [6, 7, 8], style: { width: "100%", height: "6px", top: "85%", left: "0", transform: "none" } },
    { combo: [0, 3, 6], style: { width: "6px", height: "100%", top: "0", left: "15%", transform: "none" } },
    { combo: [1, 4, 7], style: { width: "6px", height: "100%", top: "0", left: "50%", transform: "none" } },
    { combo: [2, 5, 8], style: { width: "6px", height: "100%", top: "0", left: "85%", transform: "none" } },
    { combo: [0, 4, 8], style: { width: "135%", height: "6px", top: "50%", left: "-18%", transform: "rotate(45deg)" } },
    { combo: [2, 4, 6], style: { width: "135%", height: "6px", top: "50%", left: "-18%", transform: "rotate(-45deg)" } }
];

let currentPlayer = PLAYER_X;
let boardState = Array(9).fill("");
let isGameActive = true;

const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('player');
const winningLine = document.getElementById('winning-line');
const modal = document.getElementById('result-modal');

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (boardState[index] !== "" || !isGameActive) return;

    boardState[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer === PLAYER_X ? 'x-player' : 'o-player', 'taken');

    checkWinner();
}

function checkWinner() {
    let win = null;

    for (let config of WINNING_COMBINATIONS) {
        const [a, b, c] = config.combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            win = config;
            break;
        }
    }

    if (win) {
        isGameActive = false;
        drawWinLine(win.style);
        launchConfetti();
        openModal(`¡Gana ${currentPlayer}!`, `Felicidades Jugador ${currentPlayer}.`);
        return;
    }

    if (!boardState.includes("")) {
        isGameActive = false;
        openModal("¡Empate!", "Nadie ha ganado esta vez.");
        return;
    }

    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    statusText.innerText = currentPlayer;
}

function drawWinLine(style) {
    winningLine.style.display = "block";
    Object.assign(winningLine.style, style);
}

function launchConfetti() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

function openModal(title, msg) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = msg;
    setTimeout(() => { modal.style.display = "flex"; }, 600);
}

function resetGame() {
    boardState.fill("");
    isGameActive = true;
    currentPlayer = PLAYER_X;
    statusText.innerText = PLAYER_X;
    winningLine.style.display = "none";
    modal.style.display = "none";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.className = "cell";
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('reset').addEventListener('click', resetGame);
document.getElementById('modal-close').addEventListener('click', resetGame);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('PWA lista para funcionar offline'))
            .catch(err => console.log('Error al registrar PWA', err));
    });
}