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
