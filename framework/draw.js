/*
 * Simple draws on the canvas, meant mainly for debugging.
 * Note: ctx is defined in global.js
 * 
 * TODO: Refactor debug_draw
 * TODO: Implement non-default params
 */
function debug_draw(params)
{
	if (!params)
		return;

	if (params.color)
	{
		console.log("HASHAHSAH");
		ctx.fillStyle = params.color;
	}

	switch (params.type)
	{
		case 'line':
			draw_line(params.start, params.end);
			break;

		case 'circle':
			circle(params.center, params.radius, params.fill);
			break;

		case 'polygon':
			polygon(params.points);
			break;
	}

	if (params.color)
		ctx.fillStyle = "#000000";

	return;

	/*
	 * Draws a polygon. Takes in a points array. Drawn in order.
	 */
	function polygon(arr)
	{
		for (var i = 1; i < arr.length; i++)
			draw_line(arr[i - 1], arr[i]);
		draw_line(arr[0], arr[arr.length - 1]);
	}

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
	function circle(a, rad, fill, params)
	{
		a = Utility.get_canvas_vector(a);

		if (!params || params.default)
		{
			ctx.beginPath();
			ctx.arc(a.x, a.y, rad, 0, 2 * Math.PI);

			if (fill)
				ctx.fill();
			else
				ctx.stroke();

			ctx.closePath();
			
			return;
		}
	}
}

/*
 * This renderer will take care of basic rendering using HTML5's canvas 2d rendering context
 *
 * TODO: Implement more features
 */
function Canvas_Renderer(params)
{
	var self = this;
	self.game_object = params.game_object;

	Utility.parse_dimensions(self, params);

	// For circles, only the x-value in scale will be considered
	self.get_real_dimensions = Utility.get_real_dimensions(self, params);
	self.render_params = params;

	function set_up_render()
	{
		ctx.fillStyle = "#000000";

		if (self.render_params.color)
			ctx.fillStyle = self.render_params.color;
	}

	function render()
	{
		set_up_render();

		var real_dimensions = self.get_real_dimensions();
		switch (self.shape)
		{
			case 'circle':
				render_circle(real_dimensions.position, real_dimensions.radius);
				break;

			case 'rectangle':
				break;
		}

		function render_circle(a, rad, params)
		{
			a = Utility.get_canvas_vector(a);

			ctx.beginPath();
			ctx.arc(a.x, a.y, rad, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
		}
	}
	self.render = render;
}
