/*
 * Core contains core functionality used in all classes
 * Convenience is more important than rigidity 
 */

/*
 * Vector is was originally thought up to be a rough equivalent of the Vector2D class in Unity.
 */
function Vector(x, y)
{
	if (typeof(x) != "number" || typeof(y) != "number")
		throw new TypeError("Invalid parameters to Vector!");

	var self = this;
	self.x = x;
	self.y = y;

	function add(a)
	{
		self.x += a.x;
		self.y += a.y;
	}
	self.add = add;

	function subtract(a)
	{
		self.x -= a.x;
		self.y -= a.y;
	}
	self.subtract = subtract;

	function scalar_product(k)
	{
		self.x *= k;
		self.y *= k;
	}
	self.scalar_product = scalar_product;

	function simple_product(a)
	{
		self.x *= a.x;
		self.y *= a.y;
	}
	self.simple_product = simple_product;

	function assign(a)
	{
		self.x = a.x;
		self.y = a.y;
	}
	self.assign = assign;

	function magnitude()
	{
		return Math.sqrt(self.x * self.x + self.y * self.y);
	}
	self.magnitude = magnitude;

	/*
	 * Same direction vector, make magnitude one
	 */
	function normalize()
	{
		var sin_val = self.y / self.magnitude();
		var cos_val = self.x / self.magnitude();

		self.x = cos_val;
		self.y = sin_val;
	}
	self.normalize = normalize;

	Object.seal(self);

	for (var property in self)
		if (self.hasOwnProperty(property))
			if (typeof(self[property]) == "function")
				Object.freeze(self[property]);
}

Vector.dot_product = function(a, b)
{
	return a.x * b.x + a.y * b.y;
}

Vector.add = function(a, b)
{
	var res = new Vector(0, 0);
	res.add(a);
	res.add(b);

	return res;
}

Vector.scalar_product = function(a, k)
{
	var res = new Vector(0, 0);
	res.assign(a);
	res.scalar_product(k);

	return res;
}

Vector.up = function()
{
	return new Vector(0, 1);
}

Vector.down = function()
{
	return new Vector(0, -1);
}

Vector.left = function()
{
	return new Vector(-1, 0);
}

Vector.right = function()
{
	return new Vector(1, 0);
}

Vector.distance_squared = function(a, b)
{
	function square(x)
	{
		return x * x;
	}
	return square(a.x - b.x) + square(a.y - b.y);
}

/*
 * Deep-Freezing the Vector class to ensure nobody can redeclare certain required functions indirectly.
 */
function freeze_vector()
{
	for (var property in Vector)
		if (Vector.hasOwnProperty(property))
			Object.freeze(Vector[property])
	
	Object.freeze(Vector);
}
freeze_vector();

function Transform(params)
{
	var self = this;

	self.position = new Vector(0, 0);
	self.rotation = 0;
	self.scale = new Vector(1, 1);

	function assign(params)
	{
		self.position.assign(params.position);
		self.rotation = params.rotation;
		self.scale.assign(params.scale);
	}
	self.assign = assign;

	Object.seal(self);

	for (var property in self)
		if (self.hasOwnProperty(property))
			if (typeof(self[property]) == "function")
				Object.freeze(self[property]);

	if (params.default)
		return;

	self.assign(params);
}

function freeze_transform()
{
	Object.freeze(Transform);
}
freeze_transform();
