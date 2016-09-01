/*
 * One physics world. Nothing more.
 *
 * The physics component talks about how the game objects would interact with each other.
 *
 * Physics is implemented by attaching each game object to a physics object, with shapes, sizes, and callback methods.
 *
 * Only collision detection will be taken care of by the physics engine. The rest is upto the scripts.
 * No RigidBody simulations.
 */

function Physics_World()
{
	var self = this;
	var obj_arr = [];

	function add_obj(phy_obj)
	{
		obj_arr.push(phy_obj);
	}
	self.add_obj = add_obj;

	function remove_obj(phy_obj)
	{
		var index = 0;
		for (index = 0; index < obj_arr.length; index++)
			if (obj_arr[index].id == phy_obj.id)
				break;

		obj_arr.splice(index, 1);
	}
	self.add_obj = add_obj;

	/*
	 * Right now, make do with O(n^2) check
	 *
	 * TODO: Implement QuadTrees
	 * TODO: Complete rectangle checks
	 */
	function check_collisions()
	{
		for (var i = 1; i < obj_arr.length; i++)
			for (var j = 0; j < i; j++)
				handle_collision_check(obj_arr[i], obj_arr[j]);
		
		function handle_collision_check(a, b)
		{
			if (a.shape == b.shape)
			{
				switch (a.shape)
				{
					case 'circle':
						handle_circle(a, b);
						break;

					case 'rectangle':
						handle_rect(a, b);
						break;
				}
			}
			else
			{
				if (a.shape == 'circle')
					handle_circle_rectangle(a, b);
				else
					handle_circle_rectangle(b, a);
			}
		}

		function handle_circle(a, b)
		{
			var dim_a = a.get_real_dimensions(),
				dim_b = b.get_real_dimensions();

			function square(x)
			{
				return x * x;
			}

			var dis_sqrd = square(dim_a.position.x - dim_b.position.x) + square(dim_a.position.y - dim_b.position.y);
			var rad_sum_sqrd = square(dim_a.radius + dim_b.radius);

			if (dis_sqrd <= rad_sum_sqrd)
				handle_callbacks(a, b);
		}

		function handle_rectangle(a, b)
		{
		}

		// a is circle, b is rectangle
		function handle_circle_rectangle(a, b)
		{
		}

		function handle_callbacks(a, b)
		{
			a.game_object.run_physics_cb(b.game_object);
			b.game_object.run_physics_cb(a.game_object);
		}
	}
	self.check_collisions = check_collisions;

	Object.freeze(self);
}

Physics_World.Instance = new Physics_World();
Object.freeze(Physics_World);

/*
 * The Physics_Object is a holder of data. Main updating is done only in the Physics_World updates.
 * 
 * Assume the shape is pivoted to the position of the game_object.
 */
var phy_id = 0;
function Physics_Object(params)
{
	var self = this;
	self.game_object = params.game_object;
	self.id = phy_id++;

	self.shape = params.shape;
	switch (self.shape)
	{
		case 'circle':
			self.radius = params.radius;
			break;
		
		case 'rectangle':
			self.length = params.length;
			self.breadth = params.breadth;

			break;
	}

	// For circles, only the x-value in scale will be considered
	function get_real_dimensions()
	{
		var abs_transform = self.game_object.get_absolute_transform();
		
		var res = new Object();
		res.position = new Vector(0, 0);
		res.position.assign(abs_transform.position);
		res.rotation = abs_transform.rotation;

		switch (self.shape)
		{
			case 'circle':
				res.radius = self.radius * abs_transform.scale.x;
				break;

			case 'rectangle':
				res.length = self.length * abs_transform.scale.x;
				res.breadth = self.breadth * abs_transform.scale.y;
				break;
		}

		return res;
	}
	self.get_real_dimensions = get_real_dimensions;

	Physics_World.Instance.add_obj(self);

	function kill()
	{
		Physics_World.Instance.remove_obj(self);
	}
	self.kill = kill;

	Object.freeze(self);
}
Object.freeze(Physics_Object);
