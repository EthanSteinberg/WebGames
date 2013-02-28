(function(){
"use strict";

window.onload = function(){ 
    console.log("Hello peeps");
	
	
	
	
	var game = new TetrisGame();
	window.game = game;
	
	
	
};

function TetrisGame()
{
	this.canvas = document.getElementById("gameCanvas");
	this.ctx = this.canvas.getContext("2d");
	
	this.width = this.canvas.width;
	this.height = this.canvas.height;

	this.score = 0;
	
	document.onkeydown = this.keydown.bind(this);

	
	
	this.blockWidth = this.width/12;
	this.blockHeight = this.height/22;
	
	
	this.state = new Array(20);
	for (var y = 0; y < this.state.length; y++)
	{
		this.state[y] = new Array(10);
		for (var x =0 ; x < this.state[y].length; x++)
		{
			this.state[y][x] = "";
		}
	}


	this.getNewPiece();


	this.startMainLoop();


}


TetrisGame.prototype.colorsArray = [

	"green",
	"blue",
	"purple",
	"red",
	"yellow",
	"orange"

]


TetrisGame.prototype.piecesArray = [

	[ //T
		[0,0],
		[-1,0],
		[0,-1],
		[1,0]

	],

	[ //J
		[0,0],
		[-1,-1],
		[-1,0],
		[1,0]

	],

	[ //L
		[0,0],
		[1,-1],
		[-1,0],
		[1,0]

	],	

	[ //S
		[0,0],
		[-1,0],
		[0,-1],
		[1,-1]

	],

	[ //Z
		[0,0],
		[-1,-1],
		[0,-1],
		[1,0]

	],

	[ //I
		[0,0],
		[-1,0],
		[1,0],
		[2,0]

	],

	[ // O
		[0,0],
		[0,-1],
		[1,0],
		[1,-1]

	]

]

TetrisGame.prototype.blocking = function()
{
	for (var i = 0; i < this.currentPiece.offsets.length;i++)
	{
		var offset = this.currentPiece.offsets[i];
		var yPos = Math.ceil(this.currentPiece.y)+offset[1];
		var row = this.state[yPos];
		if (yPos>19 || row && row[this.currentPiece.x+offset[0]] !== "")
		{
			return true;
		}
	}

	return false;

};

TetrisGame.prototype.keydown = function(evt)
{
	switch(evt.which)
	{
		case 37: // Left arrow
			this.currentPiece.x-=1;
			if (this.blocking())
				this.currentPiece.x+=1;
			break;
		case 39: // Right arrow
			this.currentPiece.x+=1;
			if (this.blocking())
				this.currentPiece.x-=1;
			break;

		case 38: // Up arrow
			this.rotateLeft();
			if (this.blocking())
				this.rotateRight();
			break;

		case 40:// Down arrow
			this.rotateRight();
			if (this.blocking())
				this.rotateLeft()
			break;

		case 32: //Space bar
			this.currentPiece.y += 1;
			if (this.blocking())
			{
				this.currentPieceReachedTarget();
			}

	}
};

TetrisGame.prototype.rotateLeft = function()
{
	for (var i = 0; i < this.currentPiece.offsets.length;i++)
		{
			var offset = this.currentPiece.offsets[i];

			this.currentPiece.offsets[i] = [offset[1],-offset[0]]
		}
};

TetrisGame.prototype.rotateRight = function()
{
	for (var i = 0; i < this.currentPiece.offsets.length;i++)
	{
		var offset = this.currentPiece.offsets[i];

		this.currentPiece.offsets[i] = [-offset[1],offset[0]]
	}
};



TetrisGame.prototype.startMainLoop = function()
{
	var captureThis = this;
	
	window.requestAnimationFrame(function(time)
	{
		captureThis.lastTime = time;
		captureThis.mainLoop(time);
	});
		
};

TetrisGame.prototype.mainLoop = function(time)
{
	
	var captureThis = this;
	window.requestAnimationFrame(function(time)
	{
		captureThis.mainLoop(time);
	});
	
	
	var delta = time - this.lastTime;
	this.lastTime = time;
	
	this.update(delta);
	this.draw();
};

TetrisGame.prototype.draw = function()
{
	this.ctx.clearRect(0,0,this.width,this.height);
	
	this.drawBorder();
	
	if (this.currentPiece)
	{
		this.drawCurrentPiece();
	}
	
	this.drawPiecesOnBoard();

};


TetrisGame.prototype.drawPiecesOnBoard = function()
{
	for (var y = 0; y < this.state.length; y++)
	{
		for (var x= 0 ; x < this.state[y].length;x++)
		{
			if (this.state[y][x] !== "")
			{
				this.ctx.fillStyle = this.state[y][x];
				this.drawSquare(x,y);
			}
		}
	}
};

TetrisGame.prototype.drawCurrentPiece = function()
{
	this.ctx.fillStyle = this.currentPiece.color;
	for (var i = 0; i < this.currentPiece.offsets.length;i++)
	{
		var offset = this.currentPiece.offsets[i];
		this.drawSquare(this.currentPiece.x+offset[0], this.currentPiece.y+offset[1]);
	}
};

TetrisGame.prototype.drawBorder = function()
{
	this.ctx.fillStyle = 'black';
	this.ctx.strokeRect(this.blockWidth,2*this.blockHeight,10*this.blockWidth,20*this.blockHeight);
};

TetrisGame.prototype.drawSquare = function(x,y)
{
	
	this.ctx.fillRect((x+1) * this.blockWidth,(y+2) *this.blockHeight,this.blockWidth,this.blockHeight);

	var oldColor = this.ctx.fillStyle;
	this.ctx.fillStyle = 'black';
	this.ctx.strokeRect((x+1) * this.blockWidth,(y+2) *this.blockHeight,this.blockWidth,this.blockHeight);
	this.ctx.fillStyle = oldColor;
};
	

TetrisGame.prototype.update = function(delta)
{

	this.currentPiece.y += delta * 0.0050;
	if (this.blocking())
	{
		this.currentPieceReachedTarget();
	}
	
};


TetrisGame.prototype.getNewPiece = function()
{
	this.currentPiece = {
		y: -1,
		x: 5,
		color: this.colorsArray[Math.floor(Math.random() *this.colorsArray.length) ],
		offsets: Object.create(this.piecesArray[Math.floor(Math.random() *this.piecesArray.length)])
	};
};

TetrisGame.prototype.checkBoard = function()
{
	var scoreMultiplier = 1;

	for (var y = this.state.length-1; y >= 0; y--)
	{
		var rowGood = true;
		for (var x = 0; x < this.state[y].length; x++)
		{
			if (this.state[y][x] === "")
			{
				rowGood = false;
				break;
			}
		}

		if (rowGood)
		{
			this.score+= 100 * scoreMultiplier;
			this.scoreMultiplier *= 2;
			for (var newY = y; newY >= 1; newY--)
			{
				this.state[newY] = this.state[newY-1]
			}
			this.state[0] = new Array(10);
			for (var otherX = 0; otherX < this.state[0].length; otherX++)
			{
				this.state[0][otherX] = "";
			}
			y++;

			this.updateScore();
		}
	}

	
}

TetrisGame.prototype.updateScore = function()
{
	var scoreText = document.getElementById("scoreText");
	scoreText.innerHTML = "Score: " + this.score;


};

TetrisGame.prototype.currentPieceReachedTarget = function()
{
	this.currentPiece.y = Math.ceil(this.currentPiece.y)-1;
	for (var i = 0; i < this.currentPiece.offsets.length;i++)
	{
		var offset = this.currentPiece.offsets[i];
		this.state[this.currentPiece.y+offset[1]][this.currentPiece.x+offset[0]] = this.currentPiece.color;
	}

	this.checkBoard();

	this.getNewPiece();
};
	

}());