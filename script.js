const character = document.getElementById("character"); 
const ctx = character.getContext('2d'); 


const restartButton = document.getElementById("restart-button"); 
const restartCtx = restartButton.getContext('2d');
const buttonImage = new Image(); 
buttonImage.src = "Res/restart.png"
const BUTTON_WIDTH = restartButton.width = 144;
const BUTTON_HEIGHT = restartButton.height = 72;
const CANVAS_WIDTH = character.width = 150; 
const CANVAS_HEIGHT = character.height = 150; 

const resumeButton = document.getElementById("resume-button"); 
const resumeCtx = resumeButton.getContext('2d'); 
const resumeImage = new Image(); 
const RESUME_WIDTH = resumeButton.width = 144; 
const RESUME_HEIGHT = resumeButton.height = 72; 
resumeImage.src = "Res/back.png"
const playerImage = new Image(); 
playerImage.src = "Res/Girl_1/Idle.png";

const container = document.getElementById("board"); 
const playerPos = { x: 395 , y: 580 };
let currentCheckpoint = "start"; 
const textarea = document.getElementById("command");
let number = 2; 
let previousLineCount = textarea.value.split("\n").length; 
const spriteWidth = 128;
const spriteHeight = 128; 
let frameX = 0; 
let gameFrame = 0; 
let staggerFrame = 5; 
let frameNumber = 8; 
let waitTime = 3000; 
let lastExecutedLineIndex = 0; 
let restartBtnCords = 653.18; 
const buttonWidth = 144;
const buttonHeight = 72; 
const menu = document.getElementById("pause-menu"); 
const buttonClick = new Audio("Res/soundeffect.mp3"); 
let lastExecutedText = "";
let buttonSpriteFrame = 0; 
let buttonFrame = 0; 
let isAnimating = false; 
let resumeSprite = 0; 
let resumeAnimating = false; 

function renderButton (){ 
    restartCtx.clearRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT); 
    //drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); 
    restartCtx.drawImage(buttonImage, buttonSpriteFrame*144 , 0, buttonWidth, buttonHeight, 0, 0, BUTTON_WIDTH, BUTTON_HEIGHT)
    buttonFrame++; 
    resumeCtx.clearRect(0, 0, RESUME_WIDTH, RESUME_HEIGHT); 
    resumeCtx.drawImage(resumeImage, resumeSprite*144, 0, 144, 72, 0, 0, RESUME_WIDTH, RESUME_HEIGHT); 
    requestAnimationFrame(renderButton); 
}

renderButton();

function resumeLoop () { 
    if(!resumeAnimating) { 
        return; 
    }
    animateResume(); 
    requestAnimationFrame(resumeLoop); 
}
function buttonLoop () { 

    if(!isAnimating) { 
        return; 
    }
    animateButton(); 
    requestAnimationFrame(buttonLoop); 
}

function animateResume() { 
    if (buttonFrame % 5 == 0) { 
        if(resumeSprite < 4) { 
            resumeSprite++; 
        } else { 
            resumeSprite = 0; 
            return; 
        }
    }
}

function animateButton() { 
    if (buttonFrame % 5 == 0) { 
        if(buttonSpriteFrame < 4) { 
            buttonSpriteFrame++; 
        } else { 
            buttonSpriteFrame = 0; 
            return; 
        }
    }
}
function playSound () { 
    buttonClick.play(); 
}

resumeButton.addEventListener("click", () => { 
    if(!resumeAnimating) { 
        resumeAnimating = true; 
        resumeLoop(); 
        setTimeout(() => {
            resumeAnimating = false;
        }, 416.75); 
        resumeSprite = 0; 
    }
    playSound(); 
}); 

restartButton.addEventListener("click", () => {
    if(!isAnimating) { 
        isAnimating = true; 
        buttonLoop(); 
        setTimeout(() => {
            isAnimating = false;
        }, 416.75); 
        buttonSpriteFrame = 0; 
        playSound(); 
    }

    lastExecutedLineIndex = 0;
    currentCheckpoint = "start";
    lastExecutedText = "";

    character.style.transition = "none"; 
    playerImage.src = "Res/Girl_1/Idle.png";
    textarea.value = ""; 
    const editor = document.getElementById("numbers");
    editor.innerHTML = "";
    number = 1;
    previousLineCount = 1; 
    updateLines();
    frameNumber = 8; 
    character.style.left = (checkpoints.start.x - 18) + "px";
    character.style.top = (checkpoints.start.y - 40) + "px";
});


