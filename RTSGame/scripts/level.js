define(["assetManager","character","building"],function(assetManager,character,building)
{
	"use strict";

	function Level(game,levelName)
	{
		this.tilemap = new assetManager.getMap(levelName);
		this.game = game;
		this.characters = [];

		this.characters.push(new character.Character(1,1,this.game));
		this.bill = new building.Building(this.game);

		this.game.inputManager.addClickHandler(this.clickHandler.bind(this));


	}

	Level.prototype.clickHandler = function(x,y,type)
	{
		if (type ===1)
			this.select(x,y);
	};

	Level.prototype.select = function(x,y)
	{
		if (this.selectItem && this.selectItem.getBoundingBox().contains(x,y)) // Make sure not to reselect this
		{
			delete this.game.inputManager.mouseHandler;
			delete this.selectItem;
			delete this.game.sideBar.mode;
			this.game.inputManager.setCursor("select");
		}
		else
		{

			this.selectItem = this.getItemAt(x,y);
			if( this.selectItem)
			{
				this.game.inputManager.mouseHandler = this.selectItem.getMouseHandler();
				this.game.sideBar.mode = this.selectItem.getSideBar();
			}
			else
			{
				delete this.game.inputManager.mouseHandler;
				delete this.game.sideBar.mode;
				this.game.inputManager.setCursor("select");
			}
				
		}

	};

	Level.prototype.getItemAt = function(x,y)
	{
		if (this.bill.getBoundingBox().contains(x,y))
			return this.bill;

		for (var i = 0; i < this.characters.length; i++)
		{
			var aChar = this.characters[i];
			
			if (aChar.getBoundingBox().contains(x,y))
				return aChar;
		}

	};

	Level.prototype.draw = function(canvas)
	{

		this.tilemap.draw(canvas);
		this.bill.draw(canvas);

		for (var i = 0; i < this.characters.length;i++)
		{
			var aChar = this.characters[i];
			aChar.draw(canvas);
		}

		if (this.selectItem)
		{
			var box = this.selectItem.getBoundingBox();
			canvas.ctx.strokeRect(box.x*32,box.y*32,box.width*32,box.height*32);
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
		if (this.getItemAt(x,y))
			return true;
		else
			return false;
	};

	Level.prototype.getCharacter = function(x,y)
	{
		if (this.bill.box.contains(x,y))
			return this.bill;
		
		for (var i = 0; i < this.characters.length; i++)
		{
			var aChar = this.characters[i];
			
			if (Math.round(aChar.x) === x && Math.round(aChar.y) === y)
			{
				return aChar;
			}
				

		}
	};

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