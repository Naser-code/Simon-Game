// Game settings variables
var gamePattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var userClickedPattern = [];
var level = 0;
var started = false;
var volumeLevel = 0.5;
var showingPattern = false; // Lock buttons during pattern display

// High scores for each difficulty level
var highScores = {
  easy: parseInt(localStorage.getItem("highScoreEasy")) || 0,
  medium: parseInt(localStorage.getItem("highScoreMedium")) || 0,
  hard: parseInt(localStorage.getItem("highScoreHard")) || 0,
};

// Difficulty settings variables
var difficulty = null; // No default difficulty
var speed = 600;
var sequenceIncrement = 1;

// Initial setup: Prompt user to select a difficulty
$(document).ready(function() {
  $("h1").text("Choose a Difficulty to Start"); // Initial prompt
  updateHighScoreDisplay(); // Display a high score placeholder
});

// Difficulty button event listeners
$("#easy-btn").on("click", function() {
  setDifficulty("easy");
});
$("#medium-btn").on("click", function() {
  setDifficulty("medium");
});
$("#hard-btn").on("click", function() {
  setDifficulty("hard");
});

// Set difficulty, reset game state, and start game after 2 seconds
function setDifficulty(selectedDifficulty) {
  difficulty = selectedDifficulty;
  setDifficultySettings(difficulty);
  updateHighScoreDisplay();
  highlightSelectedDifficultyButton();

  $("h1").text("Starting Game...");

  // Clear previous game state
  gamePattern = []; // Clear any previous pattern
  userClickedPattern = []; // Clear user clicks
  level = 0; // Reset level

  // Delay game start by 2 seconds after choosing difficulty
  setTimeout(function() {
    resetGame();
    startGame();
  }, 1000);
}

// Highlight the selected difficulty button
function highlightSelectedDifficultyButton() {
  $(".difficulty-btn").removeClass("selected-difficulty");
  $("#" + difficulty + "-btn").addClass("selected-difficulty");
}

// Set game settings based on chosen difficulty
function setDifficultySettings(difficulty) {
  switch (difficulty) {
    case "easy":
      speed = 800;
      sequenceIncrement = 1;
      break;
    case "medium":
      speed = 600;
      sequenceIncrement = 2;
      break;
    case "hard":
      speed = 400;
      sequenceIncrement = 3;
      break;
  }
}

// Display high score based on difficulty, or placeholder if none is chosen
function updateHighScoreDisplay() {
  if (difficulty) {
    $("h2").text("High Score: " + highScores[difficulty]);
  } else {
    $("h2").text("High Score: -"); // Placeholder when no difficulty is selected
  }
}

// Start game function
function startGame() {
  if (!started) {
    nextSequence();
    started = true;
  }
}

// Button click listener for user interactions, only works if showingPattern is false
$(".btn").on("click touchstart", function() {
  if (!showingPattern) { // Check if pattern is being shown
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(this);
    checkAnswer(userClickedPattern.length - 1);
  }
});

// Game mechanics: display sequence with `sequenceIncrement`
function nextSequence() {
  userClickedPattern = [];
  level++;
  $("h1").text("Level " + level);
  showingPattern = true; // Lock button clicks during pattern display

  let delay = 0;

  // Add colors to the sequence based on `sequenceIncrement`
  for (let i = 0; i < sequenceIncrement; i++) {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    // Schedule each color flash with a delay based on `speed`
    setTimeout(function() {
      $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
      playSound(randomChosenColour);
    }, delay);

    delay += speed; // Adjust delay for each subsequent color flash
  }

  // Unlock buttons after the entire sequence has been shown
  setTimeout(function() {
    showingPattern = false;
  }, delay);
}

// Check user's answer against game pattern
function checkAnswer(currentLevel) {
  // Check if the latest user input matches the corresponding pattern element
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    // If the user has completed the entire sequence correctly, advance to the next level
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function() {
        nextSequence();
      }, 1000);
    }
  } else {
    // If the user's answer is wrong, end the game
    gameOver();
  }
}

// Game over and update high score if applicable
function gameOver() {
  var wrongAudio = new Audio("sounds/wrong.mp3");
  wrongAudio.volume = volumeLevel;
  wrongAudio.play();

  // Apply and remove game-over animation
  $("body").addClass("game-over");
  setTimeout(function() {
    $("body").removeClass("game-over");
  }, 200);

  $("h1").text("Game Over, Restarting...");

  if (level > highScores[difficulty]) {
    highScores[difficulty] = level - 1;
    localStorage.setItem("highScore" + capitalizeFirstLetter(difficulty), highScores[difficulty]);
    updateHighScoreDisplay();
  }

  // Automatically restart after 1 second
  setTimeout(function() {
    resetGame();
    startGame();
  }, 1000);
}

// Reset game function to start a new session
function resetGame() {
  level = 0;
  gamePattern = [];
  started = false;
}

// Utility function to capitalize localStorage keys
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Play sound
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.volume = volumeLevel;
  audio.play();
}

// Animate button press
function animatePress(currentColour) {
  $(currentColour).addClass("pressed");
  setTimeout(function() {
    $(currentColour).removeClass("pressed");
  }, 100);
}
