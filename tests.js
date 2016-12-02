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

function transform_test()
{
	var obj = new Game_Object({
		parent: scene,
		position: new Vector(100, 0),
		rotation: 0,
		scale: new Vector(1, 1)	
	});

	obj.add_canvas_renderer({
		shape: 'circle',
		radius: 3
	});

	obj = new Game_Object({
		parent: obj,
		position: new Vector(100, 100),
		rotation: 0,
		scale: new Vector(1, 1)
	});

	obj.add_canvas_renderer({
		shape: 'circle',
		radius: 6,
		color: '#009900'
	});

	obj = new Game_Object({
		parent: scene,
		position: new Vector(100, 100),
		rotation: 0,
		scale: new Vector(1, 1)
	});

	obj.add_canvas_renderer({
		shape: 'circle',
		radius: 9,
		color: '#990000'
	});
}

function basic_script_test()
{
	var obj = new Game_Object({
		parent: scene,
		position: new Vector(5, 0),
		rotation: 0,
		scale: new Vector(0.7, 1)	
	});

	obj.add_canvas_renderer({
		shape: 'circle',
		radius: 10
	});

	obj.add_script({
		speed: 200,
		distance_limit: 100,
		init_pos: new Vector(0, 0),
		dir: Vector.left(),

		start: function(game_object) {
			this.init_pos.assign(game_object.transform.position);
		},

		update: function(game_object, dt) {
			var dir = this.dir;
			var init_pos = this.init_pos;
			var distance_limit = this.distance_limit;
			var speed = this.speed;

			var delta_movement = new Vector(dir.x * dt * speed, dir.y * dt * speed);
			game_object.transform.position.add(delta_movement);

			if (Vector.distance_squared(game_object.transform.position, init_pos) > distance_limit * distance_limit)
				reverse_direction();

			if (Vector.distance_squared(game_object.transform.position, init_pos) < 1)
				change_direction();

			function reverse_direction()
			{
				dir.x *= -1;
				dir.y *= -1;
			}
			
			function change_direction()
			{
				dir.x = Math.random() * 2 - 1;
				dir.y = Math.random() * 2 - 1;

				dir.normalize();
			}

			debug_draw({
				type: 'line',
				start: init_pos,
				end: game_object.transform.position
			});

			debug_draw({
				type: 'circle',
				center: init_pos,
				radius: 10,
				fill: true,
				color: '#009900'
			});

			debug_draw({
				type: 'circle',
				center: init_pos,
				radius: distance_limit + game_object.renderer.radius,
				fill: false,
				color: '#009900'
			});
		}
	});

}

function new_script()
{
	var obj = new Game_Object({
		parent: scene,
		position: new Vector(0, 0),
		rotation: 0,
		scale: new Vector(1, 1)	
	});

	obj.add_canvas_renderer({
		shape: 'circle',
		radius: 10,
		color: '#009900'
	});

	obj.add_script({
		speed: 300,
		max_vec: new Vector(200, 200),
		min_vec: new Vector(-200, -200),
		dir: Vector.left(),

		start: function(game_object) {
		},

		update: function(game_object, dt) {
			var max_vec = this.max_vec,
				min_vec = this.min_vec,
				dir = this.dir,
				speed = this.speed;

			function reverse_dir()
			{
				dir.x = Math.random() * 2 - 1;
				dir.y = Math.random() * 2 - 1;

				dir.normalize();
			}
			
			function above_limits()
			{
				var pos = game_object.transform.position;
				if (pos.x > max_vec.x || pos.y > max_vec.y)
					return true;

				if (pos.x < min_vec.x || pos.y < min_vec.y)
					return true;

				return false;
			}

			if (above_limits())
				reverse_dir();

			var delta_movement = new Vector(dir.x * speed * dt, dir.y * speed * dt);
			game_object.transform.position.add(delta_movement);

			var top_left = new Vector(min_vec.x, max_vec.y);
			var bottom_right = new Vector(max_vec.x, min_vec.y);

			var poly_points = [top_left, max_vec, bottom_right, min_vec];
			debug_draw({
				type: 'polygon',
				points: poly_points
			});
		}	
	});
}

function kill_test()
{
	var obj = new Game_Object({
		parent: scene,
		position: new Vector(0, 0),
		rotation: 0,
		scale: new Vector(1, 1)
	});

	var params = {
		shape: 'circle',
		radius: 10
	};

	obj.add_canvas_renderer(params);
	obj.add_physics_component(params);
	obj.add_physics_cb_script(function cb(other) {
		obj.kill();
		console.log("HEYO");
	})

	var obj_2 = new Game_Object({
		parent: scene,
		position: new Vector(100, 0),
		rotation: 0,
		scale: new Vector(1, 1)	
	});

	obj_2.add_canvas_renderer(params);
	obj_2.add_physics_component(params);

	obj_2.add_script({
		speed: 100,

		update: function(game_object, dt) {
			var delta_movement = new Vector(this.speed * -1 * dt, 0);
			game_object.transform.position.add(delta_movement);

			if (game_object.transform.position.x < -100)
				game_object.kill();
		}
	});
}

function particle_test()
{
	var particle_root = new Game_Object({
		parent: scene,
		position: new Vector(0, 200),
		rotation: 0,
		scale: new Vector(1, 1)
	});

	var x_disp = 60,
		y_disp = 30;

	var particle_script = {
		speed: 100,
		dir: Vector.down(),
		lower_y: -200,
		directional_multiplier: 4,

		start: function(game_object) {
			// console.log("sup");
		},

		update: function(game_object, dt) {
			this.dir.x = Math.random() * this.directional_multiplier - this.directional_multiplier / 2;
			this.dir.normalize();

			var speed = this.speed;
			var dir = this.dir;
			var lower_y = this.lower_y;

			var delta_movement = new Vector(dt * speed * dir.x, dt * speed * dir.y);
			game_object.transform.position.add(delta_movement);

			if (game_object.get_absolute_transform().position.y < lower_y)
				game_object.kill();

			debug_draw({
				type: 'line',
				start: new Vector(-100, lower_y),
				end: new Vector(100, lower_y)
			});
		}
	};

	var root_script = {
		rate: 0.1,
		prev_time: 0,

		update: function(game_object, dt) {
			this.prev_time += dt;
			if (this.prev_time < this.rate)
				return;
			
			this.prev_time = 0;
			var obj = { };
			obj = new Game_Object({
				parent: game_object,
				position: new Vector(0, 0),
				rotation: 0,
				scale: new Vector(1, 1)	
			});

			obj.add_canvas_renderer({
				shape: 'circle',
				radius: 2,
				color: '009990'	
			});

			obj.add_script(particle_script);
		}
	};

	particle_root.add_script(root_script);
}
