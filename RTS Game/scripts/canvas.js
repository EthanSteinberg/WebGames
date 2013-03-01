define(["domReady!","assetManager"], function(_,assetManager)
{
	"use strict";
	var self = {};



	self.canvas = document.getElementById("gameCanvas");
	self.ctx = self.canvas.getContext("2d");
	self.width = self.canvas.width;
	self.height = self.canvas.height;




	self.drawImage = function(name,sx,sy,sw,sh,dx,dy,dw,dh)
	{
		var img = assetManager.getImage(name);
		self.ctx.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh);
	};

	self.drawImageSimple = function(name,dx,dy)
	{
		var img = assetManager.getImage(name);
		self.ctx.drawImage(img,dx,dy);
	};

	self.clear = function()
	{
		self.ctx.clearRect(0,0,self.width,self.height);
	};


	return self;

});