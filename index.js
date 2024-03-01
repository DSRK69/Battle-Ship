// Ships

class Ship {
    constructor (name, length, headCoord) {
        this.name = name;
        this.length = length;
        this.hits = 0;
        this.sunk = false;
        this.coord = this.shipCoords(headCoord);
    }

    hit () {
        this.hits++;
        this.isSunk();
    }

    isSunk () {
        if (this.hits >= this.length) {
            this.sunk = true;
        }
    }

    shipCoords (headCoord) {
        let shipCoords = [];
        shipCoords.push(headCoord);
        for (let i = 1; i < this.length; i++) {
            shipCoords.push([headCoord[0], headCoord[1] + i]);
        }
        if (this.checkShipCoords(shipCoords)) {
            return shipCoords;
        } else {
            return undefined;
        }
    }

    checkShipCoords (coords) {
        for (let i = 0; i < coords.length; i++) {
            if (coords[i][0] > 10 || coords[i][1] > 10) {
                return false;
            }
        }
        return true;
    }
}

// Board

class GameBoard {
    constructor () {
        this.coordList = this.createBoardCoords();
        this.shipCoordList = [];
        this.hitCoordList = [];
        this.shipList = [];
    }

    createBoardCoords () {
        let boardCoords = [];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                boardCoords.push([i, j]);
            }
        }
        return boardCoords;
    }

    createNewShip (name, length, headCoord) {
        if (this.checkShipCollision (headCoord, length)) {
            let ship = new Ship (name, length, headCoord);
            this.shipList.push(ship);
            for (let i = 0; i < ship.coord.length; i++) {
                this.shipCoordList.push(ship.coord[i]);
            }
            console.log(ship);
        } else {
            console.log('Your Boats Are Colliding\n Choose Another Coordinate');
        }
    }

    checkShipCollision (headCoord, length) {
        let newShipCoords = [];
        for (let i = 0; i < length; i++) {
            newShipCoords.push([headCoord[0], headCoord[1] + i]);
        }
        for (let j = 0; j < this.shipCoordList.length; j++) {
            for (let k = 0; k < newShipCoords.length; k++) {
                if (this.checkCoordEquality(this.shipCoordList[j], newShipCoords[k])) {
                    return false
                }
            }
        }
        return true
    }

    receiveAttack (coord) {
        this.hitCoordList.push(coord);

        for (let i = 0; i < this.shipCoordList.length; i++) {
            if (this.checkCoordEquality(coord, this.shipCoordList[i])) {
                this.checkShipHit(coord);
                this.shipCoordList[i] = ['X', 'X'];
                if (this.checkGameOver()) {
                    gameOver = true;
                }
                // You can output the ship objects here
                console.log(this.shipList);
            }
        }
        return false;
    }

    checkShipHit (coord) {
        for (let i = 0; i < this.shipList.length; i++) {
            for (let j = 0; j < this.shipList[i].coord.length; j++) {
                if (this.checkCoordEquality(coord, this.shipList[i].coord[j])) {
                    this.shipList[i].hit();
                }
            }
        }
    }

    checkGameOver () {
        for (let i = 0; i < this.shipList.length; i++) {
            if (this.shipList[i].sunk == true) {
                continue
            } else {
                return false;
            }
        }
        return true;
    }
    
    checkCoordEquality (coord1, coord2) {
        if (coord1[0] == coord2[0] && coord1[1] == coord2[1]) {
            return true;
        }
        return false;
    }
}

// Players

let gameOver;
let turnNum;
let gameBoard;

function newGame (player1, player2) {
    console.log('New Game Started');
    gameBoard = new GameBoard;
    turnNum = 0;
    gameOver = false;
    let ship1 = gameBoard.createNewShip('rowBoat', 3, [6, 2]);
    //let ship2 = gameBoard.createNewShip('smallCruise', 2, [4, 3]);
    //let ship3 = gameBoard.createNewShip('biggerCruise', 5, [9, 2]);
    //let ship4 = gameBoard.createNewShip('poolNoodle', 1, [9, 4]);
    //let ship5 = gameBoard.createNewShip('niceYacht', 3, [1, 8]);
    playerTurns(player1, player2);
}

function playerTurns (player1, player2) {
    if (turnNum % 2 == 0) {
        console.log(player1);
        let currentX = prompt('choose a X coordinate');
        let currentY = prompt('choose a Y coordinate');
        let coord = turnStringToCoord(currentX, currentY);
        gameBoard.receiveAttack(coord);

    } else {
        console.log(player2);
        let currentX = prompt('choose a X coordinate');
        let currentY = prompt('choose a Y coordinate');
        let coord = turnStringToCoord(currentX, currentY);
        gameBoard.receiveAttack(coord);
    }
    turnNum++;
    if (gameOver == false) {
        playerTurns(player1, player2);
    } else {
        console.log('game over');
    }
}

function turnStringToCoord (coordX, coordY) {
    if (coordX <= 10 && coordY <= 10 
    && coordX >= 0 && coordY >= 0) {
        let coord = [+coordX, +coordY];
        return coord;
    } else {
        return undefined;
    }
}

// Start New Game

newGame('me', 'AI');