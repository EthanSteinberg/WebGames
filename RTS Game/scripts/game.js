define(["canvas","assetManager","inputManager","view","character","building","sideBar","level"], function (canvasName,assetManager,inputManagerName,view,character,building,sideBar,level)
{
	"use strict";

	


	function Game()
	{
		assetManager.load("assets.json",function()
		{
			this.canvas = new canvasName.Canvas("gameCanvas");
			this.inputManager = new inputManagerName.InputManager(this.canvas);
			this.inputManager.suppress(40);
			this.sideBar = new sideBar.SideBar();


			this.view = new view.View(this);

			this.level = new level.Level(this,"first");
			

			window.requestAnimationFrame(this.mainLoop.bind(this));

		}.bind(this));
	}


	Game.prototype.mainLoop = function(time)
	{
		
		window.requestAnimationFrame(this.mainLoop.bind(this));

		if (!this.lastTime)
			this.lastTime = time;

		this.update(time-this.lastTime);
		this.lastTime = time;
		this.draw();
	};


	Game.prototype.update = function(delta)
	{

		this.view.update(delta);
		this.level.update(delta);
	};

	Game.prototype.draw = function()
	{
		this.canvas.clear();

		this.view.transform(this.canvas);


		this.level.draw(this.canvas);

		
	};

	var self = {};
	self.Game = Game;
	return self;
});