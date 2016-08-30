/*
 * Simple draws on the canvas, meant mainly for debugging.
 * 
 * TODO: Implement non-default params
 */
function debug_draw(params)
{
	if (!params)
		return;

	switch (params.type)
	{
		case 'line':
			draw_line(params.start, params.end);
			break;

		case 'circle':
			fill_circle(params.center, params.radius);
			break;
	}
	return;

	/*
	 * Draws a line between two points A(x, y) and B(x, y)
	 */
	function draw_line(a, b, params)
	{
		a = Utility.get_canvas_vector(a);
		b = Utility.get_canvas_vector(b);

		if (!params || params.default)
		{
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
			ctx.closePath();

			return;
		}
	}
 
	/*
	 * Draws a full circle with center A(x, y) and radius 'rad'.
	 */
	function fill_circle(a, rad, params)
	{
		a = Utility.get_canvas_vector(a);

		if (!params || params.default)
		{
			ctx.beginPath();
			ctx.arc(a.x, a.y, rad, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			
			return;
		}
	}
}
