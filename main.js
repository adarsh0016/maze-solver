let ROW;
let COL;

let ms;

let bgColour = "#30363d";
let obstacle_colour = "white";
let path_colour = "  #33ccff";
let spread1_colour = "#c93328";
let spread2_colour = "#691a15";
let spread3_colour = "#360e0b";

let arr = [];
let vis = [];

var dRow = [-1, 0, 1, 0];
var dCol = [0, 1, 0, -1];


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
ms = 40 - Speed_slider.value;

Speed_slider.oninput = function() {
    speed.innerHTML = this.value;
    ms = 40 - this.value;
}

function Draw(){
    if(arr.length == 0){
        for(let i = 0; i < ROW; i++){
            let arr1 = [];
            for(let j = 0; j < COL; j++){
                arr1.push(0);
            }
            arr.push(arr1);
        }
    }

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

    //making obstacles
    var x = document.getElementById("mytable").getElementsByTagName("td");
    for(let i = 0; i < ROW * ROW - 1; i++){
        x[i].onclick = function(){
            if(arr[~~(i/ROW)][i%ROW] == 0){
                x[i].style.backgroundColor = obstacle_colour;
                arr[~~(i/ROW)][i%ROW] = 1;
            }
            else{
                x[i].style.backgroundColor = bgColour;
                arr[~~(i/ROW)][i%ROW] = 0;
            }
        };
    }
}

function Start(){
    vis = [];
    
    function colour(){
        for(let i = 0; i < ROW; i++){
            for(let j = 0; j < COL; j++){
                if(arr[i][j] == 1){
                    var x = document.getElementById("mytable").getElementsByTagName("td");
                    x[i*ROW + j].style.backgroundColor = obstacle_colour;
                }
                else{
                    var x = document.getElementById("mytable").getElementsByTagName("td");
                    x[i*ROW + j].style.backgroundColor = bgColour;
                }
            }
        }
    }

    colour();

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

    function printPath(path, count){
        for(let i = 0; i < path.length; i++){
            var x = document.getElementById("mytable").getElementsByTagName("td");
            setTimeout(function(){
                x[path[i][0]*ROW + path[i][1]].style.backgroundColor = path_colour;
            }, (count + i/4) * ms);
        }
    }

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

    function bfs(arr, vis, row, col){
        var q = [];

        if(isValid(arr, vis, row, col)){
            q.push([[[row, col]],0]);
            vis[row][col] = true;
        }
        else{
            return false;
        }

        let count = 0;

        while(q.length != 0){
            var path = q[0][0];
            count = q[0][1];
            var c = path[path.length - 1];

            if(c[0] == ROW - 1 && c[1] == COL - 1){
                printPath(path, count);
                return true;
            }

            q.shift();

            count++;

            for(let i = 0; i < 4; i++){
                let adjr = c[0] + dRow[i];
                let adjc = c[1] + dCol[i];
                let newPath = path.slice();

                if(isValid(arr, vis, adjr, adjc)){
                    newPath.push([adjr, adjc]);
                    q.push([newPath, count]);

                    spread_colour(newPath, count);

                    vis[adjr][adjc] = 1;
                }
            }
        }
        return false;
    }

    for(let i = 0; i < ROW; i++){
        let arr1 = [];
        for(let j = 0; j < COL; j++){
            arr1.push(0);
        }
        arr.push(arr1);
    }


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

    //visited ar initialisation
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

    function random(){
        let a = Math.random();
        if(a < 0.01){
            return false;
        }
        else{
            return true;
        }
    }

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

        let c = s[s.length - 1];

        if(checkEnd(c[0], c[1])){
            s.pop();
            continue;
        }
        
        arr[c[0]][c[1]] = 0;
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

    function colour(){
        for(let i = 0; i < ROW; i++){
            for(let j = 0; j < COL; j++){
                if(arr[i][j] == 1){
                    var x = document.getElementById("mytable").getElementsByTagName("td");
                    x[i*ROW + j].style.backgroundColor = obstacle_colour;
                }
                else{
                    var x = document.getElementById("mytable").getElementsByTagName("td");
                    x[i*ROW + j].style.backgroundColor = bgColour;
                }
            }
        }
    }

    colour();
}

function Reset(){
    vis = [];
    arr = [];
    Draw();
}