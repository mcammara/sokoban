const mazeDiv = document.getElementById("mazeDiv");
const avatar = document.getElementById("avatar");

// Size of the squares in the grid, in pixels.
const delta = 33;

// Coordinates of the player's avatar.
var avatarRow, avatarCol;

// Separate array for keeping track of the moving crates.
var crates = [];

// Helper function for creating a div representing a box/crate,
// and positioning it at a specified row/column in the grid.
function crate(row, col) {
    var newCrate = document.createElement("div");
    newCrate.className = "crate";
    newCrate.style.left = col*delta + "px";
    newCrate.style.top = row*delta + "px";
    mazeDiv.appendChild(newCrate);
    return newCrate;
}

// Initial scan of the map
// Create all the visual elements (divs)
// The static parts of the map will be a grid of flex positioned divs.
// They will get created here, and never modified again.
// The moving pieces (player and boxes) will be absolutely positioned divs
// laying on top of the map.
// During this process, also initialize the crates data structure,
// which will be used to keep track of the moving boxes.
for(var row = 0; row < map.length; row++) {
    var rowStr = map[row];
    var rowDiv = document.createElement("div");
    rowDiv.className = "row";
    var crateRow = [];
    
    for(var i = 0; i < rowStr.length; i++) {
        var cellClass = rowStr[i];
        var cellDiv = document.createElement("div");
        if(cellClass === "X") {
            crateRow.push(crate(row, i));
            cellClass="O";
        } else if(cellClass === "B") {
            crateRow.push(crate(row, i));
            cellClass = " ";
        } else {
            crateRow.push(null);
        }

        cellDiv.className = "cell " + cellClass;
        if(cellClass === "S") {
            avatarCol = i;
            avatarRow = row;
        }
        rowDiv.appendChild(cellDiv);
    }
    mazeDiv.appendChild(rowDiv);
    crates.push(crateRow);
}

// Update the coordinates of the player's avatar.
function redrawAvatar(anim) {
    avatar.className = "";
    avatar.style.top = avatarRow*delta + "px";
    avatar.style.left = avatarCol*delta + "px";

    // Add a class indicating which animation to show.
    // Set a timeout to remove the animation class after the animation completes.
    if(anim) {
        avatar.className = anim;
        setTimeout(function() {
		    avatar.classList.remove(anim);
        }, 100);
    }
}

redrawAvatar("");

// Move the player's avatar in the specified direction
// dRow is the desired change in row (-1, 0, or +1)
// dCol is the desired change in column (-1, 0, or +1)
function move(dRow, dCol, anim) {
    // Calculate the coordinates the player wants to move to.
    const destRow = avatarRow + dRow;
    const destCol = avatarCol + dCol;
    const destCell = map[destRow][destCol];

    // Check if there is a crate there.
    var crate = crates[destRow][destCol];
    if(crate) {
        // Calculate the coordinates we would need to push the crate.
        const crateDestRow = destRow + dRow;
        const crateDestCol = destCol + dCol;

        // Make sure there isn't another crate in the way of the first.
        if(crates[crateDestRow][crateDestCol]) return;

        // Make sure the cell beyond the crate isn't a wall.
        if(map[crateDestRow][crateDestCol] === "W") return;

        // Push the crate.
        crates[crateDestRow][crateDestCol] = crate;
        crates[destRow][destCol] = null;
        crate.style.top = crateDestRow * delta + "px";
        crate.style.left = crateDestCol * delta + "px";

        // Add the animation for moving the crate.
        crate.classList.add(anim);
        setTimeout(function() {
            crate.classList.remove(anim);
        }, 100)
    }

    // If there's no wall in the way, move the player's avatar.
    if(destCell && destCell !== "W") {
        avatarRow += dRow;
        avatarCol += dCol;
        redrawAvatar(anim);
    }
    checkForWin();
}

function checkForWin() {
    for(var row = 0; row < map.length; row++) {
        for(var col = 0; col < map[row].length; col++) {
            // Is there a crate that's not on a storage location?
            if(crates[row][col] && (map[row][col] !== "O" && map[row][col] !== "X")) return;
        }
    }
    document.getElementById("youWonDiv").style.display = "block";
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    switch(keyName) {
        case "ArrowDown":
            move(1,0,"slideDown");
            break;
        case "ArrowUp":
            move(-1,0,"slideUp");
            break;
        case "ArrowLeft":
            move(0,-1,"slideLeft");
            break;
        case "ArrowRight":
            move(0,1,"slideRight");
            break;
        default:
            console.log('keydown event\n\n' + 'key: ' + keyName);
    }
});
