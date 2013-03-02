define(function()
{
	"use strict";
	
	
	function TileSet(jsonData,callback)
	{
		this.firstgid = jsonData.firstgid;
		this.width = jsonData.imagewidth/jsonData.tilewidth;
		this.height = jsonData.imageheight/jsonData.tileheight;
		this.tilewidth = jsonData.tilewidth;
		this.tileheight = jsonData.tileheight;
		this.img = new Image();
		this.img.onload = callback;
		this.img.src = "assets/"+ jsonData.image;


	}


	TileSet.prototype.getDrawData = function(tileId)
	{
		var localId = tileId - this.firstgid;
		var x = Math.round(localId % this.width);
		var y = Math.floor(localId/this.width);

		var box = {
			sx: x*this.tilewidth,
			sy: y*this.tileheight,
			sw: this.tilewidth,
			sh: this.tileheight,
			img: this.img

		};

		return box;
	};


	TileSet.prototype.containsTile = function(tileId)
	{
		var maxId = this.firstgid + this.width * this.height;
		if (tileId >= this.firstgid && tileId < maxId)
			return true;
		else
			return false;
	};

	function TileSetCollection(jsonData,callback)
	{

		console.log("Creating collection");

		this.tilesets = [];
		var numLeftToLoad = jsonData.length;
		function onLoad()
		{
			numLeftToLoad--;
			if (numLeftToLoad === 0)
				callback();
		}

		
		for (var i = 0; i < jsonData.length;i++)
		{
			this.tilesets.push(new TileSet(jsonData[i],onLoad));
		}
	}

	TileSetCollection.prototype.getDrawData = function(tileId)
	{
		for (var i = 0; i < this.tilesets.length;i++)
		{
			var set = this.tilesets[i];
			if (set.containsTile(tileId))
				return set.getDrawData(tileId);

			
		}
		console.assert(false,"Could not find tile");

	};


	function DrawTileLayer(json)
	{
		this.data = json.data;
		this.height = json.height;
		this.width = json.width;
	}

	DrawTileLayer.prototype.draw = function(canvas,tilesets)
	{
		for (var x = 0; x < this.width; x++)
		{
			for (var y = 0; y < this.height; y++)
			{
				var tileId = this.data[x+y*this.width];
				if (tileId !== 0)
				{
					var drawData = tilesets.getDrawData(tileId);
					canvas.ctx.drawImage(drawData.img,drawData.sx,drawData.sy,drawData.sw,drawData.sh,x*32,y*32,drawData.sw,drawData.sh);
				}
			}
		}
	};


	function CollisionTileLayer(json)
	{
		this.drawLayer = new DrawTileLayer(json);
		this.data = json.data;
		this.height = json.height;
		this.width = json.width;



	}


	CollisionTileLayer.prototype.draw = function(canvas,tilesets)
	{

		canvas.ctx.globalAlpha = 0.3;
		this.drawLayer.draw(canvas,tilesets);
		canvas.ctx.globalAlpha = 1;
	}

	CollisionTileLayer.prototype.isWalkable = function(x,y)
	{

		return (x>=0 &&  x < this.width && y >= 0 && y < this.width && this.data[x+y*this.width] === 0 );
	}


	function TileMap(jsonMap,callback)
	{

		this.tilesets = new TileSetCollection(jsonMap.tilesets,callback);
		for (var i = 0; i < jsonMap.layers.length; i++)
		{
			var layerData = jsonMap.layers[i];
			if (layerData.name==="VisableLayer")
				this.visableLayer = new DrawTileLayer(layerData);
			else if (layerData.name === "CollisionLayer")
				this.collisionLayer = new CollisionTileLayer(layerData);
		}

	}

	TileMap.prototype.draw = function(canvas)
	{

		this.visableLayer.draw(canvas,this.tilesets);
		this.collisionLayer.draw(canvas,this.tilesets);
		
		
	
	};


	var self = {};
	self.TileMap = TileMap;

	return self;

});