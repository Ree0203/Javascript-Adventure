const character = document.getElementById("character"); 
const container = document.getElementById("board"); 
const playerPos = { x: 430 , y: 650 };
let currentCheckpoint = "start"; 
const textarea = document.getElementById("command");
let number = 1; 
let previousLineCount = textarea.value.split("\n").length; 

textarea.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        updateLines(); 
    } else if (event.key === "Enter" && event.shiftKey) { 
        runCommand(); 
        updateLines(); 
    }
});

textarea.addEventListener("input", () => {
    const currentLineCount = textarea.value.split("\n").length;

    if (currentLineCount < previousLineCount) { 
        var minus = currentLineCount - previousLineCount; 
        removeNumber(); 
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

function removeNumber(howmuch) { 
    const element = document.getElementById("number" + number); 
    element.remove(); 
    number--; 
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
        marker.style.top = (pos.y + 110) + "px";
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
            setTimeout(resolve, 3000)
        } catch (e) { 
            reject(e); 
        }
    });
}
    

function move(place) {
    const current = checkpoints[currentCheckpoint]; 

    if(!current[place]) {
        alert("You can't go there."); 
        return;
    }

    const nextCheckpoint = current[place];

    character.style.left = checkpoints[nextCheckpoint].x + "px"; 
    character.style.top = checkpoints[nextCheckpoint].y + "px"; 
    currentCheckpoint = nextCheckpoint; 

    if(nextCheckpoint === "door") { 
        setTimeout(() => {
            alert("You win.");
        }, 3000);   
    }

}

document.getElementById("command").placeholder = "Type Commands... \nmove('up');";
placeCheckpoints(); 
