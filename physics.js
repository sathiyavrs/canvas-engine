/* TODO: Add checks for type
 * TODO: Also decide about checks versus convenience */

var g = 9.8;
var g_dir = Vector.up();
var phy_obj_arr = [];

function init(params)
{
}

function update(dt)
{
	obj_arr.foreach(function(obj) {
		obj.update();
	});
}

function Body()
{
	var self = this,
		shape = "", // string containing shape of the body
		gravity = false, // checks if the object is affected by gravity
		is_static = true; // checks if the object isn't supposed to move

	self.shape = shape;
	self.gravity = gravity;
	self.is_static = is_static;
}
