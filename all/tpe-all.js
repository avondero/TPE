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
	
	var Version = '0.5a';
	
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

		var scriptName = 'tpe-all.js';
		var window = this;
		
		var paramScript = (function(){
			var selector = 'script[src*="' + scriptName + '"]';
			var srcScript = $$(selector).pluck('src')[0];
			return getParamValue('extend', srcScript);
		})();
		
		return {
			EXTENSIONS_WEB: EXTENSIONS_WEB,
			paramScript: paramScript,
			console: myConsole,
			getParamValue: getParamValue,
			WINDOW: window,
			scriptName: scriptName
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
		Utils: myUtils,
		Element: myElement,
		Version: Version
	}
	
})();

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
		form = $(form);
		form.getElements().findAll(function(el){
			return el.tagName.toLowerCase() == 'input' && !el.type.match(/button|reset|hidden|submit/);
		}).each(function(el){
			el.validateOnKeyPress();
		});
	},
	
	checkBoxRange: function(form, elements){
		form = $(form);
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
		return !isNaN(parseFloat($F(element)));
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

TPE.Date = (function(){
	var regExpDay = new RegExp("(([0-2][0-9])|([3][0-1]))");
	var regExpMonth = new RegExp("(([0][0-9])|([1][0-2]))");
	var regExpYear = new RegExp("[0-9]{4}");
	var regExpYearMin = new RegExp("[0-9]{2}");
	
	var parse = function(date, pattern){
		if (!pattern) 
			return new Date(date);
		var day, month, year;
		
		pattern = new String(pattern);
		date = new String(date);
		
		var separator = (function(){
			if (pattern.include('-')) 
				return '-';
			if (pattern.include('/')) 
				return '/';
			return ' ';
		})();
		
		if (!date.include(separator)) 
			throw "La date et le pattern n'ont pas la meme syntaxe!! ";
		
		var patternArray = pattern.split(separator);
		var dateArray = date.split(separator);
		
		if (patternArray.length != dateArray.length) 
			throw "La date et le pattern n'ont pas la meme syntaxe!! ";
		
		dateArray.each(function(s, index){
			switch (patternArray[index]) {
				case "d":
					if (regExpDay.match(s)) {
						day = s;
					}
					else{
						throw "Erreur de syntaxe!!";
					}
					break;
				case "m":
					if (regExpMonth.match(s)) {
						month = s;
					}
					else{
						throw "Erreur de syntaxe!!";
					}
					break;
				case "yy":
					if (regExpYear.match(s)) {
						year = s;
					}
					else{
						throw "Erreur de syntaxe!!";
					}
					break;
				case "y":
					if (regExpYearMin.match(s)) {
						year = "20" + s;
					}
					else{
						throw "Erreur de syntaxe!!";
					}
					break;
				default:
					break;
			}
		});
		return new Date(year + "-" + month + "-" + day);
	};
	
	var compare = function(d1, d2){
		if (d1 > d2) 
			return 1;
		if (d1 < d2) 
			return -1;
		return 0;
	};
	
	return {
		parse: parse,
		compare: compare
	}
})();


TPE.Table = {

	HAS_DELETE_ROW: (function(){
		var table = new Element('table');
		return typeof table.deleteRow === 'function';
	})(),
	
	listTable: function(){
		return $$('table');
	}
};

TPE.Table.Methods = (function(){

	var alternateColor = {
		state: false,
		firstColor: '#FFF',
		secondColor: '#FFF',
		pair: false
	};
	
	var alternateClass = {
		state: false,
		firstClass: '',
		secondClass: '',
		pair: false
	};
	
	var toElement = function(element){
		return $(element);
	};
	
	var getHeadRows = function(element){
		return $A(element.tHead.rows);
	};
	
	var getBodyRows = function(element){
		return $A(element.tBodies[0].rows);
	};
	
	var getHeadCells = function(element, index){
		return TPE.Table.getHeadRows(element).map(function(row){
			return $A(row.cells)[index];
		});
	};
	
	var getBodyCells = function(element, index){
		return TPE.Table.getBodyRows(element).map(function(row){
			return $A(row.cells)[index];
		});
	};
	
	var nbColumns = function(element){
		var nbColumns = 0;
		if (element.tHead) 
			TPE.Table.getHeadRows(element).each(function(row){
				var rowLength = $A(row.cells).length;
				nbColumns = Math.max(rowLength, nbColumns);
			});
		else 
			TPE.Table.getBodyRows(element).each(function(row){
				var rowLength = $A(row.cells).length;
				nbColumns = Math.max(rowLength, nbColumns);
			});
		return nbColumns;
	};
	
	var alternateRowsColor = function(element, firstColor, secondColor, pair){
		TPE.Table.getBodyRows(element).each(function(row, index){
			if (pair) 
				if (index % 2 == 0) 
					row.setStyle({
						backgroundColor: firstColor
					});
				else 
					row.setStyle({
						backgroundColor: secondColor
					});
			else 
				if (index % 2 == 1) 
					row.setStyle({
						backgroundColor: firstColor
					});
				else 
					row.setStyle({
						backgroundColor: secondColor
					});
		});
		element.alternateColor = {
			state: true,
			firstColor: firstColor,
			secondColor: secondColor,
			pair: pair
		};
		return element;
	};
	
	var alternateRowsClass = function(element, firstClass, secondClass, pair){
		TPE.Table.getBodyRows(element).each(function(row, index){
			if (pair) 
				if (index % 2 == 0) 
					row.swapClassName(firstClass, secondClass);
				else 
					row.swapClassName(secondClass, firstClass);
			else 
				if (index % 2 == 1) 
					row.swapClassName(firstClass, secondClass);
				else 
					row.swapClassName(secondClass, firstClass);
		});
		element.alternateClass = {
			state: true,
			firstClass: firstClass,
			secondClass: secondClass,
			pair: pair
		};
		return element;
	};
	
	var hasAlternateColor = function(element){
		return !!(element.alternateColor && element.alternateColor.state);
	};
	
	var hasAlternateClass = function(element){
		return !!(element.alternateClass && element.alternateClass.state);
	};
	
	var addSimpleRow = function(element, contentArray, idRow){
		var nbColumns = TPE.Table.nbColumns(element);
		if (contentArray.length != nbColumns) 
			return;
		
		var tr = new Element('tr');
		for (var i = 0; i < nbColumns; i++) 
			tr.insert(new Element('td', {
				id: (idRow) ? idRow : ''
			}).update(contentArray[i]));
		element.tBodies[0].insert(tr);
		return element;
	};
	
	var addColspanRow = function(element, content){
		var nbColumns = TPE.Table.nbColumns(element);
		var tr = new Element('tr');
		tr.insert(new Element('td', {
			colspan: nbColumns
		}).update(content));
		element.tBodies[0].insert(tr);
		return element;
	};
	
	var deleteBodyRow = function(element, index, lastIndex){
		if (!index || index < 0) 
			return element;
		
		if (!TPE.Table.HAS_DELETE_ROW) {
			if (arguments.length == 2) 
				(element.tBodies[0].rows[index - 1]) ? element.tBodies[0].rows[index - 1].remove() : {};
		}
		
		if (index > lastIndex) 
			return element;
		if (lastIndex > element.tBodies[0].rows.length) 
			return element;
		
		for (var i = lastIndex - 1; i >= index - 1; i--) 
			element.tBodies[0].rows[i].remove();
		if (TPE.Table.hasAlternateColor(element)) 
			TPE.Table.alternateRowsColor(element, element.alternateColor.firstColor, element.alternateColor.secondColor, element.alternateColor.pair);
		
		if (TPE.Table.hasAlternateClass(element)) 
			TPE.Table.alternateRowsClass(element, element.alternateClass.firstClass, element.alternateClass.secondClass, element.alternateClass.pair);
		
		return element;
	};
	
	var deleteFirstBodyRow = function(element){
		if (!TPE.Table.HAS_DELETE_ROW) 
			TPE.Table.deleteBodyRow(element, 1);
		else 
			element.deleteRow(0);
	};
	
	var deleteLastBodyRow = function(element){
		$A(element.tBodies[0].rows).last().remove();
	};
	
	var makeSortable = function(element, indexHeader){
		var header = (indexHeader && !isNaN(indexHeader)) ? TPE.Table.getHeadRows(element)[indexHeader] : TPE.Table.getHeadRows(element).last();
		$A(header.children).each(function(cell){
			cell.setStyle({
				cursor: 'pointer'
			});
			cell.observe('click', function(){
				var typeDate = cell.hasAttribute('date') && !cell.attributes["date"].value.blank();
				var tBodySort = $A(element.tBodies[0].children).sort(function(a, b){
					if (typeDate) {
						//console.log(cell.attributes["pattern"].value);
						var x = TPE.Date.parse(a.cells[cell.cellIndex].innerHTML, cell.attributes["date"].value);
						var y = TPE.Date.parse(b.cells[cell.cellIndex].innerHTML, cell.attributes["date"].value);
						if (typeof(cell.retrieve('direction')) === "undefined" || cell.retrieve('direction') === 'desc') {
							return TPE.Date.compare(x, y);
						}
						else {
							return TPE.Date.compare(y, x);
						}
					}
					var x = isNaN(a.cells[cell.cellIndex].innerHTML) ? a.cells[cell.cellIndex].innerHTML : parseFloat(a.cells[cell.cellIndex].innerHTML);
					var y = isNaN(b.cells[cell.cellIndex].innerHTML) ? b.cells[cell.cellIndex].innerHTML : parseFloat(b.cells[cell.cellIndex].innerHTML);
					if (typeof(cell.retrieve('direction')) === "undefined" || cell.retrieve('direction') === 'desc') {
						if (x > y) return 1;
						if (x < y) return -1;
						return 0;
					}
					else {
						if (x > y) return -1;
						if (x < y) return 1;
						return 0;
					}
					
				});
				if (typeof(cell.retrieve('direction')) === "undefined" || cell.retrieve('direction') === 'desc') {
					cell.store('direction', 'asc');
				}
				else {
					cell.store('direction', 'desc');
				}
				TPE.Table.deleteBodyRow(element, 1, $A(element.tBodies[0].children).size());
				tBodySort.each(function(row){
					TPE.Table.addSimpleRow(element, $A(row.cells).pluck('innerHTML'));
				});
				if(element.alternateColor && element.alternateColor.state)
					element.alternateRowsColor(element.alternateColor.firstColor, element.alternateColor.secondColor, element.alternateColor.pair);
				if(element.alternateClass && element.alternateClass.state)
					element.alternateRowsClass(element.alternateClass.firstClass, element.alternateClass.secondClass, element.alternateClass.pair);
			});
		});
	};
	
	var fixedtableheader = function(element){
		var $tbl = $(element);
		var $tblhfixed = TPE.Table.getHeadRows(element);
		var $tblhfixed2 = $tbl.tHead;
		var headerrowsize = $tblhfixed.length;
		if ($tblhfixed.size() === 0) 
			throw "Votre tableau n'a pas de 'thead', veuillez en ajouter un.";
		
		var headerelement = "th";
		var nbTh = 0;
		$tblhfixed.each(function(tr){
			nbTh += tr.select(headerelement).length
		});
		if (nbTh == 0) 
			headerelement = "td";
		if (nbTh > 0) {
			$tblhfixed2.select(headerelement).each(function(th){
				th.setStyle({
					width: th.getWidth() + 'px'
				});
			});
			var $clonedTable = $tbl.clone();
			var tblwidth = $tbl.getWidth();
			/*$tblhfixed2.descendants().each(function(element){
			 console.log(element);
			 });*/
			$$("body")[0].insert($clonedTable.writeAttribute("id", "fixedtableheader").setStyle({
				"position": "fixed",
				"top": "0",
				"left": $tbl.positionedOffset().left
			}).insert({
				top: TPE.Element.cloneWithEvent($tblhfixed2, true)
			}).setStyle({
				width: tblwidth
			}).hide());
			window.onscroll = function(){
				$clonedTable.setStyle({
					"position": "fixed",
					"top": "0",
					"left": $tbl.positionedOffset().left - $(window).pageXOffset
				});
				
				if ($tblhfixed2.select(headerelement)[0].viewportOffset().top <= 0) 
					$clonedTable.show();
				else 
					$clonedTable.hide();
			};
			window.onresize = function(){
				if ($clonedTable.getWidth() != $tbl.getWidth()) {
					$tblhfixed2.select(headerelement).each(function(th, index){
						var w = th.getWidth();
						th.setStyle({
							width: w
						});
						$clonedTable.select(headerelement)[index].setStyle({
							width: w
						});
					});
					$clonedTable.setStyle({
						width: $tbl.getWidth()
					});
				}
				$clonedTable.setStyle({
					left: $tbl.positionedOffset().left
				});
			};
		}
	};

	return {
		makeSortable: makeSortable,
		alternateColor: alternateColor,
		alternateClass: alternateClass,
		toElement: toElement,
		getHeadRows: getHeadRows,
		getBodyRows: getBodyRows,
		getHeadCells: getHeadCells,
		getBodyCells: getBodyCells,
		nbColumns: nbColumns,
		alternateRowsColor: alternateRowsColor,
		alternateRowsClass: alternateRowsClass,
		hasAlternateColor: hasAlternateColor,
		hasAlternateClass: hasAlternateClass,
		addSimpleRow: addSimpleRow,
		addColspanRow: addColspanRow,
		deleteBodyRow: deleteBodyRow,
		deleteFirstBodyRow: deleteFirstBodyRow,
		deleteLastBodyRow: deleteLastBodyRow,
		fixedtableheader: fixedtableheader
	};
	
})();

TPE.Image = {
	
	visuCreated: false,
	
	makeVisualisation: function(selector){
		var closeVisu = function(){
			this.next().fade({
				afterFinish: function(){
					if($('wrapper-visu') != null)
						$('wrapper-visu').remove();
					if($('imgVisu') != null)
						$('imgVisu').remove();
					this.fade({
						duration: 0.5
					});
				}.bind(this),
				duration: 0.5
			});
		};
		
		if(arguments.length)
			var imgs = $$(selector);
		else
			var imgs = $$('img');
			
		var creerVisu = function(){
			var body = $$('body')[0];
			var fond = new Element('div', {
				id: 'fondVisualisation',
				className: 'el-visu'
			}).setStyle({
				position: 'fixed',
				top: '0px',
				left: '0px',
				width: '100%',
				height: '100%',
				margin: 'auto',
				backgroundColor: 'black',
				zIndex: 1000
			}).setOpacity(0.8).click(function(){
				closeVisu.bind(this)();
			});
			
			var visualisationImg = new Element('div', {
				id: 'imageContainer',
				className: 'el-visu'
			}).setStyle({
				position: 'fixed',
				top: '50%',
				left: '50%',
				height: '200px',
				width: '400px',
				marginLeft: '-200px',
				marginTop: '-100px',
				backgroundColor: 'white',
				borderRadius: '10px',
				MozBorderRadius: '10px',
				zIndex: 1000
			}).insert(new Element(
				'img',{
					id: 'loader',
					src: 'images/loader.gif',
				className: 'el-visu'
				}).setStyle({
					top: '50%',
					left: '50%',
					height: '31px',
					width: '31px',
					marginLeft: '-15.5px',
					marginTop: '-15.5px',
					position: 'absolute'
				})
			);
			
			var close = new Element('img', {
					id: 'close',
					src: 'images/close.png',
				className: 'el-visu'
				}).setStyle({
					float: 'right',
					cursor: 'pointer'
				}).click(function(){
					closeVisu.bind(this.up().previous())();
				});
			
			visualisationImg.insert(close);
			
			body.insert(fond);
			body.insert(visualisationImg);
			
			TPE.Image.visuCreated = true;
			
		};
		
		imgs.each(function(img, index){
			img.setStyle({
				cursor: 'pointer'
			});
			img.addHoverClassName('hightlight');
			img.click(function(e){
				var target = e.element();
				if(!TPE.Image.visuCreated) creerVisu();
				
				$('loader').show();
				$('fondVisualisation').setOpacity(0.8).show();
				$('imageContainer').appear();
				
				var imgVisu = new Element('img', {
					id: 'imgVisu',
					src: this.src,
					alt: this.alt,
					className: 'visu el-visu'
				});
				
				imgVisu.onload = function(){
					var imgDim = {
						width: imgVisu.width,
						height: imgVisu.height
					}
					var docDim = document.viewport.getDimensions();
					
					
					if(imgDim.width > docDim.width-100){
						imgVisu.width = docDim.width-100;
						imgVisu.height = (imgVisu.width/imgDim.width)*imgDim.height;
					}
				
					if(imgVisu.height > docDim.height-100){
						imgVisu.height = docDim.height-100;
						imgVisu.width = (imgVisu.height/imgDim.height)*imgDim.width;
					}
					$$('.el-visu').invoke('observe','mousewheel', function(e){
						e.stop();
					});
					$('imageContainer').morph('width: '+(imgVisu.width + 50)+'px; height: '+(imgVisu.height	+ 50)+'px; margin-left: -'+((imgVisu.width	+ 50)/2)+'px; margin-top: -'+((imgVisu.height	+ 50)/2)+'px;',{
						afterFinish: function(){
							$('loader').hide();
							$('imageContainer').insert(imgVisu.setStyle({
								top: '50%',
								left: '50%',
								height: imgVisu.height + 'px',
								width: imgVisu.width +'px',
								marginLeft: (-imgVisu.width/2) + 'px',
								marginTop: (-imgVisu.height/2) + 'px',
								position: 'absolute'
							}).hide());
							//imgVisu.appear();
							if($(target.id+'-legend') != null)
								imgVisu.makeLegend(target.id+'-legend', {idWrapper: 'wrapper-visu'}).up().setStyle({
									top: '50%',
									left: '50%',
									height: imgVisu.height + 'px',
									width: imgVisu.width +'px',
									marginLeft: (-imgVisu.width/2) + 'px',
									marginTop: (-imgVisu.height/2) + 'px',
									position: 'absolute'
								}); //############################;
							imgVisu.appear();
						},
						duration: 1
					});
				};
			})
		});
	}
};

TPE.Image.Methods = {
	makeLegend: function(image, imgLegend){
		
		var options = Object.extend({
				radius: '5px',
				backgroundLegend: 'black',
				color: 'white',
				opacity: 0.8,
				widthTitle: '30%',
				heightTitle: 25,
				heightLegend: 100,
				transition: 1,
				idWrapper: 'wrapper',
				hover: false
			}, arguments[2] || {}
		);
		
		image = $(image);
		legend = Element.clone($(imgLegend).hide());
		legend.innerHTML = $(imgLegend).innerHTML;
		var imageDim = image.getDimensions();
		
		legend.setStyle({
			paddingLeft: '10px',
			backgroundColor: options.backgroundLegend,
			height: options.heightLegend + 'px',
			color: options.color
		}).setOpacity(options.opacity).show();
		
		var appearLegend = function(){
			var parent = this.getOffsetParent();
			var parentLayout = parent.getLayout();
			
			if (Prototype.Browser.WebKit){
				parent.setStyle({
					WebkitTransition: options.transition + 's'
				});
				if(parentLayout.get('bottom') < 0) {
					parent.setStyle({
						bottom: '0px'
					});
				}	else {
					parent.setStyle({
						bottom: - this.next().getHeight() + 'px'
					});
				}
			}
			else {
				if (typeof Scriptaculous  === 'object' && typeof Effect === 'object'){
					if(parentLayout.get('bottom') < 0) {
						parent.morph('bottom: 0', {duration: options.transition});
					}	else {
						var bottom = - this.next().getHeight();
						parent.morph('bottom: '+ bottom + 'px', {duration: options.transition});
					}
				}else {
					if(parentLayout.get('bottom') < 0) {
						parent.setStyle({
							bottom: '0px'
						});
					}	else {
						parent.setStyle({
							bottom: - this.next().getHeight() + 'px'
						});
					}
				}
			}
		};
		
		var onglet = new Element('div', {'id': 'onglet-' + image.id + '-legend'}).setStyle({
			backgroundColor: options.backgroundLegend,
			top: 0,
			width: options.widthTitle,
			height: options.heightTitle + 'px',
			paddingLeft: '20px',
			paddingRight: '20px',
			overflow: 'visible',
			color: options.color,
			cursor: 'pointer',
			'borderRadius': '0px ' + options.radius + ' 0px 0px'
		}).setOpacity(options.opacity).click(function(){
			appearLegend.bind(this)();
		});
		
		if(options.hover){
			onglet.mousemove(function(){
				appearLegend.bind(this)();
			});
		}
		
		var legende = new Element('div', {'id': 'legende'}).update(legend).setStyle({
			position: 'absolute',
			width: '100%',
			height: (options.heightTitle + options.heightLegend)
		});
		
		image.wrap('div', {id: options.idWrapper}).makeClipping().setStyle({
				width: imageDim.width + 'px',
				height: imageDim.height + 'px',
				position: 'relative'
			}).insert(legende);
		image.relativize();
		
		onglet.insert({
			top: '<h3 id="title-' + image.id + '-legend" style="margin: 0;">' + image.readAttribute('alt') + '</h3>'
		});
		
		legende.insert({
			top: onglet
		}).setStyle({
			bottom: -legend.getHeight()+'px'
		})
		return legende;
	}
};

TPE.Utils.Scripts = {};

TPE.Utils.Scripts.Methods = {
	isLoaded: function(url){		
		return !!$A(document.scripts).findAll(function(script){
			return script.src === url;
		}).length;
	},
	
	loadScript: function(url, callback){
		var options = Object.extend({
				idSc: '',
				type: 'text/javascript',
				language: 'Javascript',
				onload: Prototype.emptyFunction
			}, arguments[2] || {}
		);
		
		if($(options.idSc)) {
			callback.apply()
			return;
		}

		
		var script = new Element('script', {
			'type': options.type,
			'src': url,
			'language': options.language,
			'id': options.idSc
		});
		
		if(TPE.Utils.Scripts.isLoaded(script.src)){
			callback.apply()
			return;
		}
		
		script.onload = callback;
		$$('head')[0].insert(script);
		return script;
	}
		

};


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
		Object.extend(TPE.Table, TPE.Table.Methods);
		Object.extend(TPE.Form, TPE.Form.Methods);
		Object.extend(TPE.Form.Element, TPE.Form.Element.Methods);
		Object.extend(TPE.Utils.CSS, TPE.Utils.CSS.Methods);
		Object.extend(TPE.Utils.Scripts, TPE.Utils.Scripts.Methods);
		Object.extend(TPE.Image, TPE.Image.Methods);
		
		Object.extend(Element.Methods.ByTag, {
			"TABLE": Object.clone(TPE.Table.Methods)
		});
		
		Element.addMethods();
		if (typeof Effect === 'object')
			Element.addMethods(TPE.Effects.Methods);
		Element.addMethods(TPE.Element);
		Element.addMethods(TPE.Events);
		Element.addMethods('form', TPE.Form.Methods);
		
		Element.addMethods('input', TPE.Form.Element.Methods);
		Element.addMethods('input', TPE.Events);
		Element.addMethods('img', TPE.Image.Methods);
		
	
		if(typeof CSS === "undefined")
			CSS = TPE.Utils.CSS;
			
		if(typeof Sc === "undefined")
			Sc = TPE.Utils.Scripts;

		$Sc = TPE.Utils.Scripts.loadScript;
		$Css = TPE.Utils.CSS.loadCSS;
	}
})();
