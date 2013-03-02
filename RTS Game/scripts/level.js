define(["assetManager","character","building"],function(assetManager,character,building)
{
	"use strict";

	function Level(game,levelName)
	{
		this.tilemap = new assetManager.getMap(levelName);
		this.game = game;
		this.characters = [];

		this.characters.push(new character.Character(1,1,this.game,this.tilemap.collisionLayer));
		this.bill = new building.Building(this.game);

	}

	Level.prototype.draw = function(canvas)
	{

		this.tilemap.draw(canvas);
		this.bill.draw(canvas);

		for (var i = 0; i < this.characters.length;i++)
		{
			var aChar = this.characters[i];
			aChar.draw(canvas);
		}
	};

	Level.prototype.update = function(delta)
	{

		for (var i = 0; i < this.characters.length;i++)
		{
			var aChar = this.characters[i];
			aChar.update(delta);
		}
	};

	Level.prototype.isCharacter = function(x,y)
	{
		if (this.bill.box.contains(x,y))
			return true;
		
		for (var i = 0; i < this.characters.length; i++)
		{
			var aChar = this.characters[i];
			
			if (Math.round(aChar.x) === x && Math.round(aChar.y) === y)
			{
				return true;
			}
				

		}
	}

	Level.prototype.isWalkable = function(x,y)
	{
		if (this.isCharacter(x,y))
			return false;

		return this.tilemap.collisionLayer.isWalkable(x,y);
	};

	var self ={};
	self.Level = Level;
	return self;
});