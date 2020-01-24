/**
 * Represents a library of util methods to use on model classes.
 * @class DatabaseHelper
 */

export default class DatabaseHelper {
	/** Function to format where clause based on filters received from client.
	 * @param {Object} filters - Object with information about the filters created.
	 * @param {Object} columnObject - Object with the alias on query of each column.
	 */
	static searchWhereClause(filters, columnObject) {
		let expressionString = '( ',
			arrayData = []
		for (let i = 0; i < filters.rules.length; i++) {
			let translatedFilter = DatabaseHelper.translateOpFilter(filters.rules[i].op, columnObject[filters.rules[i].field], filters.rules[i].data)
			expressionString += translatedFilter.string
			arrayData = arrayData.concat(translatedFilter.rawArray)

			if (i != filters.rules.length - 1)
				expressionString += filters.groupOp + ' '
		}

		if (filters.groups) {
			if (filters.groups.length > 0) {
				for (let j = 0; j < filters.groups.length; j++) {
					let searchWhereObject = DatabaseHelper.searchWhereClause(filters.groups[j], columnObject)
					expressionString += (filters.rules.length == 0) ? searchWhereObject.expressionString : (filters.groupOp + ' ' + searchWhereObject.expressionString)
					arrayData = arrayData.concat(searchWhereObject.arrayData)
				}
			}
		}

		return {
			expressionString: (expressionString + ' )'),
			arrayData: arrayData
		}
	}

