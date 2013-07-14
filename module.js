void function JS_LOADER_PLUGIN(root) {
  
	function get(path, async, callback) {
		if (typeof async == 'function' && !callback)
			callback = async, async = true;
		var xhr = new XMLHttpRequest;
		xhr.open('GET', path, async);
		xhr.send();
		xhr.onload = function(e) {
			!callback || xhr.status != 200 || !async || callback.call(this, xhr.response, xhr);
		};
		return xhr.response;
	};
	
	function Module(id, scope) {
		
		this.id = id;
		this.children = [];
		
		this.require = function(path, scope) {
			var module = new Module(path);
			module.parent = this;
			module.scope = scope || {};
			module.exports = {};
			this.children.push(module);
			module.load();
			
			return module.exports;
		}.bind(this);
	};
	
	Module.prototype.load = function() {
		var source = get(this.id);
		new Function('module', 'scope', 'exports', 'require', 'with(scope){\n'+source+'\n}')
			.call(this, this, this.scope, this.exports, this.require);
	};
	
	root.require = new Module('/').require;
	
}(this);
