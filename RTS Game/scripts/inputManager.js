define(function()
{
	"use strict";
	var self = {};

	self.init = function(canvas) {

		self.keyDict = {};
		self.callbackDict = {};
		self.supressedKeys = {};
		self.clickHandlers = [];

		$(document).keydown(function (event)
		{


			self.keyDict[event.which] = true;

			if (self.callbackDict[event.which])
			{
				for (var i =0 ; i < self.callbackDict[event.which].length;i++)
				{
					self.callbackDict[event.which][i]();
				}
			}

			if (self.supressedKeys[event.which])
			{
				console.log("Suppressed?");
				return false;
			}
				
			else
				return true;
		});


		$(document).click(function (event)
		{


			var x = event.pageX - canvas.canvas.offsetLeft;
			var y = event.pageY - canvas.canvas.offsetTop;

			for (var i = 0; i < self.clickHandlers.length; i++)
			{
				self.clickHandlers[i](x,y);

			}
		});


		
		$(document).keypress(function(event) 
		{
			console.log(event);
			

		});

		$(document).keyup(function (event)
		{
			self.keyDict[event.which] = false;
			return true;
		});		



	};

	self.addCallback = function(keyCode,callback)
	{
		if (!self.callbackDict[keyCode])
			self.callbackDict[keyCode] = [];

		self.callbackDict[keyCode].push(callback);
	};

	self.isPressed = function(keyCode)
	{
		return self.keyDict[keyCode];
	};

	self.suppress = function(keyCode)
	{
		self.supressedKeys[keyCode] = true;
	};

	self.addClickHandler = function(callback)
	{
		self.clickHandlers.push(callback);
	}

	return self;
});