	/** Function to create the where clause based on the received object from client in filters object.
	 * @param {String} op - String with the operation (eg.: eq, ne, bw, nu...).
	 * @param {String} field - Column name in the table.
	 * @param {String} value - Value to be searched for.
	 * @param {String} fieldType - Column type accordingly to tools definition (eg.: LONGTEXT, NUMBER, FLAG...).
	 */
	static translateOpFilter(op, field, value, fieldType) {
		let textTypes = ['TEXT']
		let isText = textTypes.includes(fieldType)

		switch (op) {
		case 'eq': //Equal
			if (value == '') {
				return {
					string: '((?? = ?) OR ?? IS NULL) ',
					rawArray: [field, value, field]
				}
			} else {
				return {
					string: '(?? = ?) ',
					rawArray: [field, value]
				}
			}
		case 'ne': //Not Equal
			if (isText) {
				if (value == '')
					return {
						string: '(?? <> ?) ',
						rawArray: [field, value]
					}
				else
					return {
						string: '((?? <> ?) OR ?? IS NULL) ',
						rawArray: [field, value, field]
					}
			} else {
				if (value == '')
					return {
						string: '(?? != ? AND ?? NOT LIKE ?) ',
						rawArray: [field, value, field, value]
					}
				else
					return {
						string: '((?? != ? AND ?? NOT LIKE ?) OR ?? IS NULL) ',
						rawArray: [field, value, field, value, field]
					}
			}
		case 'bw': //Begins with
			if (isText) {
				if (value == '')
					return {
						string: '((<make_insensitive>??|ARGSEP|?</make_insensitive>) OR ?? IS NULL) ',
						rawArray: [field, value + '%', field]
					}
				else
					return {
						string: '(<make_insensitive>??|ARGSEP|?</make_insensitive>) ',
						rawArray: [field, value + '%']
					}
			} else {
				if (value == '')
					return {
						string: '((?? LIKE ?) OR ?? IS NULL)',
						rawArray: [field, value + '%', field]
					}
				else
					return {
						string: '(?? LIKE ?)',
						rawArray: [field, value + '%']
					}
			}
		case 'bn': //Not Begins with
			if (isText) {
				if (value == '')
					return {
						string: '(<make_insensitive>$campo|ARGSEP|!=?</make_insensitive>)',
						rawArray: [field, value + '%']
					}
				else
					return {
						string: '((<make_insensitive>$campo|ARGSEP|!=?</make_insensitive>) OR ?? IS NULL)  ',
						rawArray: [field, value + '%', field]
					}
			} else {
				if (value == '')
					return {
						string: '(?? NOT LIKE ?) ',
						rawArray: [field, value + '%']
					}
				else
					return {
						string: '((?? NOT LIKE ?) OR ?? IS NULL) ',
						rawArray: [field, value + '%', field]
					}
			}
		case 'ew': //Ends with
			if (isText) {
				if (value == '')
					return {
						string: '((<make_insensitive>??|ARGSEP|?</make_insensitive>) OR ?? IS NULL) ',
						rawArray: [field, '%' + value, field]
					}
				else
					return {
						string: '(<make_insensitive>??|ARGSEP|?</make_insensitive>) ',
						rawArray: [field, '%' + value]
					}
			} else {
				if (value == '')
					return {
						string: '((?? LIKE ?) OR ?? IS NULL)',
						rawArray: [field, '%' + value, field]
					}
				else
					return {
						string: '(?? LIKE ?)',
						rawArray: [field, '%' + value]
					}
			}
		case 'en': //Ends Begins with
			if (isText) {
				if (value == '')
					return {
						string: '(<make_insensitive>$campo|ARGSEP|!=?</make_insensitive>)',
						rawArray: [field, '%' + value]
					}
				else
					return {
						string: '((<make_insensitive>$campo|ARGSEP|!=?</make_insensitive>) OR ?? IS NULL)  ',
						rawArray: [field, '%' + value, field]
					}
			} else {
				if (value == '')
					return {
						string: '(?? NOT LIKE ?) ',
						rawArray: [field, '%' + value]
					}
				else
					return {
						string: '((?? NOT LIKE ?) OR ?? IS NULL) ',
						rawArray: [field, '%' + value, field]
					}
			}
		case 'nu': //Is Null
			var dateNumberStrinIsNull = '',
				rawArrayIsNull = []

			switch (fieldType) {
			case 'DATETIME':
				dateNumberStrinIsNull = '?? = ? OR ?? = ? OR '
				rawArrayIsNull = [field, '1900-01-01 00:00:00', field, '0000-00-00 00:00:00']
				break

			case 'DATE':
				dateNumberStrinIsNull = '?? = ? OR ?? = ? OR '
				rawArrayIsNull = [field, '1900-01-01', field, '0000-00-00']
				break

			case 'NUMERIC':
			case 'NUMBER':
			case 'INTEGER':
			case 'CURRENCY':
			case 'PERCENTAGE':
				dateNumberStrinIsNull = '?? <> ? AND'
				rawArrayIsNull = [field, '0']
				break

			default:
				break
			}
			rawArrayIsNull.push(field, '', field)
			return {
				string: '(' + dateNumberStrinIsNull + '?? = ? OR ?? IS NULL) ', rawArray: rawArrayIsNull
			}
		case 'nn': //Not Null
			var dateNumberStringNotNull = '',
				rawArrayNotNull = []

			switch (fieldType) {
			case 'DATETIME':
				dateNumberStringNotNull = '?? <> ? AND ?? <> ? AND '
				rawArrayNotNull = [field, '1900-01-01 00:00:00', field, '0000-00-00 00:00:00']
				break

			case 'DATE':
				dateNumberStringNotNull = '?? <> ? AND ?? <> ? AND '
				rawArrayNotNull = [field, '1900-01-01', field, '0000-00-00']
				break

			case 'NUMERIC':
			case 'NUMBER':
			case 'INTEGER':
			case 'CURRENCY':
			case 'PERCENTAGE':
				dateNumberStringNotNull = '?? = ? AND'
				rawArrayNotNull = [field, '0']
				break

			default:
				break
			}
			rawArrayNotNull.push(field, '', field)
			return {
				string: '(' + dateNumberStringNotNull + '?? <> ? AND ?? IS NOT NULL) ', rawArray: rawArrayNotNull
			}
		case 'in': //Is in
			var stringArrayIsIn = [],
				rawArrayIsIn = [],
				valuesIsIn = value.split(',')
			// nullS = '';

			for (var indexIsIn = 0; indexIsIn < valuesIsIn.length; indexIsIn++) {
				valuesIsIn[indexIsIn] = valuesIsIn[indexIsIn].trim()
				if (valuesIsIn[indexIsIn] == '') {
					stringArrayIsIn.push('((?? = ?) OR ?? IS NULL) ')
					rawArrayIsIn.push(field, valuesIsIn[indexIsIn], field)
				} else {
					stringArrayIsIn.push('(?? = ?) ')
					rawArrayIsIn.push(field, valuesIsIn[indexIsIn])
				}
			}
			return {
				string: '(' + stringArrayIsIn.join('OR ') + ')', rawArray: rawArrayIsIn
			}
		case 'ni': //Not in
			var stringArrayNotIn = [],
				rawArrayNotIn = [],
				valuesNotIn = value.split(',')
			// nullS = '';

			for (var indexNotIn = 0; indexNotIn < valuesNotIn.length; indexNotIn++) {
				valuesNotIn[indexNotIn] = valuesNotIn[indexNotIn].trim()
				if (isText) {
					if (valuesNotIn[indexNotIn] == '') {
						stringArrayNotIn.push('(?? <> ? AND ?? IS NOT NULL) ')
						rawArrayNotIn.push(field, valuesNotIn[indexNotIn], field)
					} else {
						stringArrayNotIn.push('(?? <> ? OR ?? IS NULL) ')
						rawArrayNotIn.push(field, valuesNotIn[indexNotIn], field)
					}
				} else {
					if (valuesNotIn[indexNotIn] == '') {
						stringArrayNotIn.push('((?? != ? AND ?? NOT LIKE ?) AND ?? IS NOT NULL) ')
						rawArrayNotIn.push(field, valuesNotIn[indexNotIn], field, valuesNotIn[indexNotIn], field)
					} else {
						stringArrayNotIn.push('((?? != ? AND ?? NOT LIKE ?) OR ?? IS NULL) ')
						rawArrayNotIn.push(field, valuesNotIn[indexNotIn], field, valuesNotIn[indexNotIn], field)
					}
				}
			}
			return {
				string: '(' + stringArrayNotIn.join('AND ') + ')', rawArray: rawArrayNotIn
			}
		case 'lt': //Less
			if (value.trim() != '') {
				// var date_str = ''

				// if (fieldType == 'DATETIME') {
				// 	date_str = 'AND $campo <> '1900-01-01 00:00:00''.((DBTYPE != 'PDO_SQLSRV') ? ' AND $campo <> '0000-00-00 00:00:00'' : '');
				// } else if (fieldType == 'DATE') {
				// 	date_str = 'AND $campo <> '1900-01-01''.((DBTYPE != 'PDO_SQLSRV') ? ' AND $campo <> '0000-00-00'' : '');
				// }

				return {
					string: '(?? < ?) ',
					rawArray: [field, value]
				}
			}
			break
		case 'le': //Less or equal
			if (value.trim() != '') {
				// var date_str = ''

				// if ($fieldType == 'DATETIME') {
				// 	$date_str = 'AND $campo <> '1900-01-01 00:00:00''.((DBTYPE != 'PDO_SQLSRV') ? ' AND $campo <> '0000-00-00 00:00:00'' : '');
				// } else if ($fieldType == 'DATE') {
				// 	$date_str = 'AND $campo <> '1900-01-01''.((DBTYPE != 'PDO_SQLSRV') ? ' AND $campo <> '0000-00-00'' : '');
				// }

				return {
					string: '(?? <= ?) ',
					rawArray: [field, value]
				}
			}
			break
		case 'gt': //Greater
			if (value.trim() != '') {
				return {
					string: '(?? > ?) ',
					rawArray: [field, value]
				}
			}
			break
		case 'ge': //Greater or equal
			if (value.trim() != '') {
				return {
					string: '(?? >= ?) ',
					rawArray: [field, value]
				}
			}
			break

			// TODO: terminar todos os casos e mudar a forma de tratar as 'interrogacoes'
		case 'nc': //Not Contain
			if (isText) {
				if (value == '')
					return {
						string: '(<make_insensitive>$campo|ARGSEP|!=?</make_insensitive>)',
						rawArray: [field, '%' + value + '%']
					}
				else
					return {
						string: '((<make_insensitive>$campo|ARGSEP|!=?</make_insensitive>) OR ?? IS NULL)  ',
						rawArray: [field, '%' + value + '%', field]
					}
			} else {
				if (value == '')
					return {
						string: '(?? NOT LIKE ?) ',
						rawArray: [field, '%' + value + '%']
					}
				else
					return {
						string: '((?? NOT LIKE ?) OR ?? IS NULL) ',
						rawArray: [field, '%' + value + '%', field]
					}
			}
		case 'cn': //Contain
		default:
			if (isText) {
				if (value == '')
					return {
						string: '((<make_insensitive>??|ARGSEP|?</make_insensitive>) OR ?? IS NULL) ',
						rawArray: [field, '%' + value + '%', field]
					}
				else
					return {
						string: '(<make_insensitive>??|ARGSEP|?</make_insensitive>) ',
						rawArray: [field, '%' + value + '%']
					}
			} else {
				if (value == '')
					return {
						string: '((?? LIKE ?) OR ?? IS NULL)',
						rawArray: [field, '%' + value + '%', field]
					}
				else
					return {
						string: '(?? LIKE ?)',
						rawArray: [field, '%' + value + '%']
					}
			}

		// return 'LIKE'
		}

		return {
			string: '',
			rawArray: []
		}
	}

