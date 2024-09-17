//Querying the necessary elements
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

//All of the possible winning condition (in a matrix structure)
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

let options = ["", "", "", "", "", "", "", "", ""]; //Amount of empty spaces/Movement options
let running = false;

initializeGame();

function initializeGame() {
    running = true;
    
    //Adds an event listener to all of the elements in the node list
    cells.forEach(cell => cell.addEventListener("click", cellClicked));

    restartButton.addEventListener("click", restart);

    //Initializing the displays that remind the player what his/her character is
    playerDisplay.textContent = `Player: ${player}`;
    computerDisplay.textContent = `Computer: ${computer}`;

    // Check if the computer starts and make it move if true
    if (currentPlayer == computer) {
        statusText.textContent = "The computer is thinking..";

        //Delaying the execution to make it look like the computer is thinking it's move (to make it readable)
        setTimeout(computerMove, 1000);
    } else {
        statusText.textContent = "Your turn.."; //Refers to the player's turn
    }
}

function cellClicked() {
    //Get the attribute value of the cell (Cell Index)
    const cellIndex = this.getAttribute("cellIndex"); // `this` refers to the `cell` which got clicked

    // Prevent updating an already filled cell or if the game is not running
    if (options[cellIndex] != "" || !running) {
        return; //Preventing by ignoring the move/returning nothing
    }
    
    updateCell(this, cellIndex); //Update the cell based on the arguments passed
    checkWinner(); //Check if there are any winners yet
}

function changePlayer() {
    // Toggle between player and computer
    currentPlayer = (currentPlayer === player) ? computer : player;

    // If it's the computer's turn, make a move
    if (currentPlayer === computer) {
        statusText.textContent = "The computer is thinking..";

        //Delaying the execution to make it look like the computer is thinking (For design and interactive purposes)
        setTimeout(computerMove, 1000);
    } else {
        statusText.textContent = "Your turn..";
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer; //Fill in the space(empty space) with the current player
    cell.textContent = currentPlayer; //Change the text of the cell
}

function computerMove() {
    let index;

    // Randomly pick an empty cell for the computer to play in
    do {
        index = Math.floor(Math.random() * 9);

        //If the space is empty, update the cell and check the winner
        if (options[index] == "") {
            updateCell(cells[index], index);
            checkWinner();
            break;
        }
    } while (options[index] != ""); //Continue this until an empty space is found
}

function checkWinner() {
    let gameWon = false;

    // Loop through all possible winning conditions
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i]; //Signing the condition to a constant for checking purposes

        /* Get the values of the three cells that make up the current win condition.
   
           For example, if `options = ["X", "O", "O", ...]` and `condition = [0, 1, 2]`, 
           then `cellA = options[condition[0]]` would give "X".   
           
           The value `condition[0]` represents the first index in the current win condition.
           
           Using `options[condition[0]]`, we can get the value from the `options` array 
           at the position indicated by the first index in the current win condition.  

           For example, if the win condition is `[0, 4, 8]`, `condition[0]` and `condition[2]`
           correspond to the values at positions 0 and 8 in the `options` array.
        */

        const cellA = options[condition[0]]; // Cell 1
        const cellB = options[condition[1]]; // Cell 2
        const cellC = options[condition[2]]; // Cell 3

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
    // If there is no winner or draw, change the player
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