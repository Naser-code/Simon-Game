var gamePattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var userClickedPattern = [];
var level = 0;
var started = false;
var highScore = localStorage.getItem("highScore") || 0;  // Retrieve high score from localStorage or set to 0
var volumeLevel = 0.5;  // Set the default volume level (0.0 to 1.0)

// Display the high score when the game loads
$("h2").text("High Score: " + highScore);

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function nextSequence() {
    userClickedPattern = [];
    level++;
    $("h1").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
}

function startGame() {
    if (!started) {
        nextSequence();
        started = true;
    }
}

// Detecting events for starting the game
if (isMobile) {
    $(document).on("touchstart", function() {
        startGame();
    });
} else {
    $(document).on("keydown mousedown", function() {
        startGame();
    });
}

$(".btn").on("click touchstart", function(e) {
    e.preventDefault();  // Prevent default behavior on mobile (like scrolling)

    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(this);
    checkAnswer(userClickedPattern.length - 1);
});

// Function to play sounds with adjustable volume
function playSound(name) {
    var aud = new Audio("sounds/" + name + ".mp3");
    aud.volume = 0.1;
    aud.play();
}

function animatePress(currentColour) {
    $(currentColour).addClass("pressed");
    setTimeout(function() {
        $(currentColour).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        var aud1 = new Audio("sounds/wrong.mp3");
        aud1.volume = 0.1;
        aud1.play();
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("h1").text("Game Over, Press Any Key to Restart");

        if (level > highScore) {
            highScore = level - 1;
            localStorage.setItem("highScore", highScore);
            $("h2").text("High Score: " + highScore);
        }

        startOver();
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}