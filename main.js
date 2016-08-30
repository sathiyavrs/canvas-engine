var ctx = (document.getElementById('canvas_id')).getContext("2d");

var lineCount = 0;
var prevTime = -1;
var dt;

function clearCanvas()
{
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function reqAnimCb(timeStamp)
{
	if (prevTime == -1)
	{
		init();
		prevTime = timeStamp;
		window.requestAnimationFrame(reqAnimCb);
		return;
	}
	else
	{
		dt = timeStamp - prevTime;
		prevTime = timeStamp;
	}

	clearCanvas();
	update();

	window.requestAnimationFrame(reqAnimCb);
}

function init()
{
}

function update()
{
	var x = Math.random() * 200;
	var y = Math.random() * 100;

	var a = new Vector(x, y);
	debug_draw({
		type: 'line',
		start: new Vector(0, 0),
		end: a
	});

	debug_draw({
		type: 'circle',
		center: new Vector(0, 0),
		radius: 7	
	});

	debug_draw({
		type: 'circle',
		center: a,
		radius: 5
	});
}

window.requestAnimationFrame(reqAnimCb);
