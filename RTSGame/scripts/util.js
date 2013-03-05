define(function()
{
	"use strict";

	function Box(x,y,width,height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	Box.prototype.contains = function(x,y)
	{
		var inX = (x>= this.x && x< (this.x+  this.width));
		var inY = (y>= this.y && y< (this.y + this.height));

		return inX && inY;
	};

	var self ={};
	self.Box = Box;
	return self;

});