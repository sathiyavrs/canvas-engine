var game_object_id = 1;
var game_obj_arr = [];

/*
 * Game_Object is the base object in this engine.
 * 
 * The definition of Game_Object has to account for all types of implementations of the idea of the basic Game Object.
 * This requirement imposes a necessity for this object to be very, very basic.
 *
 * Game Objects in most games form a tree-like structure. During rendering, for instance, the pre-order traversal of the tree is the rendering order.
 * While I probably won't be doing that, I'll be incorporating a parent-child model to manifest the idea of the tree structure.
 *
 * TODO: Add kill functionality
 * TODO: Think about removing game_obj_arr
 * TODO: Remove physics object
 */
function Game_Object(params)
{
	var self = this;
	self.transform = new Transform(params);
	self.id = game_object_id++;

	function make_property_non_writable(property)
	{
		Object.defineProperty(self, property, { writable: false });
	}
	make_property_non_writable('id');
	make_property_non_writable('transform');

	function parent_child_constructor()
	{
		if (params.parent)
		{
			// TODO: Check that params.parent is an instance of Game_Object
			self.parent = params.parent;
			self.parent.attach_child(self);
		}

		self.child_arr = [];
	}
	parent_child_constructor();
	game_obj_arr.push(self);

	function attach_child(game_object)
	{
		if (game_object.parent && game_object.parent.id != self.id)
			throw new error("Game Object child being attached to wrong parent");

		if (!game_object.parent)
			game_object.parent = self;

		self.child_arr.push(game_object);
	}
	self.attach_child = attach_child;
	make_property_non_writable('attach_child');

	/*
	 * Kill functionality. Call game_object.kill() to kill the game_object.
	 *
	 * Will search the list for the game_object by id, and remove it from the list. O(n) operation
	 */

	function kill_child(game_object)
	{
		if (game_object.parent.id != self.id)
			return;

		var index = -1;
		for (var i = 0; i < self.child_arr.length; i++)
			if (game_object.id == self.child_arr[i].id)
				index = i;
		
		if (index < 0)
			return;

		self.child_arr.splice(index, 1);

		game_object.kill();
	}
	self.kill_child = kill_child;
	make_property_non_writable('kill_child');

	function kill_all_children()
	{
		while (self.child_arr.length > 0)
			kill_child(self.child_arr[0]);
	}

	function kill()
	{
		if (self.parent.id != self.id)
			self.parent.kill_child(self);

		if (self.child_arr.length != 0)
			kill_all_children();

		if (self.physics_object)
			self.physics_object.kill();

		var index = -1;
		for (var i = 0; i < game_obj_arr.length; i++)
			if (game_obj_arr[i].id == self.id)
				index = i;

		if (index < 0)
			return;

		game_obj_arr.splice(index, 1);
	}
	self.kill = kill;
	// make_property_non_writable('kill');
	
	function detach_child(game_object)
	{
		var index = -1;
		for (var i = 0; i < self.child_arr.length; i++)
			if (self.child_arr[i].id == game_object.id)
				index = i;

		if (index < 0)
			return;

		self.child_arr.splice(index, 1);
	}
	self.detach_child = detach_child;
	make_property_non_writable('detach_child');

	/*
	 * TODO: Optimize
	 */
	function kill_alternate()
	{
		var id_arr = [];

		function push_ids(game_object, id_arr)
		{
			id_arr.push(game_object.id);
			game_object.child_arr.forEach(function(obj) {
				push_ids(obj, id_arr);	
			});
		}

		push_ids(self, id_arr);

		var index_arr = [];
		var new_arr = [];
		var bad_id = false;

		for (var i = 0; i < id_arr.length; i++)
			index_arr.push(-1);

		/*
		 * TODO: Optimize to O(n * log(n)), by sorting and binary search
		 */
		for (var i = 0; i < game_obj_arr.length; i++)
		{
			bad_id = false;
			for (var j = 0; j < index_arr.length; j++)
			{
				if (id_arr[j] == game_obj_arr[i].id)
				{
					bad_id = true;
					index_arr[j] = i;

					// TODO: Decide necessity of next line
					// game_obj_arr[i].parent.detach_child(game_obj_arr[i]);
					
					if (game_obj_arr[i].physics_object)
						game_obj_arr[i].physics_object.kill();
				}
			}

			if (!bad_id)
				new_arr.push(game_obj_arr[i]);
		}

		game_obj_arr = new_arr;

		self.parent.detach_child(self);
	}
	self.kill = kill_alternate;
	make_property_non_writable('kill');

	/*
	 * Utility stuff
	 */

	function get_absolute_transform()
	{
		var absolute_transform = new Transform({ default: true });
		absolute_transform.assign(self.transform);

		var parent = self.parent;
		while (parent != undefined)
		{
			absolute_transform.position.add(parent.transform.position);
			absolute_transform.rotation += parent.transform.rotation;
			absolute_transform.scale.simple_product(parent.transform.scale);

			parent = parent.parent;
		}

		return absolute_transform;
	}
	self.get_absolute_transform = get_absolute_transform;
	make_property_non_writable('get_absolute_transform');

	/*
	 * Alright, now for the script system.
	 *
	 * Each object's behavior will be defined by the scripts that it runs.
	 * The order of execution of the scripts is FIFO.
	 */
	var script_arr = [];
	var script_started_arr = [];

	function add_script(script, tag)
	{
		if (tag)
			script.tag = tag;
		script_arr.push(script);
		script_started_arr.push(false);
	}
	self.add_script = add_script;
	make_property_non_writable('add_script');

	function get_script_by_tag(tag)
	{
		for (var prop in script_arr)
			if (script_arr.hasOwnProperty(prop))
				if (script_arr[prop].tag == tag)
					return script_arr[prop];
	}

	/*
	 * Connection to the physics engine
	 *
	 * The physics engine represents the interaction between different game objects
	 * 
	 * As of now, the physics engine provides support only upto collision detection. I want to add support for raycasting soon.
	 *
	 * Each callback method takes in one parameter: the other game object involved in the collision
	 * Callback execution order is in FIFO
	 *
	 * TODO: Implement multiple physics objects per game Object through pivots
	 */

	function add_physics_component(params)
	{
		params.game_object = self;
		self.physics_object = new Physics_Object(params);
	}
	self.add_physics_component = add_physics_component;
	make_property_non_writable('add_physics_component');

	self.physics_cb_script_arr = [];
	function add_physics_cb_script(cb)
	{
		self.physics_cb_script_arr.push(cb);
	}
	self.add_physics_cb_script = add_physics_cb_script;

	function run_physics_cb(other)
	{
		self.physics_cb_script_arr.forEach(function(cb) {
			cb(other);	
		});
	}
	self.run_physics_cb = run_physics_cb;

	/*
	 * TODO: Fix hack in start. The bug involves the start function never being fired off because the script was added after scene.start(). Consequently, the start method is never called, as scene.start() is never called.
	 * Hack involves a new array that indicates if a script has been started: script_started_arr
	 *
	 * Start and Update methods are standard in most game engines.
	 *
	 * Update takes in delta_time as a parameter.
	 */
	
	function start()
	{
		script_arr.forEach(function(script, index) {
			if (script.start)
			{
				script.start(self);	
				script_started_arr[index] = true;
			}
		});

		self.child_arr.forEach(function(child) {
			child.start();
		});
	}
	self.start = start;
	make_property_non_writable('start');

	function update(dt)
	{
		script_arr.forEach(function(script, index) {
			if (!script_started_arr[index] && script.start)
			{
				script.start(self);	
				script_started_arr[index] = true;
				return;
			}

			if (script.update)
				script.update(self, dt);	
		});

		self.child_arr.forEach(function(child) {
			child.update(dt);	
		});
	}
	self.update = update;
	make_property_non_writable('update');

	/*
	 * The rendering system isn't fully separated from the game object system, like the physics system.
	 * For simpler implementation of the preorder rendering system, it makes sense for the rendering to be controlled within the definition of the Game Object
	 *
	 * TODO: Implement multiple renderers per game_object
	 */

	function add_canvas_renderer(params)
	{
		params.game_object = self;
		self.renderer = new Canvas_Renderer(params);
	}
	self.add_canvas_renderer = add_canvas_renderer;
	make_property_non_writable('add_canvas_renderer');

	function draw()
	{
		if (self.renderer)
			self.renderer.render();

		self.child_arr.forEach(function(child) {
			child.draw();	
		});
	}
	self.draw = draw;
	make_property_non_writable('draw');
}

Game_Object.find_object_by_id = function(id)
{
	for (var obj in game_obj_arr)
		if (obj.id == id)
			return obj;
}

function freeze_game_object()
{
	for(var obj in Game_Object)
		if (Game_Object.hasOwnProperty(obj))
			if (typeof(Game_Object[obj]) == "function")
				Object.freeze(Game_Object[obj]);

	Object.freeze(Game_Object);
}

freeze_game_object();
