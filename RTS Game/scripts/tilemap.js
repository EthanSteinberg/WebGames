define(function()
{
	"use strict";
	
	


	function TileMap(jsonMap)
	{
		console.log(jsonMap);

		this.jsonMap = jsonMap;


		this.addWidthToSets();

	}


	TileMap.prototype.drawLayer = function(canvas,xOffset,yOffset,layer)
	{
		for (var x = 0; x < layer.width; x++)
		{
			for (var y = 0; y < layer.height; y++)
			{
				var tileId = layer.data[x+y*layer.width];
				if (tileId !== 0)
					this.drawTile(canvas,tileId,(x-xOffset)*this.jsonMap.tilewidth,(y-yOffset)*this.jsonMap.tileheight);
			}
		}
	};

	TileMap.prototype.addWidthToSets = function()
	{
		for (var i =0 ; i < this.jsonMap.tilesets.length;i++)
		{
			var set = this.jsonMap.tilesets[i];
			set.width = set.imageheight/set.tilewidth;

		}

	};

	TileMap.prototype.getTileSet = function(tileId)
	{

		var result;
		for (var i =0 ; i < this.jsonMap.tilesets.length;i++)
		{
			if (tileId < this.jsonMap.tilesets[i].firstgid)
				return result;

			result = this.jsonMap.tilesets[i];

		}

		return result;
	};

	TileMap.prototype.drawTile = function(canvas,tileId,x,y)
	{
		var set = this.getTileSet(tileId);
		var realTileId = tileId - set.firstgid;
		var tileX = Math.round(realTileId % set.width);
		var tileY = Math.floor(realTileId/set.width);



		canvas.drawImage(set.name,tileX * set.tilewidth,tileY*set.tileheight,set.tilewidth,
			set.tileheight,x,y,set.tilewidth,set.tileheight);
	};

	TileMap.prototype.draw = function(canvas,xOffset,yOffset)
	{

		for (var i =0; i < this.jsonMap.layers.length; i++)
		{
			this.drawLayer(canvas,xOffset,yOffset,this.jsonMap.layers[i]);
		}
	};


	var self = {};
	self.TileMap = TileMap;

	return self;

});