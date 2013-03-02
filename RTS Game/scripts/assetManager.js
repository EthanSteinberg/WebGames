define(["tilemap"], function(tilemap)
{
	"use strict";

	var self = {};

	self.loaded = false;

	function loadImages(imageArr,callback)
	{
		self.images = imageArr;

		var keys = Object.keys(imageArr);

		var loadsLeft = keys.length;
		function loadFunc()
		{
			loadsLeft--;
			if (loadsLeft === 0)
				callback();
		}

		for (var i = 0; i < keys.length; i++)
		{
			var name = keys[i];
			var img = new Image();
			img.onload = loadFunc;
			img.src = self.directory + "/" + imageArr[name].url;
			imageArr[name].img = img;
		}
	}


	function loadMaps(mapsArr,callback)
	{
		self.maps = mapsArr;

		var keys = Object.keys(mapsArr);

		var loadsLeft = keys.length;

		function getFunc(name)
		{
			return function(json)
			{
				mapsArr[name] = new tilemap.TileMap(json, function()
				{ 
					loadsLeft--;
					if (loadsLeft === 0)
						callback();
				});
			};	
		}

		for (var i = 0; i < keys.length; i++)
		{
			var name = keys[i];

			$.getJSON(self.directory + "/" + mapsArr[name].url, getFunc(name));
		}
	}

	self.load = function(jsonName,callback)
	{

		if (self.loaded)
		{
			callback();
			return;
		}
		
		console.log("Request");
		$.getJSON(jsonName, function (json)
		{
			console.log(json);
			self.directory = json.directory;
			self.tilesets = json.tilesets;
			loadImages(json.images, function()
			{
				loadMaps(json.maps,function()
				{
					self.loaded = true;
					callback();
				});


			});



		});
		
	};

	self.getImage = function(imageName)
	{
		console.assert(self.loaded === true,"Asserts are not loaded");
		console.assert(self.images[imageName],"Image " + imageName + " is not stored.");
		return self.images[imageName].img;
	};

	self.getMap = function(mapName)
	{
		console.assert(self.loaded === true,"Asserts are not loaded");
		return self.maps[mapName];
	};

	self.getTileset = function(setName)
	{
		console.assert(self.loaded === true,"Asserts are not loaded");
		return self.tilesets[setName];
	};

	return self;
});