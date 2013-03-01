define( function()
{
	"use strict";


	function Character(view)
	{
		view.addClickHandler(function(x,y)
		{
			if (x === this.x && y === this.y)
			{
				this.selected = true;
			}

			else if (this.selected)
			{
				this.targetX = x;
				this.targetY = y;

				var xVec = this.targetX - this.x;
				var yVec = this.targetY - this.y;

				var angle = Math.atan2(yVec,xVec);
				this.xVel = Math.cos(angle) * 0.005;
				this.yVel = Math.sin(angle) * 0.005;
				this.selected = false;

			}
		}.bind(this));

		this.x= 0;
		this.y= 0;
		this.targetX = 0;
		this.targetY  =0 ;
		this.xVel = 0;
		this.yVel = 0;

	}

	Character.prototype.draw = function(canvas,xOffset,yOffset)
	{
		canvas.drawImageSimple("fox",(this.x - xOffset)*32,(this.y-yOffset)*32);
		if (this.selected)
			canvas.ctx.strokeRect((this.x - xOffset)*32,(this.y-yOffset)*32,32,32);
	};

	Character.prototype.update = function(delta)
	{
		this.x += this.xVel * delta;
		this.y += this.yVel * delta;

		if (Math.abs(this.x - this.targetX) < 0.1 && Math.abs(this.y - this.targetY) < 0.1)
		{
			this.x = this.targetX;
			this.xVel = 0;

			this.y = this.targetY;
			this.yVel = 0;
		}
	};

	var self = {};
	self.Character = Character;
	return self;


});