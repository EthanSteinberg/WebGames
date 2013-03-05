	define(["pathfinding","util"], function(pathfinding,util)
	{
		"use strict";


		function Character(x,y,game)
		{

			this.x= x;
			this.y= y;
			this.targetX = this.x;
			this.targetY  =this.y ;
			this.xVel = 0;
			this.yVel = 0;
			this.game = game;
			this.swordAngle = 0;

		}


		Character.prototype.getBoundingBox = function()
		{
			return new util.Box(this.x,this.y,1,1);
		};


		Character.prototype.moveTo = function(x,y)
		{
			this.currentPath = pathfinding.Search(Math.round(this.x),Math.round(this.y),x,y,this.game.level,this.game.canvas);
			if (!this.currentPath)
				return;

			this.currentPathIndex = 0;

			this.targetX = x;
			this.targetY  =y ;

			this.moving = true;
		};

		Character.prototype.getMouseHandler = function()
		{
			return {
				callbacks : [
				{
					test: function(x,y) { return this.getBoundingBox().contains(x,y);}.bind(this),
					cursorName: "no",
					click: function() { console.log("Cannot attack self");}
				},
				{
					test: function(x,y) { return this.game.level.isCharacter(Math.floor(x),Math.floor(y));}.bind(this),
					cursorName: "attack",
					click: function(x,y) { this.attack(Math.floor(x),Math.floor(y));}.bind(this)
				},
				{
					test: function(x,y) { return this.game.level.isWalkable(Math.floor(x),Math.floor(y)); }.bind(this),
					cursorName: "move",
					click: function(x,y) { this.moveTo(Math.floor(x),Math.floor(y));}.bind(this)
				},
				{
					test: function() { return true;},
					cursorName: "no",
					click: function() { console.log("Cannot move");}
				}
				]
			};
		};

		Character.prototype.getSideBar = function()
		{
			return {
					text: "Fox",
					buttons: [],
					statuses: [
					{
						name: "Health",
						type: "bar",
						dataFunc: function()
						{
							return {current: 15, max: 30};
						}
					}]
				};
		};


		Character.prototype.attack = function(x,y)
		{
			this.moveTo(x-1,y);
			this.swordAnimation = true;
			this.swordAngle = 0;
			this.swordSwing = 1;
		}

		Character.prototype.draw = function(canvas)
		{
			canvas.drawImageSimple("fox",this.x*32,this.y*32);


			var angle = this.swordAngle * Math.PI/180;
			canvas.ctx.save();
			canvas.ctx.translate((this.x+.5 + Math.sin(angle))*32,this.y*32);
			canvas.ctx.rotate(angle);
		
			canvas.drawImageSimple("sword1",.5,0);
			canvas.ctx.restore();
		};

		Character.prototype.update = function(delta)
		{

			if (this.swordAnimation)
			{
				if (this.swordAngle > 45 || this.swordAngle < -45)
					this.swordSwing *= -1;
				this.swordAngle += this.swordSwing*2;
			}

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