define(function(){
"use strict";

	function View(game)
	{
		this.x = 0;
		this.y = 0;

		this.clickHandlers = [];


		
		this.game = game;

		console.log(game);

		game.inputManager.setClickManipulator(function(x,y)
		{
			var realX = x/32 + this.x;
			var realY = y/32 + this.y;

			return {x:realX, y: realY};
		}.bind(this));


	}


	View.prototype.update = function(delta)
	{
		if (this.game.inputManager.isPressed(40))
			this.y += delta * 0.005;
		if (this.game.inputManager.isPressed(38))
			this.y -= delta * 0.005;
		if (this.game.inputManager.isPressed(37))
			this.x -= delta * 0.005;
		if (this.game.inputManager.isPressed(39))
			this.x += delta * 0.005;

		
	};

	View.prototype.transform = function(canvas)
	{
		
		canvas.ctx.setTransform(1,0,0,1,Math.round(-this.x*32),Math.round(-this.y*32));
		//canvas.ctx.setTransform(1,0,0,1,32,0);

	};


	var self = {};
	self.View = View;
	return self;




});