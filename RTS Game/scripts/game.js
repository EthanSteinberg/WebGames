define(["canvas","assetManager","inputManager","view","character"], function (canvas,assetManager,inputManager,view,character)
{
	"use strict";

	var self = {};



	self.run = function()
	{
		assetManager.load("assets.json",function()
		{
			inputManager.init(canvas);
			inputManager.suppress(40);

			inputManager.addClickHandler(function(x,y)
			{
				console.log(x,y);
			});

			self.view = new view.View("first");

			window.requestAnimationFrame(self.mainLoop);
			


		});

	};

	self.mainLoop = function(time)
	{
		
		window.requestAnimationFrame(self.mainLoop);

		if (!self.lastTime)
			self.lastTime = time;

		self.update(time-self.lastTime);
		self.lastTime = time;
		self.draw();
	};


	self.update = function(delta)
	{

		self.view.update(delta);
	};

	self.draw = function()
	{
		canvas.clear();

		self.view.draw(canvas);


		
	};

	return self;
});