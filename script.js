const cells = document.querySelectorAll(".cell");
const playerDisplay = document.getElementById("player");
const computerDisplay = document.getElementById("computer");
const statusText = document.getElementById("statusText");
const restartButton = document.getElementById("restartButton");

const chars = ["X", "O"];
const player = chars[Math.floor(Math.random() * 2)]; // Choosing the player's character randomly
const computer = (player == "X") ? "O" : "X";

const players = [player, computer];
let currentPlayer = players[Math.floor(Math.random() * 2)];  // Randomly choosing the starting player

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],  
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let running = false;

initializeGame();

function initializeGame() {
    running = true;
    
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartButton.addEventListener("click", restart);

    playerDisplay.textContent = `Player: ${player}`;
    computerDisplay.textContent = `Computer: ${computer}`;

    // Check if the computer starts and make it move if true
    if (currentPlayer == computer) {
        statusText.textContent = "The computer is thinking..";
        setTimeout(computerMove, 1000);
    } else {
        statusText.textContent = "Your turn..";
    }
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    // Prevent updating an already filled cell or if the game is not running
    if (options[cellIndex] != "" || !running) {
        return;
    }
    
    updateCell(this, cellIndex);
    checkWinner();
}

function changePlayer() {
    // Toggle between player and computer
    currentPlayer = (currentPlayer === player) ? computer : player;

    // If it's the computer's turn, make a move
    if (currentPlayer === computer) {
        statusText.textContent = "The computer is thinking..";
        setTimeout(computerMove, 1000);
    } else {
        statusText.textContent = "Your turn..";
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function computerMove() {
    let index;

    // Randomly pick an empty cell for the computer to play in
    do {
        index = Math.floor(Math.random() * 9);

        if (options[index] == "") {
            updateCell(cells[index], index);
            checkWinner();
            break;
        }
    } while (options[index] != "");
}

function checkWinner() {
    let gameWon = false;

    // Loop through all possible winning conditions
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];

        /* Get the values of the three cells in the current win condition 
           (eg. IF options = ["X", "O", "O", etc...] AND condition = [0, 1, 2], cellA = options[conditions[0]] WOULD BE "X")

           condition[0] will represent the first index/number of the current condition..

           options[condition[0]] will represent the value in the options array at the index of the first number/index of
           the current condition..

           (eg. FOR THE condition [0, 4, 8], condition[0] & condition[2] IS 0 & 8)
        */
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        // If any cell is empty, skip this condition
        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        }

        // If all three cells match, declare a win
        if (cellA == cellB && cellB == cellC) {
            gameWon = true;

            // Highlight the winning cells
            for (let j = 0; j < 3; j++) {
                cells[condition[j]].style.color = "green";
                cells[condition[j]].style.borderColor = "black";
            }

            break;
        }
    }

    // If a winner is found, stop the game and display the result
    if (gameWon) {
        statusText.textContent = `${currentPlayer} wins`;
        running = false;
    }
    // If no winner but the board is full, declare a draw
    else if (!options.includes("")) {
        running = false;
        statusText.textContent = "Draw";
    }
    else {
        changePlayer();
    }
}

function restart() {
    // Reset all game values and restart the game
    options = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.style.color = "black";                   
    });

    statusText.style.visibility = "hidden";

    initializeGame();
}