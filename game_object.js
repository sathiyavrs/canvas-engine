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

	function get_absolute_transform()
	{
		var absolute_transform = new Transform({ default: true });
		absolute_transform.assign(self.transform);

		var parent = self.parent;
		while (parent != undefined)
		{
			absolute_transform.position.add(parent.transform.position);
			absolute_transform.rotation += parent.rotation;
			absolute_transform.scale.simple_product(parent.transform.scale);

			parent = parent.parent;
		}

		return absolute_transform;
	}
	self.get_absolute_transform = get_absolute_transform;
	make_property_non_writable('get_absolute_transform');

	game_obj_arr.push(self);

	/*
	 * Alright, now for the script system.
	 *
	 * Each object's behavior will be defined by the scripts that it runs.
	 * The order of execution of the scripts is FIFO.
	 */
	var script_arr = [];

	function add_script(script, tag)
	{
		script.tag = tag;
		script_add.push(script);
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
	 * Start and Update methods are standard in most game engines.
	 *
	 * Update takes in delta_time as a parameter.
	 */
	function start()
	{
		script_arr.forEach(function(script) {
			if (script.start)
				script.start();	
		});

		self.child_arr.forEach(function(child) {
			child.start();	
		});
	}
	self.start = start;
	make_property_non_writable('start');

	function update(dt)
	{
		script_arr.forEach(function(script) {
			if (script.update)
				script.update(dt);	
		});

		self.child_arr.forEach(function(child) {
			child.update(dt);	
		});
	}
	self.update = update;
	make_property_non_writable('update');

	/*
	 * TODO: Connection to rendering engine
	 */
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
