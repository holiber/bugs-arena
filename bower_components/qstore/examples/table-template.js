!function (context) {
	context.tableTemplate = function (rows) {
		return '<table class="table">' +
			function () {
				var result = '';
				var firstRow = rows[0];
				result += '<tr>';
				for (var fieldName in firstRow)
					result += '<th>' + fieldName + '</th>';
				result += '</tr>';
				for (var i = 0; i < rows.length; i++) {
					result += '<tr>';
					for (var fieldName in firstRow) {
						result += '<td>' + rows[i][fieldName] + '</td>';
					}
					result += '</tr>';
				}
				return result;
			}();
		'</table>'
	}
} (window)