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
	update(dt);
	draw();

	window.requestAnimationFrame(reqAnimCb);
}

var scene = new Game_Object({
	position: new Vector(0, 0),
	rotation: 0,
	scale: new Vector(1, 1)	
});

function basic_physics_test()
{
	var ball_1 = new Game_Object({
		parent: scene,
		position: new Vector(5, 0),
		rotation: 0,
		scale: new Vector(1, 1)	
	});

	var point = new Game_Object({
		parent: scene,
		position: new Vector(0, 0),
		rotation: 0,
		scale: new Vector(1, 1)	
	});

	var ball_2 = new Game_Object({
		parent: ball_1,
		position: new Vector(20, 0),
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
	});

	ball_2.add_physics_cb_script(function cb(other) {
		console.log("Collision detected by ball of id " + ball_2.id);	
	});

	ball_1.add_canvas_renderer(physics_params);
	ball_2.add_canvas_renderer(physics_params);
}

function init()
{
	basic_physics_test();
	scene.start();
}

function update(dt)
{
	scene.update(dt);
	Physics_World.Instance.check_collisions();
}

function draw()
{
	scene.draw();
}

window.requestAnimationFrame(reqAnimCb);
