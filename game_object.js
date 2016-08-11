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
