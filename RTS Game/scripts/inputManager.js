define(function()
{
	"use strict";
	

	function InputManager(canvas)
	{
		this.keyDict = {};
		this.callbackDict = {};
		this.supressedKeys = {};
		this.clickHandlers = [];

		this.clickManipulator = null;

		$(document).keydown(function (event)
		{


			this.keyDict[event.which] = true;

			if (this.callbackDict[event.which])
			{
				for (var i =0 ; i < this.callbackDict[event.which].length;i++)
				{
					this.callbackDict[event.which][i]();
				}
			}

			if (this.supressedKeys[event.which])
			{
				console.log("Suppressed?");
				return false;
			}
				
			else
				return true;
		}.bind(this));


		$(document).click(function (event)
		{


			var x = event.pageX - canvas.canvas.offsetLeft;
			var y = event.pageY - canvas.canvas.offsetTop;

			if (x >= canvas.canvas.width || y >= canvas.canvas.height || x < 0 || y < 0)
				return;

			if (this.clickManipulator)
			{
				var manipulated = this.clickManipulator(x,y);
				x = manipulated.x;
				y = manipulated.y;
			}

			for (var i = 0; i < this.clickHandlers.length; i++)
			{
				this.clickHandlers[i](x,y);

			}
		}.bind(this));

		$(document).keypress(function(event) 
		{
			console.log(event);
			

		}.bind(this));

		$(document).keyup(function (event)
		{
			this.keyDict[event.which] = false;
			return true;
		}.bind(this));		
	}


	InputManager.prototype.addCallback = function(keyCode,callback)
	{
		if (!this.callbackDict[keyCode])
			this.callbackDict[keyCode] = [];

		this.callbackDict[keyCode].push(callback);
	};

	InputManager.prototype.isPressed = function(keyCode)
	{
		return this.keyDict[keyCode];
	};

	InputManager.prototype.suppress = function(keyCode)
	{
		this.supressedKeys[keyCode] = true;
	};

	InputManager.prototype.addClickHandler = function(callback)
	{
		this.clickHandlers.push(callback);
	}

	InputManager.prototype.setClickManipulator = function(callback)
	{
		this.clickManipulator =  callback;
	}

	var self = {};
	self.InputManager = InputManager;
	return self;
});