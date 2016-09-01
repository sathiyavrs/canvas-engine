/*
 * Contains a set of globals that we won't have to redeclare throughout.
 * Also contains a set of utility functions.
 */
var ctx = (document.getElementById('canvas_id')).getContext("2d");

/*
 * All utility functions will be encapsulated by the Utility Object.
 *
 * TODO: Refactor Utility
 */
var Utility = {};

function clear_canvas()
{
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
Utility.clear_canvas = clear_canvas;

/*
 * Within the following functions, the camera points to the center of the screen.
 * I won't be abstracting a camera.
 */

/*
 * This function will convert an ordinary point to a point that can be drawn on the canvas.
 * Since it's 2D, we don't have to project a 3D point onto the 2D plane.
 */
function get_canvas_vector(point)
{
	var res = new Vector(point.x + ctx.canvas.width / 2, ctx.canvas.height / 2 - point.y);

	return res;
}
Utility.get_canvas_vector = get_canvas_vector;

/*
 * The following functions are used in both physics.js and draw.js
 */
Utility.parse_dimensions = function(obj, params) {
	obj.shape = params.shape;
	switch (obj.shape)
	{
		case 'circle':
			obj.radius = params.radius;
			break;
		
		case 'rectangle':
			obj.length = params.length;
			obj.breadth = params.breadth;

			break;
	}
}

// For circles, only the x-value in scale will be considered
Utility.get_real_dimensions = function(obj, params) {
	return function() {
		var abs_transform = obj.game_object.get_absolute_transform();
		
		var res = new Object();
		res.position = new Vector(0, 0);
		res.position.assign(abs_transform.position);
		res.rotation = abs_transform.rotation;

		switch (obj.shape)
		{
			case 'circle':
				res.radius = obj.radius * abs_transform.scale.x;
				break;

			case 'rectangle':
				res.length = obj.length * abs_transform.scale.x;
				res.breadth = obj.breadth * abs_transform.scale.y;
				break;
		}

		return res;
	}
}
