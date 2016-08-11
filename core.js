/*
 * Core contains core functionality used in all classes
 * Convenience is more important than rigidity */

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

	function assign(a)
	{
		self.x = a.x;
		self.y = a.y;
	}
	self.assign = assign;

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

function freeze_vector()
{
	for (var property in Vector)
		if (Vector.hasOwnProperty(property))
			Object.freeze(Vector[property])
	
	Object.freeze(Vector);
}

function Transform(params)
{
	var self = this;

	self.position = new Vector(0, 0);
	self.rotation = 0;
	self.scale = new Vector(0, 0);

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

function freeze_core_globals()
{
	freeze_vector();
	freeze_transform();
}
freeze_core_globals();
