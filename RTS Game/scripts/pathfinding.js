define(["priority_queue"],function(priority_queue)
{
	"use strict";


	function PointFactory(tx,ty,collisionMap)
	{
		var pointId = 0;

		function Point(x,y,posScore,from)
		{
			this.x = x;
			this.y = y;
			this.posScore = posScore;
			this.from = from;
			this.id = pointId++;
		}

		Point.prototype.toString = function()
		{
			return "<" + this.x + " " + this.y + ">";
		};

		Point.prototype.getNeighbors = function()
		{
			var result = [
				new Point(this.x,this.y+1,this.posScore+1,this),
				new Point(this.x,this.y-1,this.posScore+1,this),
				new Point(this.x+1,this.y,this.posScore+1,this),
				new Point(this.x-1,this.y,this.posScore+1,this)
			];

			return result;
		};

		Point.prototype.getCost = function()
		{
			return this.posScore +  Math.abs(this.x - tx) + Math.abs(this.y - ty);
		};

		Point.prototype.isValid = function()
		{
			//console.log(collisionMap);
			return collisionMap.isWalkable(this.x,this.y);
		};

		Point.prototype.isTarget = function()
		{
			return tx === this.x && ty === this.y;
		};

		Point.prototype.draw = function(canvas)
		{
			
			canvas.ctx.strokeRect(this.x*32,this.y*32,32,32);
			canvas.ctx.strokeStyle = "black";

		};

		this.Point = Point;

	}


	function drawPath(point,canvas)
	{
		canvas.ctx.strokeStyle = "red";
		point.draw(canvas);
		if (point.from)
			drawPath(point.from,canvas);
	}

	function getPath(point)
	{
		var currentPoint = point;
		var result = [];
		while (currentPoint !== null)
		{
			result.push({x:currentPoint.x, y: currentPoint.y});
			currentPoint = currentPoint.from;
		}

		//console.log(result);
		return result.reverse();
	}


	function Search(sx,sy,tx,ty,collisionMap,canvas)
	{


		//console.log(collisionMap);
		var pointFactory = new PointFactory(tx,ty,collisionMap);

		var startingPoint = new pointFactory.Point(sx,sy,0,null);

		var seen = {};

		var queue = priority_queue.PriorityQueue({low: true});
		queue.push(startingPoint, startingPoint.getCost());


		while (queue.size() !== 0)
		{
			
			var next = queue.pop();

			canvas.ctx.strokeStyle = "yellow";
			next.draw(canvas);
			//console.log(next.isValid());
			//debugger;
			canvas.ctx.strokeStyle = "blue";
			next.draw(canvas);

			//console.log(next);
			if (next.isTarget())
			{
				canvas.ctx.strokeStyle = "red";
				next.draw(canvas);
				//console.log(next,next.x,tx);
				//debugger;
				drawPath(next,canvas);
				//debugger;

				return getPath(next);
			}


			seen[next] = true;


			var neighbors = next.getNeighbors();
			for (var i = 0; i < neighbors.length; i++)
			{
				var possib = neighbors[i];

				if (possib.isValid() && !seen[possib])
				{
					queue.push(possib,possib.getCost());
				}


			}

		}
		

	}



	var self = {};
	self.Search = Search;
	return self;

});