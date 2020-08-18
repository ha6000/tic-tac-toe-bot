/** 
 * Tic Tac Toe
 * By Harry Kruger
 * Copyright MIT
**/

const TOP = ''.padStart(7, '⬜');
const SEPERATOR = '⬜';

const INCORRECTFORMAT = 'Incorrect format';
const TOOBIG = 'Use value below 3'
const CELLOCCUPIED = 'Position is already occupied';

function exit(code = 0) {
	return process.exit(code);
}

function every(arr = []) {
	let allElements;
	for (var i = 0; i < arr.length; i++) {
		const value = arr[i];
		if (typeof value == 'undefined') return;
		if (typeof allElements == 'undefined') {
			allElements = value;
			continue;
		}
		if (allElements != value) return;
	}
	
	return allElements;
}

function askMove() {
	return new Promise((res, rej) => {
		readline.question(`Player ${this.currentPlayerData.display} make a move: `, (move) => {
			res(move);
		});
	});
}

class Game {
	players = {
		'x': {
			display: '🇽'
		},
		'o': {
			display: '🇴'
		}
	}
	get playerData() {
		return Object.values(this.players);
	}
	get playerNames() {
		return Object.keys(this.players);
	}
	currentPlayer = 0;
	playerCycle = (function*(playerNames, n) {
		let currentPlayer = n;
		while(true) {
			currentPlayer++;
			if (currentPlayer > playerNames.length - 1) currentPlayer = 0;
			yield currentPlayer;
		}
	})(this.playerNames, this.currentPlayer);
	board = [
		[undefined, undefined, undefined],
		[undefined, undefined, undefined],
		[undefined, undefined, undefined]
	]
	running = false;
	constructor(say = console.log, ask = askMove) {
		this.say = say;
		this.ask = ask;
	}
	getMove() {
		return new Promise(async (res, rej) => {
			const move = await this.ask();
			const parts = move.split('-');
			if (parts.length < 2) return rej(INCORRECTFORMAT);
			let x,y;

			x = parseInt(parts[0]) - 1;
			y = parseInt(parts[1]) - 1;
			if (isNaN(x) || isNaN(y)) return rej(INCORRECTFORMAT)

			if (0 > x || y > 2) return rej(TOOBIG);
			if (0 > y || y > 2) return rej(TOOBIG);
			if (typeof this.getCell(x, y) != 'undefined') return rej(CELLOCCUPIED);
			res({
				x,
				y
			});
		})
		.catch(async err => {
			if (typeof err == 'string') {
				this.say(err);
				return this.getMove();
			}
			else throw err;
		});
	}
	validate() {
		let winner;
		if (this.board.every(row => row.every(cell => cell != undefined))) {
			return null;
		};
		// Check rows
		for (const row of this.board) {
			winner = every(row);
			if (typeof winner != 'undefined') return winner;
		}
		// Check columns
		for (let columnN = 0; columnN < 3; columnN++) {
			const column = this.board.map(row => row[columnN]);
			winner = every(column);
			if (typeof winner != 'undefined') return winner;
		}
		// Check diags
		const diagA = [this.board[0][0], this.board[1][1], this.board[2][2]];
		winner = every(diagA);
		if (typeof winner != 'undefined') return winner;
		const diagB = [this.board[0][2], this.board[1][1], this.board[2][0]];
		winner = every(diagA);
		if (typeof winner != 'undefined') return winner;
	}
	async mainloop() {
		this.running = true;
		while (this.running) {
			this.draw();
			let winner = this.validate();
			if (typeof winner != 'undefined') {
				if (winner == null) {
					this.say('Draw!');
				}
				else {
					this.say(`Player ${this.playerData[winner].display} won!`);
				}
				this.running = false;
				break;
			} 
			const move = await this.getMove();
			this.setCell(move.x, move.y, this.currentPlayer);
			this.currentPlayer = this.playerCycle.next().value;
		}
	}
	render() {
		return `${TOP}\n${this.board.map(row => {
			return `${SEPERATOR}${row.map(p => {
					const data = this.playerData[p]
					let display = '⬛';
					if (data) display = data.display;
					return display;
				}).join(SEPERATOR)}${SEPERATOR}`;
		}).join(`\n${TOP}\n`)}\n${TOP}`;
	}
	draw() {
		return this.say(this.render());
	}
	getCell(x, y) {
		return this.board[x][y];
	}
	setCell(x, y, v) {
		return this.board[x][y] = v;
	}
	get currentPlayerData() {
		return this.playerData[this.currentPlayer];
	}
}

module.exports = Game