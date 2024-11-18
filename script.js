
// Hämta HTML-element
const feedButton = document.getElementById("feed-btn");
const sleepButton = document.getElementById("sleep-btn");
const playButton = document.getElementById("play-btn");

// Hämta ansikts-elementen
const happyFace = document.querySelector(".happy-face");
const sadFace = document.querySelector(".sad-face");
const middleFace = document.querySelector(".middle-face");

// Startvärde för fyllningen
let fillPercentageHunger = 100; 
let fillPercentageJoy = 100;
let fillPercentageEnergy = 100;

function showSad() {
    happyFace.style.display = "none";
    middleFace.style.display = "none";
    sadFace.style.display = "block";
    disableButtons();
}

function showMid() {
    happyFace.style.display = "none";
    middleFace.style.display = "block";
    sadFace.style.display = "none";
}

function showHappy() {
        happyFace.style.display = "block";
        middleFace.style.display = "none";
        sadFace.style.display = "none";
    }

// Funktion för att minska fyllningen
function decreaseFilling() {

    // Minska fyllningen för varje box och kontrollera om någon når 0
    if (fillPercentageHunger > 0) {
        fillPercentageHunger -= 1;
        console.log(fillPercentageHunger)
        document.querySelector(".hunger-box .fill").style.width = fillPercentageHunger + '%';
    }

    if (fillPercentageHunger > 0 && fillPercentageHunger <= 50) {
        document.querySelector(".hunger-box .fill").style.backgroundColor = "orange"; 
        showMid()
    } else if(fillPercentageHunger > 50) {
        showHappy()
    }

    if (fillPercentageJoy > 0) {
        fillPercentageJoy -= 1;
        document.querySelector(".joy-box .fill").style.width = fillPercentageJoy + '%';
    }

    if (fillPercentageJoy > 0 && fillPercentageJoy <= 50) {
        document.querySelector(".joy-box .fill").style.backgroundColor = "orange"; 
        showMid()
    } else if(fillPercentageJoy > 50) {
        showHappy()
    } 

    if (fillPercentageEnergy > 0) {
        fillPercentageEnergy -= 1;
        document.querySelector(".energy-box .fill").style.width = fillPercentageEnergy + '%';
    }

    if (fillPercentageEnergy > 0 && fillPercentageEnergy <= 50) {
        document.querySelector(".energy-box .fill").style.backgroundColor = "orange"; 
        showMid()
    } else if(fillPercentageEnergy > 50) {
        showHappy()
    } 

    if (fillPercentageEnergy == 0 && fillPercentageJoy == 0 || fillPercentageHunger == 0) {
        showSad()
    }
}

// Anropa decreaseFilling, millisek
setInterval(decreaseFilling, 400000000000000000);

// Lyssna på klick för att öka fyllningen
feedButton.addEventListener('click', () => {
    if (fillPercentageHunger < 100) {
        fillPercentageHunger += 33;
        document.querySelector(".hunger-box .fill").style.width = fillPercentageHunger + '%';
        if (fillPercentageHunger > 50){
            document.querySelector(".hunger-box .fill").style.backgroundColor = "green"; 
        }
        saveGameState()
    }
});

sleepButton.addEventListener('click', () => {
    if (fillPercentageEnergy < 100) {
        fillPercentageEnergy += 33;
        document.querySelector(".energy-box .fill").style.width = fillPercentageEnergy + '%';
        if (fillPercentageEnergy > 50){
            document.querySelector(".energy-box .fill").style.backgroundColor = "green"; 
        }
        saveGameState()
    }
});

playButton.addEventListener('click', () => {
    if (fillPercentageJoy < 100) {
        fillPercentageJoy += 33;
        document.querySelector(".joy-box .fill").style.width = fillPercentageJoy + '%';
        if (fillPercentageJoy > 50) {
            document.querySelector(".joy-box .fill").style.backgroundColor = "green"; 
        }
        saveGameState()
    }
});

    
// Funktion för att inaktivera alla knappar
function disableButtons() {
    feedButton.disabled = true;
    sleepButton.disabled = true;
    playButton.disabled = true;
}

//  Sparar spelets värde
function saveGameState() {
    const currentTime = Date.now();  // Hämtar nuvarande tid i millisekunder
    localStorage.setItem("lastSavedTime", currentTime);
    localStorage.setItem("fillHunger", fillPercentageHunger);
    localStorage.setItem("fillJoy", fillPercentageJoy);
    localStorage.setItem("fillEnergy", fillPercentageEnergy);
}

function restoreGameState() {
    const lastSavedTime = localStorage.getItem("lastSavedTime");
    const fillHunger = parseFloat(localStorage.getItem("fillHunger"));
    const fillJoy = parseFloat(localStorage.getItem("fillJoy"));
    const fillEnergy = parseFloat(localStorage.getItem("fillEnergy"));

    if (lastSavedTime) {
        const currentTime = Date.now();
        const timeElapsed = currentTime - lastSavedTime;  // Tid i millisekunder
        const hoursElapsed = timeElapsed / (1000 * 60 * 60);  // Konvertera till timmar

        // Förlora 5% per timme
        const hungerLoss = hoursElapsed * 15;
        const joyLoss = hoursElapsed * 15;
        const energyLoss = hoursElapsed * 15;

        let updatedHunger = fillHunger - hungerLoss;
        let updatedJoy = fillJoy - joyLoss;
        let updatedEnergy = fillEnergy - energyLoss;

        // Se till att fyllningen inte blir negativ
        updatedHunger = Math.max(updatedHunger, 0);
        updatedJoy = Math.max(updatedJoy, 0);
        updatedEnergy = Math.max(updatedEnergy, 0);

        // Uppdatera fyllningsrutor
        fillPercentageHunger = updatedHunger;
        fillPercentageJoy = updatedJoy;
        fillPercentageEnergy = updatedEnergy;

        document.querySelector(".hunger-box .fill").style.width = fillPercentageHunger + '%';
        document.querySelector(".joy-box .fill").style.width = fillPercentageJoy + '%';
        document.querySelector(".energy-box .fill").style.width = fillPercentageEnergy + '%';
    }
}


// Anropa när sidan laddas
window.onload = function() {
    restoreGameState();  // Återställ tillstånd från localStorage
    setInterval(decreaseFilling, 1000);  // Fortsätt att minska fyllning om man inte spelar
}