let ROW;
let COL;

let ms;
let MS = 40;   //delay.

//pre-defined colours
let bgColour = "#30363d";
let obstacle_colour = "white";
let path_colour_start = [255, 252, 51]; //"rgb(0,255,255)"
let path_colour_end = [119, 0, 255];   //"rgb(51,51,255)"
let spread1_colour = "#c93328";
let spread2_colour = "#753534";
let spread3_colour = "#4f3539";

let arr = [];
let vis = [];

//for adjacent cells.
var dRow = [-1, 0, 0, 1];
var dCol = [0, 1, -1, 0];


//Size slider
var slider = document.getElementById("myRange");
var size = document.getElementById("demo");
size.innerHTML = slider.value;
ROW = slider.value;
COL = slider.value;
Draw();

slider.oninput = function() {
    arr = [];
    size.innerHTML = this.value;
    ROW = this.value;
    COL = this.value;
    Draw();
}

//speed slider
var Speed_slider = document.getElementById("speedRange");
var speed = document.getElementById("speedDemo");
speed.innerHTML = Speed_slider.value;
ms = MS - Speed_slider.value;

Speed_slider.oninput = function() {
    speed.innerHTML = this.value;
    ms = MS - this.value;
}

//Drawing tables
function Draw(){

    //initialize the matrix only if its not initialized already.(It can be initialized by the Generate() function.)
    if(arr.length == 0){
        for(let i = 0; i < ROW; i++){
            let arr1 = [];
            for(let j = 0; j < COL; j++){
                arr1.push(0);
            }
            arr.push(arr1);
        }
    }

    //if a table already exists, remove the table.
    var t = document.getElementById('mytable');
    if(t != null){
        t.remove();
    }

    let table = document.createElement('table');
    table.setAttribute('id', 'mytable');

    document.getElementById('body').appendChild(table);

    for(let i = 0; i < ROW; i++){
        let row = document.createElement('tr');
        for(let j = 0; j < COL; j++){
            let cell = document.createElement('td');
            cell.innerHTML = "";
            cell.setAttribute('class', 'td');
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    //making obstacles by clicking on the cells.
    var x = document.getElementById("mytable").getElementsByTagName("td");
    for(let i = 0; i < ROW * ROW; i++){
        x[i].onclick = function(){
            if(arr[~~(i/ROW)][i%ROW] == 0){
                x[i].style.backgroundColor = obstacle_colour;
                arr[~~(i/ROW)][i%ROW] = 1;  //integer division : ~~(i/ROW).
            }
            else{
                x[i].style.backgroundColor = bgColour;
                arr[~~(i/ROW)][i%ROW] = 0;
            }
        };
    }
}

//colouring the table. (comparing it to the matrix and colour white where there is 1(i.e. an obstacle.))
function colour(){
    for(let i = 0; i < ROW; i++){
        for(let j = 0; j < COL; j++){
            var x = document.getElementById("mytable").getElementsByTagName("td");
            if(arr[i][j] == 1){
                x[i*ROW + j].style.backgroundColor = obstacle_colour;
            }
            else{
                x[i*ROW + j].style.backgroundColor = bgColour;
            }
        }
    }
}

//it colours the spread.
function spread_colour(path, count){
    let l = path.length;
    var x = document.getElementById("mytable").getElementsByTagName("td");
    setTimeout(function(){
        x[(path[l-1][0])*ROW + path[l-1][1]].style.backgroundColor = spread1_colour;
    }, count * ms);
    setTimeout(function(){
        x[(path[l-1][0])*ROW + path[l-1][1]].style.backgroundColor = spread2_colour;
    }, (count + 5) * ms);
    setTimeout(function(){
        x[(path[l-1][0])*ROW + path[l-1][1]].style.backgroundColor = spread3_colour;
    }, (count + 10) * ms);
    setTimeout(function(){
        x[(path[l-1][0])*ROW + path[l-1][1]].style.backgroundColor = bgColour;
    }, (count + 15) * ms);
}

//it colours the final path.
function printPath(path, count){
    let l = path.length;
    let diff = [];

    for(let i = 0; i < 3; i++){
        diff.push((path_colour_end[i] - path_colour_start[i])/l);
    }

    //rainbow effect
    function path_colour(i){
        let colour = [];
        for(let j = 0; j < 3; j++){
            colour.push(path_colour_start[j] + i * diff[j]);
        }

        return "rgb(" + colour[0].toString() + "," + colour[1] + "," + colour[2] + ")";
    }

    for(let i = 0; i < l; i++){
        var x = document.getElementById("mytable").getElementsByTagName("td");
        setTimeout(function(){
            x[path[i][0]*ROW + path[i][1]].style.backgroundColor = path_colour(i);
            x[path[i][0]*ROW + path[i][1]].style.border = "0px";
        }, (count + 15) * ms + i * 10);
    }
}

//solver function.
function Start(){
    Draw();
    vis = [];

    //we have to call colour here because if we start the solver again, we need to remove the solved path.
    colour();

    //checks if the adjacent cell is valid or not.
    function isValid(arr, vis, row, col){

        if(row < 0 || col < 0){
            return false;
        }

        else if(row >= ROW || col >= COL){
            return false;
        }

        else if(arr[row][col] == 1){
            return false;
        }

        else if(vis[row][col] == 1){
            return false;
        }

        return true;
    }

    //the breadth first search algorithm.
    function bfs(arr, vis, row, col){
        var q = [];

        if(isValid(arr, vis, row, col)){    //checking if the current cell from the queue is still valid or not (beacause once a valid cell can become eventually invalid.).
            q.push([[[row, col]],0]);
            vis[row][col] = true;
        }
        else{
            return false;
        }

        let count = 0;  //for delay in spread colour.

        while(q.length != 0){
            var path = q[0][0];  //top element(path) in the queue.
            var c = path[path.length - 1];  //the last cell in the path, to continue it further.

            if(c[0] == ROW - 1 && c[1] == COL - 1){
                printPath(path, count);
                return true;
            }

            //get the time delay for that specific path.
            count = q[0][1];

            //dequeue.
            q.shift();

            count++;

            //here we take all the adjacent cells using the defined dROW and dCOL lists.
            for(let i = 0; i < 4; i++){
                let adjr = c[0] + dRow[i];
                let adjc = c[1] + dCol[i];
                let newPath = path.slice();  //creating a copy of the path to do further calculations (because in JavaScript we cant just equal it).

                if(isValid(arr, vis, adjr, adjc)){
                    newPath.push([adjr, adjc]);   //adding the new explored cell in the path.
                    q.push([newPath, count]);    //inserting the path and path delay.

                    spread_colour(newPath, count);  //colour the spread.

                    vis[adjr][adjc] = 1;   //mark it visited.
                }
            }
        }
        return false;    //if not found any path then.
    }

    //initializing the matrix.
    if(arr.length == 0){
        for(let i = 0; i < ROW; i++){
            let arr1 = [];
            for(let j = 0; j < COL; j++){
                arr1.push(0);
            }
            arr.push(arr1);
        }
    }

    //initializing the visited matrix.
    for(let i = 0; i < ROW; i++){
        let arr1 = [];
        for(let j = 0; j < COL; j++){
            arr1.push(0);
        }
        vis.push(arr1);
    }

    bfs(arr, vis, 0, 0);
}

//Maze generation algorithm
function Generate(){
    Reset();
    arr = [];
    let vis_gen = [];

    //visited ar initialisation (with all cells as obstacles)
    for(let i = 0; i < ROW; i++){
        let arr1 = [];
        for(let j = 0; j < COL; j++){
            arr1.push(0);
        }
        vis_gen.push(arr1);
    }

    //arr initialisation
    for(let i = 0; i < ROW ; i++){
        let arr1 = [];
        for(let j = 0; j < COL; j++){
            arr1.push(1);
        }
        arr.push(arr1);
    }

    //RNG for chances of connecting to other paths(i.e. making it on an invalid path.)
    function random(){
        let a = Math.random();
        if(a < 0.01){
            return false;
        }
        else{
            return true;
        }
    }

    //checks if the adjacent path is invalid(i.e. it does not connect to another path.)
    function isValid(r, c, cell){
        if(r < 0 || c < 0){
            return false;
        }
        else if(r >= ROW || c >= COL){
            return false;
        }
        else if(vis_gen[r][c] == 1){
            return false;
        }
        else{
            for(let i = 0; i < 4; i++){
                let cR = r + dRow[i];
                let cC = c + dCol[i];

                if(cR < 0 || cC < 0){
                    return true;
                }
                else if(cR >= ROW || cC >= COL){
                    return true;
                }
                else if(cR != cell[0] && cC != cell[1] && arr[cR][cC] == 0){
                    return false;
                }
            }
            return true;
        }
    }

    //checks the end of that specific path generation (i.e. no adjacent cells are valid).
    function checkEnd(r, c){
        let ret = 0;
        
        for(let i = 0; i < 4; i++){
            let cR = r + dRow[i];
            let cC = c + dCol[i];

            if(cR < 0 || cC < 0){
                continue;
            }
            else if(cR >= ROW || cC >= COL){
                continue;
            }
            else if(arr[cR][cC] == 0){
                ret++;
            }
        }

        //if yes, it still joins some paths to create multiple solutions using the random number generator.
        if(ret > 1){
            return random();
        }
        else{
            return false;
        }
    }

    //stack for dfs maze generation
    s = [];

    s.push([0,0]);

    while(s.length != 0){

        let pick = Math.round(Math.random() * 3);

        let c = s[s.length - 1];    //top of the sack.

        if(checkEnd(c[0], c[1])){   //if checkend is false, then pop.(i.e. it checks for a cell in the path which has valid adjacent cells.)
            s.pop();
            continue;
        }
        
        arr[c[0]][c[1]] = 0;   //removes the obstacle in the current cell.
        vis_gen[c[0]][c[1]] = 1;

        s.pop();

        for(let i = 0; i < 4; i++){
            let adjr = c[0] + dRow[pick];
            let adjc = c[1] + dCol[pick];

            if(isValid(adjr, adjc, c)){
                s.push([adjr, adjc]);
            }

            pick = (pick + 1) % 4;
        }
    }

    //colour the obstacles.
    colour();
}

function Reset(){
    vis = [];
    arr = [];
    Draw();
}