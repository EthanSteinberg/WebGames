define(["assetManager"], function(assetManager)
{
	"use strict";
	

	function InputManager(canvas)
	{
		this.canvas = canvas;
		this.keyDict = {};
		this.callbackDict = {};
		this.supressedKeys = {};
		this.clickHandlers = [];

		this.clickManipulator = null;

		canvas.canvas.oncontextmenu = function()
		{
			return false;
		};

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
				return false;
			}
				
			else
				return true;
		}.bind(this));




		$(canvas.canvas).mousemove(function (event)
		{
			//console.log(event.pageX- this.canvas.canvas.offsetLeft,event.pageY-this.canvas.canvas.offsetTop);
			var manip = this.convertToXY(event);

			if (this.mouseHandler)
			{
				for (var i = 0; i < this.mouseHandler.callbacks.length; i++)
				{
					var callback = this.mouseHandler.callbacks[i];
					if (callback.test(manip.x,manip.y))
					{
						this.setCursor(callback.cursorName);
						return;
					}
						
				}
			}

		}.bind(this));

		$(canvas.canvas).mousedown(function (event)
		{

			var manipulate = this.convertToXY(event);
			var x= manipulate.x;
			var y = manipulate.y;

			for (var i = 0; i < this.clickHandlers.length; i++)
			{
				this.clickHandlers[i](x,y,event.which);
			}

			if (event.which===3&&this.mouseHandler)
			{
				for (var i = 0; i < this.mouseHandler.callbacks.length; i++)
				{
					var callback = this.mouseHandler.callbacks[i];
					if (callback.test(manipulate.x,manipulate.y))
					{
						callback.click(manipulate.x,manipulate.y);
						return;
					}
						
				}
			}

		}.bind(this));

		$(document).keypress(function(event) 
		{
			

		}.bind(this));

		$(document).keyup(function (event)
		{
			this.keyDict[event.which] = false;
			return true;
		}.bind(this));		
	}

	InputManager.prototype.convertToXY = function(event)
	{
		var x = event.pageX - this.canvas.canvas.offsetLeft;
		var y = event.pageY - this.canvas.canvas.offsetTop;

		if (x >= ( this.canvas.canvas.width +6 )|| y >= (this.canvas.canvas.height+6) || x < -3 || y < -3)
		{
			console.assert(false, "should never get outside",x,y);
			return;
		}

		if (this.clickManipulator)
		{
			var manipulated = this.clickManipulator(x,y,event.which);
			x = manipulated.x;
			y = manipulated.y;
		}

		return {x: x, y:y};
	};


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
	};

	InputManager.prototype.setClickManipulator = function(callback)
	{
		this.clickManipulator =  callback;
	};

	InputManager.prototype.setCursor = function(img)
	{
		var cursor = assetManager.getCursor(img);
		$(this.canvas.canvas).css("cursor","url(assets/cursors/" + img+".png)" + cursor.x+ " " + cursor.y+ ", default");
	};

	var self = {};
	self.InputManager = InputManager;
	return self;
});