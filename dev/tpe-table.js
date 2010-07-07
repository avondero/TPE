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

//###########################################################################################//

(function(){	
	
	if (TPE.Utils.paramScript === "true") {
		Object.extend(TPE.Table, TPE.Table.Methods);
		Object.extend(Element.Methods.ByTag, {
			"TABLE": Object.clone(TPE.Table.Methods)
		});
		
		Element.addMethods();
	}
})();

