TPE.Utils.CSS = {};

TPE.Utils.CSS.Methods = {

	isLoaded: function(url){		
		return !!$A(document.styleSheets).findAll(function(stylesheet){
			return stylesheet.href === url;
		}).length;
	},

	loadCSS: function(url){
		var options = Object.extend({
				media: 'screen',
				idCss: '',
				title: '',
				onload: Prototype.emptyFunction
			}, arguments[1] || {}
		);
		
		if($(options.idCss)) return;
		
		var link = new Element('link', {
			'rel': 'stylesheet',
			'type': 'text/css',
			'href': url,
			'title': options.title,
			'media': (options.media.match(/all|braille|embossed|handheld|print|projection|screen|speech|tty|tv/))?options.media:'screen',
			'id': options.idCss
		});
		
		if(TPE.Utils.CSS.isLoaded(link.href)) return;
		
		link.onload = options.onload;
		$$('head')[0].insert(link);
		return link.sheet;
	}
};

//###########################################################################################//

(function(){	
	
	if (TPE.Utils.paramScript === "true") {
		Object.extend(TPE.Utils.CSS, TPE.Utils.CSS.Methods);
		if(typeof CSS === "undefined")
		CSS = TPE.Utils.CSS;
	
		$Css = TPE.Utils.CSS.loadCSS;
		}
})();


