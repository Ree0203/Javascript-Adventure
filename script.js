const character = document.getElementById("character"); 
const ctx = character.getContext('2d'); 

const CANVAS_WIDTH = character.width = 150; 
const CANVAS_HEIGHT = character.height = 150; 

const playerImage = new Image(); 
playerImage.src = "Res/Girl_1/Idle.png";

const container = document.getElementById("board"); 
const playerPos = { x: 395 , y: 580 };
let currentCheckpoint = "start"; 
const textarea = document.getElementById("command");
let number = 1; 
let previousLineCount = textarea.value.split("\n").length; 
const spriteWidth = 128;
const spriteHeight = 128; 
let frameX = 0; 
let gameFrame = 0; 
let staggerFrame = 5; 
let frameNumber = 8; 
let waitTime = 3000; 

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
    number+=1; 
    const mark = document.createElement("li");
    mark.id = "number" + number; 
    mark.textContent = number;
    editor.appendChild(mark)
}

function removeNumber(howMuch) { 

    for(let i = 0; i<howMuch; i++) { 
        const element = document.getElementById("number" + number); 
        if(element) { 
            element.remove(); 
            number--;
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
    const lines = (textarea.value.split("\n"));

    for(line of lines) { 
        try {
            if(line.value === " ") { 
                continue; 
            } else { 
                await executeLine(line);
                playerImage.onload = () => {
                    frameNumber = 8;
                };
                playerImage.src = "Res/Girl_1/Idle.png";
            }

        } catch(e) { 
            alert("Error: " + e.message); 
            break; 
        }

    }
   
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
    character.style.transition = ("top " + distance + "0ms, left " + distance + "0ms"); 
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
