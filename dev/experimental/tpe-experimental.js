/**
 * Fonction chargeant une fonction en particulier ==> à finir
 *
 * @param {Object} file
 * @param {Object} fct
 */

var require = function(file, fct){
 new Ajax.Request(file,{
 contentType: 'text/javascript',
 onSuccess: function(response){
 //console.log(new String(response.responseText).strip());
 reg = new RegExp('function(.*)\((.*)\){(\r\n\t(.*))+\r\n}');
 reg2 = new RegExp('\w+((:\x20)|(\x20=\x20))function(.*)\((.*)\){(\r\n\t(.*))+');
 matches = response.responseText.match(reg);
 console.log(matches);
 //eval(response.responseText);
 //console.log(arr);
 }
 });
 //this.eval(req.transport.responseText);
 };

	 
TPE.History = Class.create({
	initialize: function(){
		this.history = new Array();
		this.current = -1;
	},
	
	go: function(url, fct){
		if (this.history.lastIndexOf(url) < 0) 
			this.history.push(url);
		this.current = this.history.lastIndexOf(url);
		fct();
	},
	
	back: function(){
		if (this.current > 0) 
			this.go(this.history[this.current - 1]);
	},
	
	forward: function(){
		if (this.current >= 0 && this.current != this.history.length - 1) 
			this.go(this.history[this.current + 1]);
	}
});