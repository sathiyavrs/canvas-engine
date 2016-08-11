/*
 * TODO: start, update, and draw
 */ 
var game_object_id = 1;
var game_obj_arr = [];

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
			self.parent = params.parent;

		self.child_arr = [];
	}
	parent_child_constructor();

	function attach_child(game_object)
	{
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
			absolute_transform.scale.add(parent.transform.scale);

			parent = parent.parent;
		}

		return absolute_transform;
	}
	self.get_absolute_transform = get_absolute_transform;

	game_obj_arr.push(self);

	var script_arr = [];

	function add_script(script)
	{
		script_arr.push(script);
	}
	self.add_script = add_script;
	make_property_non_writable('add_script');

	function start()
	{
	}
	self.start = start;
	make_property_non_writable('start');

	function update()
	{
	}
	self.update = update;
	make_property_non_writable('update');

	function draw()
	{
		if (!self.render)
			return;
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
