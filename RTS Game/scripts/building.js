define(["character","util"], function(character,util)
{

	"use strict";

	

	function Building(game)
	{
		this.health = 30;
		this.maxHealth = 30;
		this.game = game;

		this.x = 10;
		this.y = 10;

		this.box = new util.Box(this.x,this.y,2,2);
	}


	Building.prototype.getMouseHandler = function()
	{
		return {
				callbacks : [
				{
					test: function() { return true;},
					cursorName: "no",
					click: function() { console.log("Buildings don't do anything");}
				}
				]
			};
	};

	Building.prototype.getSideBar = function()
	{
		return {
					text: "Building",
					buttons: [
						{
							name : "Make Fox",
							callback: function()
							{
								if (this.game.level.isWalkable(10,12))
									this.game.level.characters.push(new character.Character(10,12,this.game));
							}.bind(this)
						}
					],
					statuses: [
						{
							name: "Health",
							type: "bar",
							dataFunc: function()
							{
								return {current: this.health, max: this.maxHealth};
							}.bind(this)
						}]
				};
	};

	Building.prototype.getBoundingBox = function()
	{
		return this.box;
	};


	Building.prototype.draw = function(canvas)
	{
		canvas.drawImageSimple("building",this.x*32,this.y*32);
	};

	var self = {};
	self.Building = Building;
	return self;


});