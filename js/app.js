/*---------- Variables (state) ---------*/

let simonPattern = []; // contains correct pattern player must play
let playerPattern = []; // what the player has entered
let patternIndex = 0; // current place in correct order
let attempts; // lives, essentially.
let strictMode = false; // if true, player must get all correct or restart
let score = 0; // current score
let highScore = 0; // highest score player has achieved
let computerTurn = false; // if true, player cannot press buttons

/*----- Cached Element References  -----*/

// ui elements
const currentModeText = document.querySelector(".currentMode");
const currentScoreText = document.querySelector(".currentScore");
const highScoreText = document.querySelector(".highScore");
const gameStateText = document.querySelector(".gameState");

// gameplay elements
const gamepadButtons = document.querySelectorAll(".gameButton");
const startButton = document.querySelector(".startButton");
const toggleButton = document.querySelector(".toggleDifficulty");

/*-------------- Functions -------------*/

// start game
const init = () => {
  score = 0;
  patternIndex = 0;
  simonPattern = [];
  updateScore();
  addColor();
};

// update scoreboards
const updateScore = () => {
  currentScoreText.textContent = `Your Score: ${score}`;
  if (score > highScore) {
    highScore = score;
    highScoreText.textContent = `High Score: ${highScore}`;
  }
};

// adds color to pattern
const addColor = () => {
  const colors = ["blue", "red", "green", "yellow"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  simonPattern.push(colors[randomIndex]);
  playSimonSequence(); // to read pattern out to player
};

// plays the pattern the player must enter
const playSimonSequence = () => {
  playerPattern = [];
  patternIndex = 0;
  computerTurn = true;
  gameStateText.textContent = "Computer Turn";
  setTimeout(() => {
    simonPattern.forEach((color, index) => {
      setTimeout(() => {
        glowButton(color, 500);
        if (index === simonPattern.length - 1) {
          setTimeout(() => {
            computerTurn = false;
            gameStateText.textContent = "Your Turn";
          }, 500); // 500ms delay after the last color
        }
      }, index * 750); // each color in sequence glows in intervals of 750ms
    });
  }, 500); // 500ms delay before the first color. This needs to exist or it'll break. if the last color pressed is still going on.
};

// play sound effect
const playSound = (sound) => {
  const audio = new Audio(`sounds/${sound}.mp3`);
  audio.play();
};

// glows button for duration & plays matching sound effect
const glowButton = (color, duration) => {
  const button = document.querySelector(`#game-${color}`);
  if (button) {
    button.classList.add("glow");
    playSound(color);
    setTimeout(() => {
      button.classList.remove("glow");
    }, duration);
  } else {
    console.error(`Button with ID 'game-${color}' not found`);
  }
};

// simon gamepad button onclick effects
const handleGamepadButton = (color) => {
  if (computerTurn) return; // ignore inputs if it's computer's turn
  const trimmedColor = color.split("-")[1]; // removes the game- part so nothing breaks
  playerPattern.push(trimmedColor);
  if (playerPattern[patternIndex] === simonPattern[patternIndex]) {
    patternIndex++;
    glowButton(trimmedColor, 500);
    if (playerPattern.length === simonPattern.length) {
      computerTurn = true; // prevents player from mashing buttons after winning for the 500ms grace period
      playerSuccess();
    }
  } else {
    playerFail();
  }
};

// Player Fail Logic
const playerFail = () => {
  playSound("fail");
  if (strictMode) {
    gameStateText.textContent = "You Lose!";
  } else if (!strictMode) {
    playSimonSequence();
  }
};

// cleans playerpattern and index, adds new color.
const playerSuccess = () => {
  score++;
  updateScore();
  addColor();
};

/*----------- Event Listeners ----------*/
gamepadButtons.forEach((button) => {
  button.addEventListener("click", () => handleGamepadButton(button.id));
});
startButton.addEventListener("click", () => {
  init();
});
toggleButton.addEventListener("click", () => {
  strictMode = !strictMode;
  currentModeText.textContent = strictMode
    ? "Current Mode: Strict"
    : "Current Mode: Normal";
});
