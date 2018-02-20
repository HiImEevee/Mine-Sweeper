var arr;
var n=10, m=10;
var l = 20;
var options = [];
var totalMines = 50;

var btn;

function setup() { 
  createCanvas(401, 401);
	btn = createButton("Restart");
	btn.style('display', 'block');
	btn.style('padding', '3px 10px 3px 10px');
	btn.mousePressed(Restart);
	n = floor(height / l);
	m = floor(width / l);
	arr = make2DArray(n, m);
	for(var i = 0 ; i < n; i++) {
		for(var j = 0; j < m; j++) {
			arr[i][j] = new Cell(i, j, l);
		}
	}
	
	Restart();
} 

function draw() { 
	background(255);
	Win = true;
	for(var i = 0 ; i < n; i++) {
		for(var j = 0; j < m; j++) {
			arr[i][j].show();
			if(arr[i][j].mine && !arr[i][j].revealed) {
				Win = false;
			}
		}
	}
}

function mousePressed() {
	for(var i = 0; i < n; i++) {
		for(var j = 0; j < m; j++) {
			if(arr[i][j].contains(mouseX, mouseY)) {
				Fill(i, j);
				if(arr[i][j].mine) {
					GameOver();
					console.log("MEH!");
				}
			}
		}
	}
}

function Restart() {
	for(var i = 0; i < n;i++) {
		for(var j = 0; j < m; j++) {
			arr[i][j].mine = false;
			arr[i][j].revealed = false;
			arr[i][j].neighbourCount = 0;
		}
	}
	
	for(var i = 0; i < n; i++) {
		for(var j = 0; j < m; j++) {
			options.push([i, j]);
		}
	}
	
	for(var x = 0; x < totalMines; x++) {
    var index = floor(random(options.length));
    var choice = options[index];
    var i = choice[0];
    var j = choice[1];
    options.splice(index, 1);
    arr[i][j].mine = true;
  }
	
	for(var i = 0; i < n; i++) {
		for(var j = 0 ; j < m; j++) {
			arr[i][j].countNeighbours();
		}
	}
}

function GameOver() {
	for(var i = 0; i < n; i++) {
		for(var j = 0; j < m; j++) {
			arr[i][j].revealed = true;
		}
	}
}

function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function Cell(i, j, l) {
	this.i = i;
	this.j = j;
	this.l = l;
	this.x = this.i* this.l;
	this.y = this.j * this.l;
	this.neighbourCount = 0;
	this.mine = false;
	this.revealed = false;
}

Cell.prototype.show = function() {
	stroke(0);
	noFill();
	rect(this.x, this.y, this.l, this.l);
	if(this.revealed) {
		if(this.mine) {
			fill(127);
			ellipse(this.x + this.l / 2, this.y + this.l /2, this.l/2);
		} else {
			fill(200);
			rect(this.x, this.y, this.l, this.l);
			if(this.neighbourCount > 0) {
				textAlign(CENTER);
				fill(0);
				text(this.neighbourCount, this.x + this.l/2, this.y + this.l*4/5);
			}
		}
	}
}

Cell.prototype.countNeighbours = function() {
  if (this.bee) {
    this.neighbourCount = -1;
    return;
  }
  for(var xoff = -1; xoff <= 1 ; xoff++) {
		for(var yoff = -1; yoff <= 1; yoff++) {
			if(this.i + yoff >= 0 && this.i + yoff < n && this.j + xoff >= 0 && this.j + xoff < m) {
				if(arr[this.i + yoff][this.j + xoff].mine) {
					this.neighbourCount++;
				}
			}
		}
	}
	if(this.mine) {
		this.neighbourCount--;
	}
}
Cell.prototype.contains = function(x, y) {
  return (x > this.x && x < this.x + this.l && y > this.y && y < this.y + this.l);
}

function Fill(i, j) {
	arr[i][j].revealed = true;
	if(arr[i][j].neighbourCount == 0) {
		for(var xoff = -1; xoff <= 1; xoff++) {
			for(var yoff = -1; yoff <= 1; yoff++) {
				if(i + yoff >= 0 && i + yoff < n && j + xoff >= 0 && j + xoff < m) {
					if(!arr[i+yoff][j+xoff].revealed) {
						Fill(i + yoff, j + xoff);
					}
				}
			}
		}
	}
}