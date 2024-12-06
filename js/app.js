/*-------------- Constants -------------*/

/*---------- Variables (state) ---------*/

let simonPattern = []; // contains correct pattern player must play
let playerPattern = []; // what the player has entered
let patternIndex = 0; // current place in correct order
let attempts; // lives, essentially.
let strictMode = false; // if true, player must get all correct or restart

/*----- Cached Element References  -----*/

// ui elements
const currentMode = document.querySelector(".currentMode");
const currentScore = document.querySelector(".currentScore");
const highScore = document.querySelector(".highScore");

// gameplay elements
const gamepadButtons = document.querySelectorAll(".gameButton");
const startButton = document.querySelector(".startButton");
const toggleButton = document.querySelector(".toggleDifficulty");

/*-------------- Functions -------------*/

// start game
const init = () => {
  addColor();
};

const addColor = () => {
  const colors = ["blue", "red", "green", "yellow"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  simonPattern.push(colors[randomIndex]);
  playSimonSequence(); // to read pattern out to player
  console.log(simonPattern);
};

const playSimonSequence = () => {
  simonPattern.forEach((color, index) => {
    setTimeout(() => {
      // Prepend "game-" to match button IDs
      const button = document.querySelector(`#game-${color}`);
      if (button) {
        console.log(`Glowing ${color}`);
        button.classList.add("glow");
        setTimeout(() => {
          button.classList.remove("glow");
        }, 500); // Glow duration
      } else {
        console.error(`Button with ID 'game-${color}' not found`);
      }
    }, index * 600); // Delay between each glow
  });
};

const handleGamepadButton = (color) => {
  playerPattern.push(color.split("-")[1]); // removes the game- part
  if (playerPattern[patternIndex] === simonPattern[patternIndex]) {
    patternIndex++;
    if (playerPattern.length === simonPattern.length) {
      playerSuccess();
    }
  } else {
    playerFail();
  }
};

// Player Fail Logic
const playerFail = () => {
  console.log("Player failed the pattern.");
  console.log("s " + simonPattern);
  console.log("p " + playerPattern);
  if (strictMode) {
    return;
  } else if (!strictMode) {
    playerPattern = [];
    patternIndex = 0;
    playSimonSequence();
  }
};

// cleans playerpattern and index, adds new color.
const playerSuccess = () => {
  console.log("Player succeeded the pattern.");
  console.log("s " + simonPattern);
  console.log("p " + playerPattern);
  playerPattern = [];
  patternIndex = 0;
  addColor();
};
/*----------- Event Listeners ----------*/
gamepadButtons.forEach((button) => {
  button.addEventListener("click", () => handleGamepadButton(button.id));
});
startButton.addEventListener("click", () => {
  patternIndex = 0;
  init();
});
