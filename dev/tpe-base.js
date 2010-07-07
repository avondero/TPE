/*  Tanus Prototype Extension , version 1.0
 *  (c) 2010 Avonde Romain
 *
 *  TPE is freely distributable under the terms of an MIT-style license.
 *
 *	With scripts made by kangax
 *
 *--------------------------------------------------------------------------*/
 
if (typeof(Prototype) == "undefined")
	throw "TPE requires Prototype to be loaded.";
 
var TPE = (function(){

	var scriptName = 'tpe-base.js';
	var window = this;
	
	var myUtils = (function(){
		var EXTENSIONS_WEB = $w('.com .info .net .org .fr .biz .name .pro ' + 
			'.aero .asia .cat .coop .edu .gov .int .jobs .mil .mobi ' + 
			'.museum .tel .travel .ac  .ad  .ae  .af  .ag  .ai  .al  ' + 
			'.am  .an  .ao  .aq  .ar  .as  .at  .au  .aw  .ax  .az  ' + 
			'.ba  .bb  .bd  .be  .bf  .bg  .bh  .bi  .bj  .bm  .bn  ' + 
			'.bo  .br  .bs  .bt  .bw  .by  .bz  .ca  .cc  .cd  .cf  ' + 
			'.cg  .ch  .ci  .ck  .cl  .cm  .cn  .co  .cr  .cu  .cv  ' + 
			'.cx  .cy  .cz  .de  .dj  .dk  .dm  .do  .dz  .ec  .ee  ' + 
			'.eg  .er  .es  .et  .eu  .fi  .fj  .fk  .fm  .fo  .fr  ' + 
			'.ga  .gd  .ge  .gf  .gg  .gh  .gi  .gl  .gm  .gn  .gp  ' + 
			'.gq  .gr  .gs  .gt  .gu  .gw  .gy  .hk  .hm  .hn  .hr  ' + 
			'.ht  .hu  .id  .ie  .il  .im  .in  .io  .iq  .ir  .is  ' + 
			'.it  .je  .jm  .jo  .jp  .ke  .kg  .kh  .ki  .km  .kn  ' + 
			'.kp  .kr  .kw  .ky  .kz  .la  .lb  .lc  .li  .lk  .lr  ' + 
			'.ls  .lt  .lu  .lv  .ly  .ma  .mc  .md  .me  .mg  .mh  ' + 
			'.mk  .ml  .mm  .mn  .mo  .mp  .mq  .mr  .ms  .mt  .mu  ' + 
			'.mv  .mw  .mx  .my  .mz  .na  .nc  .ne  .nf  .ng  .ni  ' + 
			'.nl  .no  .np  .nr  .nu  .nz  .om  .pa  .pe  .pf  .pg  ' + 
			'.ph  .pk  .pl  .pn  .pr  .ps  .pt  .pw  .py  .qa  .re  ' + 
			'.ro  .rs  .ru  .rw  .sa  .sb  .sc  .sd  .se  .sg  .sh  ' + 
			'.si  .sk  .sl  .sm  .sn  .sr  .st  .su  .sv  .sy  .sz  ' + 
			'.tc  .td  .tf  .tg  .th  .tj  .tk  .tl  .tm  .tn  .to  ' + 
			'.tr  .tt  .tv  .tw  .tz  .ua  .ug  .uk  .us  .uy  .uz  ' + 
			'.va  .vc  .ve  .vg  .vi  .vn  .vu  .wf  .ws  .ye  .yt  ' + 
			'.za  .zm  .zw');
		
		var addScript = function(url, callback){
			var head = $$('head')[0];
			var jsEl = new Element('script', {
				id: "Sc_" + url.split('/').last().split('.')[0],
				type: 'text/javascript',
				src: url
			});
			jsEl.onload = callback;
			head.insert({
				bottom: jsEl
			});
			return $(jsEl);
		};
		
		var myConsole = {
			log: function(str){
				if(typeof console != "undefined")
					console.log(str);
				else
					return;
			},
			
			info: function(str){
				if(typeof console != "undefined")
					console.info(str);
				else
					return;
			}
		}
		
		var getParamValue = function(param, url){
			var u = url == undefined ? document.location.href : url;
			var reg = new RegExp('(\\?|&|^)' + param + '=(.*?)(&|$)');
			var matches = u.match(reg);
			if (matches == null) 
				return null;
			return matches[2] != undefined ? decodeURIComponent(matches[2]).replace(/\+/g, ' ') : '';
		};
		
		var paramScript = (function(){
			var selector = 'script[src*="' + scriptName + '"]';
			var srcScript = $$(selector).pluck('src')[0];
			return getParamValue('extend', srcScript);
		})();
		
		return {
			EXTENSIONS_WEB: EXTENSIONS_WEB,
			paramScript: paramScript,
			console: myConsole,
			addScript: addScript,
			getParamValue: getParamValue
		}
	})();
	
	var myElement = {
		addHoverClassName: function(element, className){
			return $(element).observe('mouseover', Element.addClassName.curry(element, className)).observe('mouseout', Element.removeClassName.curry(element, className));
		},
		
		display: function(element, display) {
			element = $(element);
			element.style.display = display;
			return element;
		},
		
		hideV: function(element) {
			element = $(element);
			element.style.visibility = 'hidden';
			return element;
		},
		showV: function(element) {
			element = $(element);
			element.style.visibility = 'visible';
			return element;
		},
		
		swapClassName: function(element, first, second){
			return Element.removeClassName(element, first).addClassName(second);
		},
		
		enableClassName: function(element, className, condition){
			return Element[condition ? 'addClassName' : 'removeClassName'](element, className);
		},
		
		getParamValue: function(element, param){
		
			var el = $(element);
			
			if (el.src == undefined) 
				return null;
			var u = el.src
			reg = new RegExp('(\\?|&|^)' + param + '=(.*?)(&|$)');
			var matches = u.match(reg);
			if (matches == null) 
				return null;
			return matches[2] != undefined ? decodeURIComponent(matches[2]).replace(/\+/g, ' ') : '';
		},
		
		cloneWithEvent: function(element, deep){
			element = $(element);
			var clone = element.clone(deep);
			var registry = Element.retrieve(element, 'prototype_event_registry', $H());
			Element.store(clone, 'prototype_event_registry', registry);
			registry.each(function(eventName){
				$A(eventName.value).each(function(fct){
					Element.observe(clone, eventName.key, fct);
				});
			});
			if (deep) 
				element.descendants().each(function(desc, index){
					var registryElement = Element.retrieve(desc, 'prototype_event_registry', $H());
					var cloneDesc = clone.descendants()[index];
					registryElement.each(function(eventName){
						$A(eventName.value).each(function(fct){
							Element.observe(cloneDesc, eventName.key, fct);
						});
					});
				});
			
			return clone;
		}
	};
	
	return {
		scriptName: scriptName,
		window: window,
		Utils: myUtils,
		Element: myElement
	}
	
})();

//###########################################################################################//

(function(){	
	
	if (TPE.Utils.paramScript === "true") {
		Element.addMethods(TPE.Element);
	
		$Sc = TPE.Utils.addScript;
	}
})();


