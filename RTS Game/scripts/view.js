define(["inputManager", "assetManager","tilemap","character"],function(inputManager,assetManager,tilemap,character){
"use strict";

	function View(mapName)
	{
		this.x = 0;
		this.y = 0;

		this.clickHandlers = [];


		this.tilemap = new tilemap.TileMap(assetManager.getMap(mapName));
		this.char = new character.Character(this);

		inputManager.addClickHandler(function(x,y)
		{
			var realX = Math.floor(x/32 + this.x);
			var realY = Math.floor(y/32 + this.y);
			console.log(realX,realY);

			for (var i =0 ; i < this.clickHandlers.length; i++)
			{
				this.clickHandlers[i](realX,realY);
			}
		}.bind(this));;

	}

	View.prototype.addClickHandler = function(callback)
	{
		this.clickHandlers.push(callback);
	}

	View.prototype.update = function(delta)
	{
		if (inputManager.isPressed(40))
			this.y += delta * 0.005;
		if (inputManager.isPressed(38))
			this.y -= delta * 0.005;
		if (inputManager.isPressed(37))
			this.x -= delta * 0.005;
		if (inputManager.isPressed(39))
			this.x += delta * 0.005;

		this.char.update(delta);
	};

	View.prototype.draw = function(canvas)
	{
		
		this.tilemap.draw(canvas,this.x,this.y);
		this.char.draw(canvas,this.x,this.y);
	};


	var self = {};
	self.View = View;
	return self;




});