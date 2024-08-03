var gamePattern = [];

var buttonColours = ["red","blue","green","yellow"];

var userClickedPattern = [];

var level = 0;

function nextSequence() {
    userClickedPattern=[];
    $("h1").text("Level "+level);
    var randomNumber = Math.floor(Math.random()*4);
    var randomChosenColour= buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    $("#"+randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

    playSound(randomChosenColour);
    level++;
}

var started = false;

$(document).keydown(function () {
    if (!started) {
        nextSequence();
        started = true;
    }
});

$(".btn").click(function() {
    var userChosenColour = $(this).attr("id");

    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(this);
    checkAnswer(userClickedPattern.length-1);
});

function playSound(name) {
    var aud= new Audio("sounds/"+name+".mp3");
    aud.play();
}

function animatePress(currentColour){
    $(currentColour).addClass("pressed");

    setTimeout(() => {
        $(currentColour).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel]===gamePattern[currentLevel]) {
        console.log("Success");
    } else {
        console.log("Wrong");
        var aud1= new Audio("sounds/wrong.mp3");
        aud1.play();
        $("body").addClass("game-over");
        setTimeout(() => {
            $("body").removeClass("game-over");
        }, 200);
        $("h1").text("Game Over, Press Any Key to Restart");
        startOver();
    }

    if (userClickedPattern.length===gamePattern.length) {
        setTimeout(() => {
            nextSequence();
            userClickedPattern=[];
        }, 1000);
    }
}

function startOver() {
    level=0;
    gamePattern=[];
    started=false;
}