function animate() { 
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
    requestAnimationFrame(animate); 
    //drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); 
    ctx.drawImage(playerImage, frameX * spriteWidth, 0, spriteWidth, spriteHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 

    if(gameFrame % staggerFrame == 0) { 
        if(frameX < frameNumber) { 
            frameX++;
        } else { 
            frameX = 0; 
        }
    }

    gameFrame++; 
    
}

animate(); 


textarea.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        updateLines(); 
    } else if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault(); 
        runCommand(); 
    }
});

textarea.addEventListener("input", () => {
    const currentLineCount = textarea.value.split("\n").length;

    if (currentLineCount < previousLineCount) { 
        var linesToRemove = previousLineCount - currentLineCount; 
        removeNumber(linesToRemove); 

    }

    previousLineCount = currentLineCount; 
})
function updateLines() { 
    const editor = document.getElementById("numbers"); 
    const mark = document.createElement("li");
    mark.id = "number" + number; 
    mark.textContent = number;
    editor.appendChild(mark)


    number++;

}

function removeNumber(howMuch) { 

    for(let i = 0; i<howMuch; i++) { 
        number--;

        const element = document.getElementById("number" + number); 
        if(element) { 
            element.remove(); 
        }

        if(lastExecutedLineIndex != 0) { 
            lastExecutedLineIndex--; 
        }
    }
}


const checkpoints = { 
    start: { x: 430, y: 650, up: "hallway"},
    hallway: { x: 430, y: 290, down: "start", right: "dining"},
    dining: { x: 980, y: 290, down: "door", left: "hallway"},
    door: { x: 980, y: 550, up: "dining" }
};

function placeCheckpoints() { 
    for(const name in checkpoints) { 
        const marker = document.createElement("img");
        marker.src = "Res/checkpointimage.png";
        marker.className = "checkpoint";  
        const pos = checkpoints[name]; 
        marker.style.left = (pos.x + 30) + "px"; 
        marker.style.top = (pos.y + 98) + "px";
        marker.title = name; 
        container.appendChild(marker); 
    }
}

async function runCommand() {
    const currentText = textarea.value.trim();
    const lines = currentText.split("\n");
    const previousLines = lastExecutedText.split("\n"); 
    let newLines = lines.slice(lastExecutedLineIndex); 
    let editedIndex = lineEdited(previousLines, lines); 
    if(editedIndex != -1) { 
        lastExecutedLineIndex = editedIndex; 
        newLines = lines.slice(editedIndex); 
    }

    for (let i = 0; i < newLines.length; i++) {
        const line = newLines[i].trim();
        if (line === "") continue;

        try {
            lastExecutedLineIndex++;

            await executeLine(line);

            playerImage.onload = () => {
                frameNumber = 8;
            };
            playerImage.src = "Res/Girl_1/Idle.png";

        } catch (e) {
            alert("Error on line " + (lastExecutedLineIndex + 1) + ": " + e.message);
            return;
        }
    }

    lastExecutedText = currentText;
}



function lineEdited (previous, after) { 
    for(let i = 0; i<previous.length; i++) { 
        if(previous[i] !== after[i]) { 
            return i; 
            break; 
        }
    }
    return -1; 
}


function executeLine(line) { 
    return new Promise((resolve, reject) => {
        try { 
            eval(line); 
            setTimeout(resolve, waitTime)
        } catch (e) { 
            reject(e); 
        }
    });
}
    

function move(place) {
    const current = checkpoints[currentCheckpoint]; 

    if(!current[place]) {
        throw new Error ("You can't go there."); 
        return;
    }

    
    const nextCheckpoint = current[place];

    let distance = getDistance(checkpoints[currentCheckpoint].x, 
                checkpoints[currentCheckpoint].y, 
                checkpoints[nextCheckpoint].x, checkpoints[nextCheckpoint].y); 

    
    const timePerPixel = 10; 
    const transitionTime = distance * timePerPixel; 

    character.style.transition = `top ${transitionTime}ms, left ${transitionTime}ms`; 

    waitTime = distance + 3500; 
    character.style.left = (checkpoints[nextCheckpoint].x - 18) + "px"; 
    character.style.top = (checkpoints[nextCheckpoint].y - 40) + "px"; 
    currentCheckpoint = nextCheckpoint; 

    if(nextCheckpoint === "door") { 
        setTimeout(() => {
            alert("You win.");
        }, waitTime);   
    }

    playerImage.onload = () => {
        frameNumber = 11;
    };
    playerImage.src = "Res/Girl_1/Walk.png";


}

function getDistance(x1, y1, x2, y2) { 
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

document.getElementById("command").placeholder = "Type Commands... \nmove('up');";
placeCheckpoints(); 
