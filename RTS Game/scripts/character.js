define(["pathfinding"], function(pathfinding)
{
	"use strict";


	function Character(x,y,game,collisionMap)
	{
		game.inputManager.addClickHandler(function(x,y)
		{
			
			if (!this.selected && x === Math.round(this.x) && y === Math.round(this.y))
			{
				this.selected = true;
			}

			else if (this.selected)
			{

				if (game.level.isCharacter(x,y))
				{
					this.selected = false;
					return;
				}

				else if (!game.level.isWalkable(x,y))
					return;


				this.currentPath = pathfinding.Search(Math.round(this.x),Math.round(this.y),x,y,game.level,game.canvas);
				if (!this.currentPath)
					return;
				
				this.currentPathIndex = 0;

				this.targetX = x;
				this.targetY  =y ;
				
				this.selected = false;
				this.moving = true;
				debugger;

			}
		}.bind(this));

		this.x= x;
		this.y= y;
		this.targetX = this.x;
		this.targetY  =this.y ;
		this.xVel = 0;
		this.yVel = 0;
		this.game = game;

	}

	Character.prototype.draw = function(canvas)
	{
		canvas.drawImageSimple("fox",this.x*32,this.y*32);
		if (this.selected)
			canvas.ctx.strokeRect(this.x*32,this.y*32,32,32);
	};

	Character.prototype.update = function(delta)
	{

		if (this.moving)
		{


			var currentTarget = this.currentPath[this.currentPathIndex];
			var xVec = currentTarget.x - this.x;
			var yVec = currentTarget.y - this.y;

			var angle = Math.atan2(yVec,xVec);
			this.xVel = Math.cos(angle) * 0.005;
			this.yVel = Math.sin(angle) * 0.005;


			this.x += this.xVel * delta;
			this.y += this.yVel * delta;

			this.tmpX = this.x;
			this.tmpY = this.y;
			this.x = NaN;
			this.y = NaN;
			if (!this.game.level.isWalkable(Math.round(this.tmpX),Math.round(this.tmpY)))
			{
				console.log("Halt");
				this.moving = false;
				this.currentPathIndex = 0;
				delete this.currentPath;

				this.tmpX -= 2*this.xVel * delta;
				this.tmpY -= 2*this.yVel * delta;

				this.x = Math.round(this.tmpX);
				this.y = Math.round(this.tmpY);
			}
			else
			{
				this.x = this.tmpX;
				this.y = this.tmpY;
			}


			if (Math.abs(this.x - currentTarget.x) < 0.1 && Math.abs(this.y - currentTarget.y) < 0.1)
			{
				this.currentPathIndex+= 1;
				if (this.currentPathIndex >= this.currentPath.length)
				{
					delete this.currentPath;
					this.moving = false;
				}
				this.x = currentTarget.x;
				this.y = currentTarget.y;
			}
		}
	};

	var self = {};
	self.Character = Character;
	return self;


});