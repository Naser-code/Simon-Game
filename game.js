var gamePattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var userClickedPattern = [];
var level = 0;
var started = false;
var highScore = localStorage.getItem("highScore") || 0;  // Retrieve high score from localStorage or set to 0

// Display the high score when the game loads
$("h2").text("High Score: " + highScore);

// Detect whether the user is on a mobile device
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
    // On mobile, use touch events
    $(document).on("touchstart", function() {
        startGame();
    });
} else {
    // On desktop, use keydown and mousedown
    $(document).on("keydown mousedown", function() {
        startGame();
    });
}

// Button click/touch detection for both mobile and desktop
$(".btn").on("click touchstart", function(e) {
    e.preventDefault();  // Prevent default behavior on mobile (like scrolling)

    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(this);
    checkAnswer(userClickedPattern.length - 1);
});

function playSound(name) {
    var aud = new Audio("sounds/" + name + ".mp3");
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
        console.log("Success");
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        console.log("Wrong");
        var aud1 = new Audio("sounds/wrong.mp3");
        aud1.play();
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("h1").text("Game Over, Press Any Key to Restart");

        // Check and update the high score
        if (level > highScore) {
            highScore = level - 1; // -1 because level is incremented before the game ends
            localStorage.setItem("highScore", highScore);
            $("h2").text("High Score: " + highScore);  // Update high score display
        }

        startOver();
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}
