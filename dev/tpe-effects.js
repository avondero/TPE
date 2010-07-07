if (typeof Effect === 'object')
	TPE.Effects = (function(){
		var FadeV = function(element) {
			element = $(element);
			var oldOpacity = element.getInlineOpacity();
			var options = Object.extend({
				from: element.getOpacity() || 1.0,
				to:   0.0,
				afterFinishInternal: function(effect) {
					if (effect.options.to!=0) return;
					effect.element.hideV().setStyle({opacity: oldOpacity});
				}
			}, arguments[1] || { });
			return new Effect.Opacity(element,options);
		};
		
		var AppearV = function(element) {
			element = $(element);
			var options = Object.extend({
			from: (element.getStyle('visibility') == 'hidden' ? 0.0 : element.getOpacity() || 0.0),
			to:   1.0,
			// force Safari to render floated elements properly
			afterFinishInternal: function(effect) {
				effect.element.forceRerendering();
			},
			beforeSetup: function(effect) {
				effect.element.setOpacity(effect.options.from).showV();
			}}, arguments[1] || { });
			return new Effect.Opacity(element,options);
		};
		
		return {
			FadeV: FadeV,
			AppearV: AppearV,
			Methods: {}
		}
		
	})();

if (typeof Effect === 'object')
$w('fadeV appearV').each(
	function(effect) {
		TPE.Effects.Methods[effect] = function(element, options){
			element = $(element);
			TPE.Effects[effect.charAt(0).toUpperCase() + effect.substring(1)](element, options);
			return element;
		};
	}
);

//###########################################################################################//

(function(){	
	if (TPE.Utils.paramScript === "true") {
		if (typeof Effect === 'object')
			Element.addMethods(TPE.Effects.Methods);
	}
})();