	/** Function to separate columns from pls table and ext table into two different objects.
	 * @param {Object} entityInfo - Entity column information got from tools.
	 * @param {Object} allColumns - Columns to be separated into standard and extension columns.
	 */
	static separateExtensionColumns(entityInfo, allColumns) {
		let extensionColumns = {}
		for (let i = 0; i < entityInfo.data.length; i++) {
			for (let j = 0; j < entityInfo.data[i].fields.length; j++) {
				if (Array.isArray(allColumns)) {
					if (!Array.isArray(extensionColumns))
						extensionColumns = []
					allColumns.forEach((element, index) => {
						if (!extensionColumns[index])
							extensionColumns[index] = {}
						if (element[entityInfo.data[i].fields[j].dataField] !== undefined) {
							if (entityInfo.data[i].fields[j].extension) {
								// extensionColumns[entityInfo.data[i].fields[j].dataField] = element[entityInfo.data[i].fields[j].dataField]
								extensionColumns[index][entityInfo.data[i].fields[j].dataField] = element[entityInfo.data[i].fields[j].dataField]
								delete element[entityInfo.data[i].fields[j].dataField]
							}
						}
					})
				} else {
					if (allColumns[entityInfo.data[i].fields[j].dataField] !== undefined) {
						if (entityInfo.data[i].fields[j].extension) {
							extensionColumns[entityInfo.data[i].fields[j].dataField] = allColumns[entityInfo.data[i].fields[j].dataField]
							delete allColumns[entityInfo.data[i].fields[j].dataField]
						}
					}
				}
			}
		}

		return {
			extensionColumns: extensionColumns,
			columns: allColumns
		}
	}

	/** Set the right table for each column based on join information received inside the object.
	 * @param {Object} selectableProps - Array of columns to be showed in the query and its properties
	 */
	static setTableAliasForColumn(selectableProps) {
		let columnObject = {}
		for (let i = 0; i < selectableProps.length; i++) {
			let actualProp = ''

			if (typeof selectableProps[i].join != 'undefined') actualProp = 'T' + (selectableProps[i].join + 2) + '.'
			else actualProp = 'T1.'

			actualProp += selectableProps[i].columnName

			columnObject[selectableProps[i].alias] = actualProp
			selectableProps[i].column = actualProp
		}

		return columnObject
	}

	static parseJsonString(stringToParse, logLevel) {
		try {
			return JSON.parse(stringToParse)
		} catch (e) {
			defaultLogger.debug(`String not parseable. String: ${stringToParse}`)
			return null
		}
	}
}
