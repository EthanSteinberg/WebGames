define(["domReady!","assetManager"], function(_,assetManager)
{
	"use strict";



	function Canvas(id)
	{
		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}

	Canvas.prototype.drawImage = function(name,sx,sy,sw,sh,dx,dy,dw,dh)
	{
		var img = assetManager.getImage(name);
		this.ctx.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh);
	};

	Canvas.prototype.drawImageSimple = function(name,dx,dy)
	{
		var img = assetManager.getImage(name);
		this.ctx.drawImage(img,dx,dy);
	};

	Canvas.prototype.clear = function()
	{
		this.ctx.save();
		this.ctx.setTransform(1,0,0,1,0,0);
		this.ctx.clearRect(0,0,this.width,this.height);
		this.ctx.restore();
	};


	var self = {};
	self.Canvas = Canvas;

	return self;

});