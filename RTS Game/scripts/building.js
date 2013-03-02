define(["character","util"], function(character,util)
{

	"use strict";

	

	function Building(game)
	{
		game.inputManager.addClickHandler(function(x,y)
		{
			if( this.box.contains(x,y))
			{
				this.selected = true;
				game.sideBar.mode = 
				{
					text: "Building",
					buttons: [
						{
							name : "Make Fox",
							callback: function()
							{
								if (game.level.isWalkable(10,12))
									game.level.characters.push(new character.Character(10,12,game,game.level.tilemap.collisionLayer));
							}
						}
					]
				};
			}
				
			else if (this.selected)
			{
				this.selected = false;
				delete game.sideBar.mode;

			}
		}.bind(this));


		this.x = 10;
		this.y = 10;

		this.box = new util.Box(this.x,this.y,2,2);
	}

	Building.prototype.draw = function(canvas)
	{
		canvas.drawImageSimple("building",this.x*32,this.y*32);
		if (this.selected)
			canvas.ctx.strokeRect(this.x*32,this.y*32,64,64);
	};

	var self = {};
	self.Building = Building;
	return self;


});