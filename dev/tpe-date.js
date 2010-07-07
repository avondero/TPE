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
					break;
				case "m":
					if (regExpMonth.match(s)) {
						month = s;
					}
					break;
				case "yy":
					if (regExpYear.match(s)) {
						year = s;
					}
					break;
				case "y":
					if (regExpYearMin.match(s)) {
						year = "20" + s;
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