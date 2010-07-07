TPE.Events = {};

$w('click mouseover mousedown mouseup mousemove mouseout keydown keyup keypress mousewheel scroll').each(
	function(events){
		TPE.Events[events] = function(element, fct){
			element = $(element);
			element.observe(events, fct);
			return element;		
		};
	}
);

Object.extend(Event, {
	KEY_SHIFT: 16,
	
	/*
 * Orginal: http://adomas.org/javascript-mouse-wheel/
 * prototype extension by "Frank Monnerjahn" <themonnie@gmail.com>
 */
	
	wheel:function (event){
		var delta = 0;
		if (!event) event = window.event;
		if (event.wheelDelta) {
			delta = event.wheelDelta/120; 
			if (window.opera) delta = -delta;
		} else if (event.detail) { delta = -event.detail/3;	}
		return Math.round(delta); //Safari Round
	}
});

//###########################################################################################//

(function(){	
	if (TPE.Utils.paramScript === "true") {
		Element.addMethods(TPE.Events);
		Element.addMethods('input', TPE.Events);
	}
})();


