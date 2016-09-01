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

function basic_physics_test()
{
	var ball_1 = new Game_Object({
		position: new Vector(5, 0),
		rotation: 0,
		scale: new Vector(1, 1)	
	});

	var ball_2 = new Game_Object({
		parent: ball_1,
		position: new Vector(-5, 0),
		rotation: 0,
		scale: new Vector(1, 1)	
	});

	var physics_params = {
		shape: 'circle',
		radius: 10
	};

	ball_1.add_physics_component(physics_params);
	ball_2.add_physics_component(physics_params);

	ball_1.add_physics_cb_script(function cb(other) {
		console.log("Collision detected by ball of id " + ball_1.id);	
		console.log(other.transform.position);
		console.log(other.get_absolute_transform().position);
		console.log(other.parent);
	});

	ball_2.add_physics_cb_script(function cb(other) {
		console.log("Collision detected by ball of id " + ball_2.id);	
		console.log(other.transform.position);
		console.log(other.get_absolute_transform().position);
	});
}

function init()
{
}

function update()
{
	Physics_World.Instance.check_collisions();
}

window.requestAnimationFrame(reqAnimCb);
