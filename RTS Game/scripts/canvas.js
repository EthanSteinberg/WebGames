define(["domReady!"], function()
{
	"use strict";
	var self = {};


	self.canvas = document.getElementById("gameCanvas");
	self.ctx = self.canvas.getContext("2d");

	self.draw = function()
	{
		self.ctx.strokeRect(10,10,20,20);
	};

	return self;

});