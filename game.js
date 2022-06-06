class Figure {
    constructor(coord) {
        this.prev_coord = coord;
        this.coord = coord;
        this.id = coord;
        this.img = document.getElementById(coord).innerHTML;

    }

    changeCoord(coord) {
        this.prev_coord = this.coord;
        this.coord = coord;
    }

    printFigure(disappeared = false) {
            document.getElementById(this.coord).innerHTML = this.img;
            if (this.coord != this.prev_coord){
                document.getElementById(this.prev_coord).innerHTML = "";
            }
        return;
    }

    getCoord(){
        return this.coord;
    }

}

class Game {
    constructor(undo_stack) {
        this.figures = [];
        this.text = "";
        this.current_move = 1;
        this.moves_numb = 0;
        this.undo_stack = undo_stack;
    }
    setText(text_game){
        this.text = text_game;
        let text_copy = text_game;
        this.moves_numb = text_copy.split(".").length - 1
    }
    createFigures() {
        var numbs = ["1", "2", "7", "8"];
        var words = ["a", "b", "c", "d", "e", "f", "g", "h"];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 8; j++) {
                let figure = new Figure(words[j] + numbs[i]);
                this.figures.push(figure);
            }
        }
    }
    checkFigures(f_coord){
        for (var fgr in this.figures){
            if (this.figures[fgr].coord == f_coord){
               this.figures[fgr].disappeared = true;
               return true;
            }
        }
        return false;
    }

    getMove(move_type){
        console.log(this.current_move);
        let numb = String(this.current_move) + ".";
        let str = this.text.slice(this.text.indexOf(numb), this.text.indexOf(numb) + 14);
        console.log(str);
            var begin1 = str.slice(3, 5);
            var end1 = str.slice(6, 8);
            if (str.slice(9, 10) == "X") {
                var begin2 = end1;
                var end2 = end1;
            }
            else{
                var begin2 = str.slice(9, 11);
                var end2 = str.slice(12, 14);
            }
            if (move_type == "next") {
                var moves = [begin1, end1, begin2, end2];
                this.current_move += 1;
            }
        console.log(moves);
        return moves;
    }
    copyArray(){
        var new_array = [];
        for (let i in this.figures){
            let new_fgr = new Figure(this.figures[i].coord);
            new_fgr.prev_coord = this.figures[i].prev_coord;
            new_array.push(new Figure(this.figures[i].coord));
        }
        return new_array;
    }
    makeMove(move_type){
        this.undo_stack.pushState(this.copyArray());
        var moves = this.getMove(move_type);
        console.log(this.figures);
        for (var fgr in this.figures){
            if (this.figures[fgr].coord == moves[0]) {
                this.figures[fgr].changeCoord(moves[1]);
                this.figures[fgr].printFigure();

            }
        }
        setTimeout(() => {
        for (var fgr in this.figures){
            if (this.figures[fgr].coord == moves[2] && moves[2] != moves[3]) {
                this.figures[fgr].changeCoord(moves[3]);

                this.figures[fgr].printFigure();
        }
        }}


           ,1000 );

        return;
    }
    clearField(){
        for (var fgr in this.figures){
            document.getElementById(this.figures[fgr].coord).innerHTML = "";
        }
    }
    makeBackMove(){
        this.clearField();
        let res = this.undo_stack.popState();
        if (res != null){
            this.figures = res;
            this.current_move -=1;
            return true;
        }
        else {
            return false;
        }
    }
    againMove(){
        let res = true;
        while(res == true){
            res = this.makeBackMove();
            if (this.undo_stack.states.length == 0){
                break;
            }
        }
    }
}

class Undo {
    constructor(){
        this.states = [];
    }
    pushState(state){
        this.states.push(state);
    }
    popState(){
        if (this.states.length != 0){
            let last_figures = this.states.pop();
            for (var fgr in last_figures){
                last_figures[fgr].printFigure();
            }
            return last_figures;
        }
        else{
            return null;
        }
    }

}


var undo = new Undo();
var game = new Game(undo);


function readFile() {
    let file = document.getElementById("loadedfile").files[0];
    let textarea = document.querySelector('textarea');
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split(/ | /);
        textarea.value = lines.join(' ');
        game.setText(lines.join(' '));
    }
    reader.onerror = function() {
        console.log(reader.error);
    }
    game.createFigures();
}

function move(){
    game.makeMove("next");
    return;
}

function backMove(){
    game.makeBackMove();
    return;
}

function moveAgain(){
    game.againMove();
    return;
}





