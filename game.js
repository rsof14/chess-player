class Figure {
    constructor(coord) {
        this.prev_coord = coord;
        this.back_coord = "";
        this.coord = coord;
        this.id = coord;
        this.img = document.getElementById(coord).innerHTML;
        this.disappeared = false;
        this.win = false;
    }

    changeCoord(coord) {
        this.prev_coord = this.coord;
        this.coord = coord;
    }

    printFigure(disappeared = false) {
        if (disappeared == false) {
            this.disappeared = false;
            this.win = false;
            document.getElementById(this.coord).innerHTML = this.img;
            if (this.coord != this.prev_coord){
                document.getElementById(this.prev_coord).innerHTML = "";
            }
        }
        else {
            this.disappeared = true;
        }
        return;
    }

    getCoord(){
        return this.coord;
    }

}

class Game {
    constructor() {
        this.figures = [];
        this.text = "";
        this.current_move = 1;
        this.moves_numb = 0;
        this.disappeared_figure = null;
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
    getMove(move_type){
        if (move_type == "next"){
            if ( this.current_move <= this.moves_numb){
                this.current_move = this.current_move;;}
            else{
                return;
            }
        } else if (move_type == "prev"){
            if (this.current_move > 1) {
                this.current_move -= 1;}
            else{
                return;}
        } else if (move_type == "again") {
            while (this.current_move > 1){
                console.log(this.current_move);
                this.makeMove("prev");
            }
            return;
        }
        console.log(this.current_move);
        let numb = String(this.current_move) + ".";
        let str = this.text.slice(this.text.indexOf(numb), this.text.indexOf(numb) + 14);
        console.log(str);
        if (str.indexOf("X") == -1) {
            var begin1 = str.slice(3, 5);
            var end1 = str.slice(6, 8);
            var begin2 = str.slice(9, 11);
            var end2 = str.slice(12, 14);
            if (move_type == "next") {
                var moves = [begin1, end1, begin2, end2];
                this.current_move += 1;
            }
            else if (move_type == "prev") {
                var moves = [end1, begin1, end2, begin2];
            }
        }
        else{
            var begin1 = str.slice(3, 5);
            var end1 = str.slice(6, 8);
            if (str.slice(9, 11) == "X") {
                var begin2 = end1;
                var end2 = end1;
                this.disappeared_figure = document.getElementById(end1).innerHTML;
            }
            else{
                var begin2 = str.slice(9, 11);
                var end2 = str.slice(12, 14);
            }
            if (move_type == "next") {
                var moves = [begin1, end1, begin2, end2];
                this.current_move += 1;
            }
            else if (move_type == "prev") {
                var moves = [end1, begin1, end2, begin2];
            }

        }
        console.log(moves);
        return moves;
    }
    makeMove(move_type){
        var moves = this.getMove(move_type);
        console.log(this.figures);
        for (var fgr in this.figures){
            if (this.figures[fgr].coord == moves[0] && this.figures[fgr].disappeared == false) {
                this.figures[fgr].changeCoord(moves[1]);
                this.figures[fgr].printFigure();
                if (moves[1] == moves[2]){
                    this.figures[fgr].win = true;
                }
            }
            if (this.figures[fgr].coord == moves[2] && this.figures[fgr].win == false) {
                this.figures[fgr].changeCoord(moves[3]);
                if (moves[2] == moves[3] && this.figures[fgr].disappeared == false){
                   this.figures[fgr].printFigure(true);
                }
                else {
                    this.figures[fgr].printFigure();
                }

            }
        }
        return;
    }
}



var game = new Game();

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
    game.makeMove("prev");
    return;
}

function moveAgain(){
    game.makeMove("again");
    return;
}





