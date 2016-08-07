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

	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.closePath();
}

window.requestAnimationFrame(reqAnimCb);
