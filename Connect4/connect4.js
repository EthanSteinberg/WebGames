(function(){
"use strict";

window.onload = function(){ 
    console.log("Hello peeps");
	
	
	
	
	var game = new Connect4Game();
	window.game = game;
	
	
	
};

function Connect4Game()
{
	
	
	this.canvas = document.getElementById("gameCanvas");
	
	
	this.canvas.onmousemove =  function (evt)
	{
		var x = evt.clientX - this.canvas.getBoundingClientRect().left;
		var y = evt.clientY - this.canvas.getBoundingClientRect().top;
		this.setMousePosition( x / (this.width/7), y / ( this.height/8) );
	}.bind(this);
	
	this.canvas.onmouseout =  function()
	{
		delete this.x;
	}.bind(this);
	
	this.canvas.onclick =  function()
	{
		this.clickHappened();
		
	}.bind(this);
	
	this.ctx = this.canvas.getContext("2d");
	
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	
	this.init();
	
	this.startMainLoop();
	
	
}



Connect4Game.prototype.didWin = function(lastX,lastY)
{
	var self = this;
	var color = this.color;
	function countInDirection(xOfset,yOfset)
	{
		var total = 1;
		var xPos  = lastX;
		var yPos = lastY;
		while (true)
		{
			
			xPos += xOfset;
			yPos += yOfset;
			
			if (xPos <0 || xPos >=7 || yPos<0 || yPos >= 7 || self.state[yPos][xPos] !== color)
			{
				break;
			}
			
			total++;
		}
		
		xPos  = lastX;
		yPos = lastY;
		while (true)
		{
			xPos -= xOfset;
			yPos -= yOfset;
			
			if (xPos <0 || xPos >=7 || yPos<0 || yPos >= 7 || self.state[yPos][xPos] !== color)
			{
				break;
			}
				
				
			total++;
		}
		
		return total;
	}
	
	var yOptions = [-1,0,1];
	var xOptions = [-1,0,1];
	
	for (var i =0; i < 3;i ++)
	{
		
		var f= yOptions[i];
		for (var j = 0; j < 3; j++)
		{
			var g = xOptions[j];
			
			if (f !== 0 || g !== 0)
			{
				if (countInDirection(f,g) >= 4)
				{
					return true;
				}
			}
		}
	}
	
	return false;
};
		
			
Connect4Game.prototype.init = function()
{
	this.state = new Array(7);
	for (var i = 0; i < 7; i++)
	{
		this.state[i] = new Array(7);
		for (var j = 0; j <7 ;j++)
		{
			this.state[i][j] = -1;
		}
	}
	
	
	this.color = 0;
	if (this.gameOver)
	{
		delete this.gameOver;
	}
	if (this.currentToken)
	{
		delete this.currentToken;
	}
};
		
	

Connect4Game.prototype.clickHappened = function()
{
	if (this.gameOver)
	{
		this.init();
		return;
	}

	
	
	if (this.currentToken)
	{
		this.moveUpFallingPiece();
	}
	if (!this.dropNextToken())
	{
		return;
	}
	
	if (this.didWin(this.currentToken.x,this.currentToken.targetY))
	{
		this.moveUpFallingPiece();
		
		this.gameOver = true;
		this.winningColor  =  this.color;
	}
	
	if (this.color === 0)
	{	
		this.color =1;
	}
	else
	{	
		this.color =0;
	}
};

Connect4Game.prototype.dropNextToken = function()
{
	var  xValue = Math.floor(this.x);
	var targetY = this.getLastPositionInColumn(xValue);
	if (targetY === -1)
	{
		return false;
	}
	else
	{
		this.currentToken = { 'x':xValue, 'y':-1, 'color':this.color, 'targetY': targetY};
		return true;
	}
};

Connect4Game.prototype.setMousePosition= function(x,y)
{
	this.x = x;
	this.y = y;
};

Connect4Game.prototype.startMainLoop = function()
{
	var captureThis = this;
	
	window.requestAnimationFrame(function(time)
	{
		captureThis.lastTime = time;
		captureThis.mainLoop(time);
	});
		
};

Connect4Game.prototype.mainLoop = function(time)
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

Connect4Game.prototype.moveUpFallingPiece = function()
{
	this.state[this.currentToken.targetY][this.currentToken.x] = this.currentToken.color;
	delete this.currentToken;
};
	

Connect4Game.prototype.update = function(delta)
{
	if (this.currentToken)
	{
		this.currentToken.y += delta * 0.005;
		if (this.currentToken.y > this.currentToken.targetY)
		{
			this.moveUpFallingPiece();
		}
	}
};


Connect4Game.prototype.draw = function()
{
	this.ctx.clearRect(0,0,this.width,this.height);
	this.drawGrid();
	
	this.drawBoard();
	
	if (this.gameOver)
	{
		this.printGameOver();
	}
	else
	{
		if (this.x)
		{
			this.drawPiece(this.x,0.5,this.color);
		}
	
		if (this.currentToken)
		{
			this.drawPiece(this.currentToken.x+0.5,this.currentToken.y+1.5,this.currentToken.color);
		}
	}
	
	
};

Connect4Game.prototype.printGameOver = function()
{
	var winningString = "";
	
	if (this.winningColor === 0)
	{
		winningString = "Red";
	}
	else
	{
		winningString = "Black";
	}
	
	this.ctx.fillStyle = "rgb(0,0,0)";
	this.ctx.font = "2em sans-serif";
	this.ctx.textAlign="center";
	this.ctx.fillText(winningString + " has won the game!",this.width/2,30);
	
	this.ctx.fillStyle = "rgb(0,0,255)";
	this.ctx.fillText("Click to restart",this.width/2,this.height/2);
};


Connect4Game.prototype.getLastPositionInColumn = function(x)
{
	for (var y = 6; y >=0; y--)
	{
		if ( this.state[y][x] === -1)
		{
			return y;
		}
	}
	
	return -1;//No such position
};
	
			

Connect4Game.prototype.drawBoard = function()
{
	for (var y = 0; y < 7; y++)
	{
		for (var x = 0; x < 7; x++)
		{
			if (this.state[y][x] !== -1)
			{
				this.drawPiece(x+0.5,y+1.5,this.state[y][x]);
			}
		}
	}
};

Connect4Game.prototype.drawPiece = function(x,y,color)
{
	if (color === 0)
	{
		this.ctx.fillStyle = "rgb(255,0,0)";
	}
	else
	{
		this.ctx.fillStyle = "rgb(0,0,0)";
	}
	this.ctx.beginPath();
	this.ctx.arc( (x) * this.width/7, (y) * this.height/8, Math.min(this.width/14,this.height/16),0,2*Math.PI,false);
	this.ctx.fill();
};

Connect4Game.prototype.drawGrid = function()
{
	for (var x = 0; x < 8; x++)
	{
		this.ctx.beginPath();
		this.ctx.moveTo(x*this.width/7,this.height/8);
		this.ctx.lineTo(x*this.width/7,this.height);
		this.ctx.stroke();
	}
	
	for (var y = 2; y < 9; y++)
	{
		this.ctx.beginPath();
		this.ctx.moveTo(0,y*this.height/8);
		this.ctx.lineTo(this.width,y*this.height/8);
		this.ctx.stroke();
	}
};

}());