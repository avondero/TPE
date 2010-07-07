/*  Tanus Prototype Extension , version 1.0
 *  (c) 2010 Avonde Romain
 *
 *  TPE is freely distributable under the terms of an MIT-style license.
 *
 *	With scripts made by kangax
 *
 *--------------------------------------------------------------------------*/

TPE.Form = {};

TPE.Form.Methods = {
	
	validate: function(form, klass){
		form = $(form);
		var elements = form.getElements().findAll(function(el){
			return el.tagName.toLowerCase() == 'input' && !el.type.match(/button|reset|hidden|submit|radiobutton|checkbox/);
		});
		return elements.collect(function(el){
			return el.validate(klass);
		}).all(function(el){
			return el;
		});
	},
	
	validateOnKeyPress: function(form){
		form.getElements().findAll(function(el){
			return el.tagName.toLowerCase() == 'input' && !el.type.match(/button|reset|hidden|submit/);
		}).each(function(el){
			el.validateOnKeyPress();
		});
	},
	
	checkBoxRange: function(form, elements){
		elements = elements ? $$(elements) : form.select('input[type=checkbox]');
		var lastChecked = null;
		document.observe('click', function(e, el) {
      if (!(el = e.findElement('input[type="checkbox"]'))) return;
      if (e.shiftKey && lastChecked) {
        var currentIndex = elements.indexOf(el), 
            lastIndex = elements.indexOf(lastChecked);
        for (var i=Math.min(currentIndex, lastIndex); i<Math.max(currentIndex, lastIndex); i++) {
          elements[i].checked = true;
        }
      }
      if (el.checked) lastChecked = el;
    }.bind(this))
	}

};

TPE.Form.Element = {};

TPE.Form.Element.Methods = (function(){

	var validate = function(element, klass){
		element = $(element);
		var type = (element.hasAttribute('type'))? element.readAttribute('type'): 'text';
		var valid = TPE.Form.Element.Tag[type](element);
		if(klass)	{
			element.enableClassName('valid', valid).enableClassName('no-valid', !valid);
		}
		return valid;
	};
	
	var validateOnKeyPress = function(element){
		element = $(element);
		element.keyup(function(e){
			if(e.which != Event.KEY_SHIFT)
				this.validate(true);
		});
	};
	
	return {
		validate: validate,
		validateOnKeyPress: validateOnKeyPress
	}
})();

TPE.Form.Element.Tag = {
	
	number: function(element){
		return !parseFloat($F(element)).isNaN();
	},
	
	url: function(element){
		var value = $F(element);
		var valueExt = value.substring(value.lastIndexOf('.'), value.length).toLowerCase();
		return value.startsWith('http://') && TPE.Utils.EXTENSIONS_WEB.indexOf(valueExt) != -1;
	},
	
	mail: function(element){
		var value = $F(element);
		var valueExt = value.substring(value.lastIndexOf('.'), value.length).toLowerCase();
		return value.include('@') && TPE.Utils.EXTENSIONS_WEB.indexOf(valueExt) != -1;
	},
	
	date: function(element){
		var expDate = /[0-9]{4}-(([0][0-9])|([1][0-2]))-(([0-2][0-9])|([3][0-1]))/g;
		return !!$F(element).match(expDate);
	},
	
	time: function(element){
		var expDate = /(([0][0-9])|([1][0-2])|([2][0-3])):(([0-5][0-9]))/g;
		return !!$F(element).match(expDate);
	},
	
	text: function(element){
		return element.hasAttribute('required')?!$F(element).blank():true;
	}
	
};

//###########################################################################################//

(function(){	
	
	if (TPE.Utils.paramScript === "true") {
		Object.extend(TPE.Form, TPE.Form.Methods);
		Element.addMethods('form', TPE.Form.Methods);
		Element.addMethods('input', TPE.Form.Element.Methods);
	}
})();


