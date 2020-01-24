import uuid from 'uuid'
import lodash from 'lodash'
import Knex from 'react-native-knex'
import DatabaseHelper from './DatabaseHelper'

export default class Database {
    constructor(persistentConnection = false) {
        this.persistentConnection = persistentConnection
        this.databaseHelper = DatabaseHelper;
    }

    openConnection() {
        // console.log("openConnection fired")
        this.knex = Knex({
            client: 'sqlite3',
            connection: {
                name: "training.db",
                createFromLocation : 1,
            },
            useNullAsDefault: true
        }, () => console.log("conectado com sucesso"), () => console.log("erro ao conectar no banco de dados"))
    }

    /** Regular function to get records from model accordingly to filters and conditions received.
     * @param {string/array} query - Array os querys or a string with one query to be executed.
     * @param {function} callback - Callback to be executed after all querys.
     */
    async query(query, callback) {
        if (typeof query == 'string') {
            if (query.substring(0, 6).toLowerCase() === 'select') { //sofisticar essa verificação
                return new Promise((resolve, reject) => {
                    this.knex.raw(query)
                        .then((result) => {
                            console.log("query result", result)
                            if (typeof callback === 'function') {
                                callback(result, null)
                            }
                            resolve(result)
                        })
                        .catch((err) => {
                            console.log("query error:", err)
                            reject(err)
                        })
                })
            } else {
                console.log("Only select query is supported")
                if (typeof callback === 'function') {
                    callback(null, 'error')
                }
                reject("Only select query is supported")
            }
        } else if (typeof query == 'object') {
            let finalResult = []
            for (let i = 0; i < query.length; i++) {
                if (query[i].substring(0, 6).toLowerCase() == 'select') {
                    await this.knex.raw(query[i])
                        .then((result) => {
                            finalResult.push(result[0])
                        })
                        .catch((err) => {
                            console.log("err = " + err)
                            if (typeof callback === 'function') {
                                callback(null, err)
                            }
                            reject(err)
                        })
                } else {
                    console.log("Only select query is supported")
                    if (typeof callback === 'function') {
                        callback(null, 'error')
                    }
                    reject("Only select query is supported")
                }
            }
            if (typeof callback === 'function') {
                callback(finalResult, null)
            }
            resolve(finalResult)
        }
    }

    /** Function to set parameters to select a record from database.
     * @param {Object} argument - Argument object.
     * @param {Array} argument.table - Query table.
     * @param {Array} argument.columns - Columns to be showed on result.
     * @param {Object} argument.join - Joins to be created on select.
     * @param {Object} argument.conditions - Object with conditions to be insered on query.
     * @param {Object} argument.filters - Object with filters to be insered on query.
     * @param {Array} argument.orderBy - Array of columns to be ordered.
     * @param {Object} argument.groupBy - Array of columns to be used on group by clause.
     * @param {function} callback - Callback to be executed.
     */
    select({
        table,
        columns,
        join,
        conditions,
        filters,
        orderBy,
        groupBy,
        limit,
        ignoreDeletedById
    }, callback) {
        this.setTable(table)
        this.setColumns(columns)
        this.setJoins(join)
        this.setConditions(conditions)
        this.setFilters(filters)
        this.setOrderBy(orderBy)
        this.setGroupBy(groupBy)
        this.setLimit(limit)

        this.ignoreDeletedById = ignoreDeletedById

        // User's responsability is used to change the records its sees
        return new Promise((resolve, reject) => {
            this.execute(callback)
                .then((values) => {
                    resolve(values)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    /** Function to insert a record from database.
     * @param {Object} argument - Argument object.
     * @param {Object} argument.columns - Columns to be insered.
     * @param {String} argument.userId - Id of the user creating the record.
     * @param {String} argument.orgId - Organization id of the user creating the record.
     * @param {String} argument.postnId - Position id of the user creating the record.
     * @param {String} argument.table - Query table.
     * @param {String} argument.extensionTable - Query extension table.
     * @param {Object} argument.extensionColumns - Extension columns to be insered.
     * @param {Flag} argument.readOnlyFlag - Flag that indicates if the record is read only
     * @param {String} argument.id - Object with filters to be insered on query.
     * @param {function} callback - Callback to be executed.
     */
    insert({
        columns,
        userId,
        orgId,
        postnId,
        table,
        extensionTable,
        extensionColumns,
        readOnlyFlag,
        id
    }, callback) {
        this.openConnection();
        let ids = []
        let defaultInsertObject = {
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
            ro_flg: (typeof readOnlyFlag != 'undefined') ? readOnlyFlag : false,
            id: (typeof id == 'string') ? id : uuid(),
            created_by_id: userId,
            updated_by_id: userId,
            org_id: orgId,
            postn_id: postnId,
            deleted_by_id: null
        }

        // adiciona as colunas a serem atualizadas na query e os valores a serem atualizados em um array
        let insertObject
        if (Array.isArray(columns)) {
            insertObject = []
            columns.forEach((element) => {
                if (!lodash.isEqual(element, {})) {
                    ids.push(uuid())
                    element.id = ids[ids.length - 1]
                    insertObject.push(lodash.merge(element, defaultInsertObject))
                } else {
                    ids.push(null)
                }
            })
        } else {
            columns.id = (typeof id == 'string') ? id : uuid()
            insertObject = lodash.merge(columns, defaultInsertObject)
        }

        let auxKnex = this.knex,
            auxPersistentConnection = this.persistentConnection
        let insertQuery = auxKnex(table).insert(insertObject)
        // this.databaseLogger.debug('insertQuery = ' + insertQuery.toString())
        console.log("insertQuery =", insertQuery.toString())
        return new Promise((resolve, reject) => {
            insertQuery.then(() => {
                if (extensionTable === undefined) {
                    if (!auxPersistentConnection) {
                        // auxKnex.destroy(console.log('knex connection destroyed'))
                    }
                    // console.log("insertObject.id", insertObject.id)
                    let responseObjectId = {newId: (insertObject.id) || ids}
                    if (typeof callback === 'function') {
                        callback(responseObjectId, null)
                    }
                    resolve(responseObjectId)
                } else {
                    let extensionInsertObject
                    if (Array.isArray(extensionColumns)) {
                        extensionInsertObject = []
                        extensionColumns.forEach((element, index) => {
                            if (!lodash.isEqual(columns[index], {})) {
                                element.id = ids[index]
                                extensionInsertObject.push(element)
                            }
                        })
                    } else {
                        extensionColumns.id = insertObject.id
                        extensionInsertObject = (extensionColumns)
                    }
                    let extInsertQuery = auxKnex(extensionTable)
                        .insert(extensionInsertObject)
                    // this.databaseLogger.debug('extInsertQuery = ' + extInsertQuery.toString())
                    extInsertQuery
                        .then(() => {
                            if (!auxPersistentConnection) {
                                // auxKnex.destroy(console.log('knex connection destroyed'))
                            }
                            if (typeof callback === 'function') {
                                callback({
                                    newId: (insertObject.id) || ids
                                }, null)
                            }
                        })
                        .catch((err) => {
                            if (!auxPersistentConnection) {
                                // auxKnex.destroy(console.log('knex connection destroyed'))
                            }
                            // this.databaseLogger.error('err = ' + err)
                            if (typeof callback === 'function') {
                                callback(null, err)
                            }
                        })
                }
            }).catch((err) => {
                console.log("insert error:", err)
                if (!auxPersistentConnection) {
                    // auxKnex.destroy(console.log('knex connection destroyed'))
                }
                // this.databaseLogger.error('err = ' + err)
                if (typeof callback === 'function') {
                    callback(null, err)
                }
                reject(err)
            })
        })
    }

    /** Function to update a record from database.
     * @param {Object} argument - Argument object.
     * @param {Object} argument.columns - Columns to be updated.
     * @param {String} argument.userId - Id of the user updating the record.
     * @param {Object} argument.conditions - Object with conditions to be insered on query.
     * @param {String} argument.table - Query table.
     * @param {String} argument.extensionTable - Query extension table.
     * @param {Object} argument.extensionColumns - Extension columns to be updated.
     * @param {function} callback - Callback to be executed.
     */
    update({
        columns,
        userId,
        conditions,
        table,
        extensionTable,
        extensionColumns
    }, callback) {
        this.openConnection();
        let updateObject = {
            // updated_at: this.knex.fn.now(),
            // updated_by_id: userId
        }

        let columnsKey = Object.keys(columns)
        for (let i = 0; i < columnsKey.length; i++) {
            updateObject[columnsKey[i]] = columns[columnsKey[i]]
        }

        let auxKnex = this.knex,
            auxPersistentConnection = this.persistentConnection
        let updateQuery = auxKnex(table).update(updateObject)
            .where(conditions)
            .whereNull('deleted_by_id')
        // this.databaseLogger.debug('updateQuery = ' + updateQuery)
        console.log('updateQuery = ', updateQuery.toString())
        return new Promise((resolve, reject) => {
            updateQuery.then((updatedRows) => {
                if (extensionTable === undefined) {
                    if (!auxPersistentConnection) {
                        // auxKnex.destroy(console.log('knex connection destroyed'))
                    }
                    // this.databaseLogger.debug('updatedRows = ' + updatedRows)
                    let responseObjectUpdatedRows = {updatedRows: updatedRows}
                    if (typeof callback === 'function') {
                        callback(responseObjectUpdatedRows, null)
                    }
                    resolve(responseObjectUpdatedRows)
                } else {
                    let extensionUpdateObject = {
                        id: conditions.id
                    }
                    let extColumns = Object.keys(extensionColumns)
                    for (let i = 0; i < extColumns.length; i++) {
                        extensionUpdateObject[extColumns[i]] = extensionColumns[extColumns[i]]
                    }
                    auxKnex(extensionTable)
                        .update(extensionUpdateObject)
                        .where({
                            id: conditions.id
                        })
                        .then(() => {
                            if (!auxPersistentConnection) {
                                // auxKnex.destroy(console.log('knex connection destroyed'))
                            }
                            // this.databaseLogger.debug('updatedRows = ' + updatedRows)
                            if (typeof callback === 'function') {
                                callback({
                                    'updatedRows': updatedRows
                                }, null)
                            }
                        })
                        .catch((err) => {
                            if (!auxPersistentConnection) {
                                // auxKnex.destroy(console.log('knex connection destroyed'))
                            }
                            // this.databaseLogger.error('err = ' + err)
                            if (typeof callback === 'function') {
                                callback(null, err)
                            }
                        })
                }
            }).catch(err => {
                console.log("update query error: ", err)
                if (!auxPersistentConnection) {
                    // auxKnex.destroy(console.log('knex connection destroyed'))
                }
                // this.databaseLogger.error('err = ' + err)
                if (typeof callback === 'function') {
                    callback(null, err)
                }
                reject(err)
            })
        })
    }

    /** Function to logically delete a record from database.
     * @param {Object} argument - Argument object.
     * @param {String} argument.table - Query table.
     * @param {String} argument.userId - Id of the user deleting the record.
     * @param {Object} argument.conditions - Object with conditions to be insered on query.
     * @param {function} callback - Callback to be executed.
     */
    delete({
        table,
        conditions,
        userId
    }, callback) {
        let deleteObject = {
            updated_at: this.knex.fn.now(),
            updated_by_id: userId,
            deleted_at: this.knex.fn.now(),
            deleted_by_id: userId
        }

        let deleteQuery = this.knex(table).update(deleteObject)
            .where(conditions)
            .whereNull('deleted_by_id')
        // this.databaseLogger.debug('deleteQuery = ' + deleteQuery)
        // console.log('deleteQuery:', deleteQuery.toString())
        return new Promise((resolve, reject) => {
            deleteQuery.then((deletedRows) => {
                if (!this.persistentConnection) {
                    // this.knex.destroy(console.log('knex connection destroyed'))
                }
                // this.databaseLogger.debug('deletedRows = ' + deletedRows)
                let responseObjectDeleteRows = {deletedRows: deletedRows}
                if (typeof callback === 'function') {
                    callback(responseObjectDeleteRows, null)
                }
                // console.log("responseObjectDeleteRows", responseObjectDeleteRows)
                resolve(responseObjectDeleteRows)
            }).catch((err) => {
                if (!this.persistentConnection) {
                    // this.knex.destroy(console.log('knex connection destroyed'))
                }
                // this.databaseLogger.error('err = ' + err)
                if (typeof callback === 'function') {
                    callback(null, err)
                }
                reject(err)
            })
        })
    }

    /** Function to logically delete multiple records from database.
     * @param {Object} argument - Argument object.
     * @param {String} argument.table - Query table.
     * @param {String} argument.userId - Id of the user deleting the record.
     * @param {Object} argument.conditions - Object with conditions to be insered on query.
     * @param {function} callback - Callback to be executed.
     */
    multiDelete({
        table,
        conditions,
        userId
    }, callback) {
        let deleteObject = {
            updated_at: this.knex.fn.now(),
            updated_by_id: userId,
            deleted_at: this.knex.fn.now(),
            deleted_by_id: userId
        }

        return new Promise((resolve, reject) => {
            this.knex(table).update(deleteObject)
                .whereIn('id', conditions)
                .whereNull('deleted_by_id')
                .then((deletedRows) => {
                    if (!this.persistentConnection) {
                        // this.knex.destroy(console.log('knex connection destroyed'))
                    }
                    // this.databaseLogger.debug('deletedRows = ' + deletedRows)
                    let responseObjectMultiDeletedRows = {deletedRows: deletedRows}
                    if (typeof callback === 'function') {
                        callback(responseObjectMultiDeletedRows, null)
                    }
                    resolve(responseObjectMultiDeletedRows)
                })
                .catch((err) => {
                    if (!this.persistentConnection) {
                        // this.knex.destroy(console.log('knex connection destroyed'))
                    }
                    // this.databaseLogger.error('err = ' + err)
                    if (typeof callback === 'function') {
                        callback(null, err)
                    }
                    reject(err)
                })
        })
    }

    /** Function to delete a record from database.
     * @param {Object} argument - Argument object.
     * @param {String} argument.table - Query table.
     * @param {Object} argument.conditions - Object with conditions to be insered on query.
     * @param {function} callback - Callback to be executed.
     */
    deletePermanently(param, callback) {
        return new Promise((resolve, reject) => {
            this.knex(param.table)
                .where(param.conditions)
                .del()
                .then((deletedRows) => {
                    if (!this.persistentConnection) {
                        // this.knex.destroy(console.log('knex connection destroyed'))
                    }
                    // this.databaseLogger.debug('deletedRows = ' + deletedRows)
                    let responseObjectDeletedPermanentlyRows = {deletedRows: deletedRows}
                    if (typeof callback === 'function') {
                        callback(responseObjectDeletedPermanentlyRows, null)
                    }
                    resolve(responseObjectDeletedPermanentlyRows)
                })
                .catch((err) => {
                    if (!this.persistentConnection) {
                        // this.knex.destroy(console.log('knex connection destroyed'))
                    }
                    // this.databaseLogger.error('err = ' + err)
                    if (typeof callback === 'function') {
                        callback(null, err)
                    }
                    reject(err)
                })
        })
    }

    /** Function to set the table object on select query.
     * @param {Array} table - Array of tables to be queued.
     */
    setTable(tables) {
        this.table = tables
    }

    /**
     * Function to get the table object.
     */
    getTable() {
        return this.table
    }

    /**
     * Function to reset the table object.
     */
    resetTable() {
        this.table = undefined
    }

    /** Function to add new table(s) to the table object.
     * @param {String} table - tables to be added.
     */
    addTable(table) {
        (this.table === undefined)
            ? this.table = table
            : this.table = this.table.concat(table)
    }

    /** Function to set the columns object on select query.
     * @param {Array} columns - Array of columns to be queued.
     */
    setColumns(columns) {
        this.columns = columns
    }

    /**
     * Function to get the columns object.
     */
    getColumns() {
        return this.columns
    }

    /**
     * Function to reset the columns object.
     */
    resetColumns() {
        this.columns = undefined
    }

    /** Function to add new column(s) to the columns object.
     * @param {String} columns - columns to be added.
     */
    addColumns(columns) {
        (this.columns === undefined)
            ? this.columns = columns
            : this.columns = this.columns.concat(columns)
    }

    /** Function to set the joins object on select query.
     * @param {Array} joins - Array of joins to be queued.
     */
    setJoins(joins) {
        this.joins = joins
    }

    /**
     * Function to get the joins object.
     */
    getJoins() {
        return this.joins
    }

    /**
     * Function to reset the joins object.
     */
    resetJoins() {
        this.joins = undefined
    }

    /** Function to add new join(s) to the joins object.
     * @param {String} joins - joins to be added.
     */
    addJoins(joins) {
        (this.joins === undefined)
            ? this.joins = joins
            : this.joins = this.joins.concat(joins)
    }

    /** Function to set the conditions object on select query.
     * @param {Array} joins - Array of conditions to be queued.
     */
    setConditions(conditions) {
        this.conditions = conditions
    }

    /**
     * Function to get the conditions object.
     */
    getConditions() {
        return this.conditions
    }

    /**
     * Function to reset the conditions object.
     */
    resetConditions() {
        this.conditions = undefined
    }

    /** Function to add new condition(s) to the conditions object.
     * @param {String} conditions - conditions to be added.
     */
    addConditions(conditions) {
        (this.conditions === undefined)
            ? this.conditions = conditions
            : this.conditions = { ...this.conditions, ...conditions }
    }

    /** Function to set the filters object on select query.
     * @param {Array} joins - Array of filters to be queued.
     */
    setFilters(filters) {
        this.filters = filters
    }

    /**
     * Function to get the filters object.
     */
    getFilters() {
        return this.filters
    }

    /**
     * Function to reset the filters object.
     */
    resetFilters() {
        this.filters = undefined
    }

    /** Function to set the orderBy object on select query.
     * @param {Array} joins - orderBy clause to be queued.
     */
    setOrderBy(orderBy) {
        this.orderBy = orderBy
    }

    /**
     * Function to get the orderBy object.
     */
    getOrderBy() {
        return this.orderBy
    }

    /**
     * Function to reset the orderBy object.
     */
    resetOrderBy() {
        this.orderBy = undefined
    }

    /** Function to add new orderBy to the orderBy object.
     * @param {String} orderBy - orderBy to be added.
     */
    addOrderBy(orderBy) {
        this.orderBy = orderBy
    }

    /** Function to set the groupBy object on select query.
     * @param {Array} joins - groupBy clause to be queued.
     */
    setGroupBy(groupBy) {
        this.groupBy = groupBy
    }

    /**
     * Function to get the groupBy object.
     */
    getGroupBy() {
        return this.groupBy
    }

    /**
     * Function to reset the groupBy object.
     */
    resetGroupBy() {
        this.groupBy = undefined
    }

    /** Function to add new groupBy to the groupBy object.
     * @param {String} groupBy - groupBy to be added.
     */
    addGroupBy(groupBy) {
        (this.groupBy === undefined)
            ? this.groupBy = groupBy
            : this.groupBy = this.groupBy.concat(groupBy)
    }

    /** Function to set the limit object on select query.
     * @param {Array} joins - limit clause to be queued.
     */
    setLimit(limit) {
        this.limit = limit
    }

    /**
     * Function to get the limit object.
     */
    getLimit() {
        return this.limit
    }

    /**
     * Function to reset the limit object.
     */
    resetLimit() {
        this.limit = undefined
    }

    /** Function to add new limit to the limit object.
     * @param {String} limit - limit to be added.
     */
    addLimit(limit) {
        (this.limit === undefined)
            ? this.limit = limit
            : this.limit = this.limit.concat(limit)
    }

    /** Function to set the offset object on select query.
     * @param {Array} joins - offset clause to be queued.
     */
    setOffset(offset) {
        this.offset = offset
    }

    /**
     * Function to get the offset object.
     */
    getOffset() {
        return this.offset
    }

    /**
     * Function to reset the offset object.
     */
    resetOffset() {
        this.offset = undefined
    }

    /** Function to add new offset to the offset object.
     * @param {String} offset - offset to be added.
     */
    addOffset(offset) {
        (this.offset === undefined)
            ? this.offset = offset
            : this.offset = this.offset.concat(offset)
    }

    /** Function to execute the select query using all objects setted.
     * @param {Function} callback - callback to be executed using the query's result.
     */
    execute(callback) {
        this.openConnection();
        let tableInfo = {}
        for (let i = 0; i < this.table.length; i++) {
            tableInfo['T' + (i + 1)] = this.table[i]
        }

        let columnObject = this.databaseHelper.setTableAliasForColumn(this.columns)

        let auxKnex = this.knex
        let selectObject = auxKnex(tableInfo).select()

        for (let j = 0; j < this.columns.length; j++) {
            let columnInfo = {}
            columnInfo[this.columns[j].alias] = this.columns[j].column
            switch (this.columns[j].type) {
                case 'max':
                    selectObject.max(columnInfo)
                    break
                case 'min':
                    selectObject.min(columnInfo)
                    break

                default:
                    selectObject.column(columnInfo)
            }
        }
        if (this.joins) {
            for (let k = 0; k < this.joins.length; k++) {
                let actualJoin = this.joins[k]
                actualJoin.alias = 'T' + (k + 2)

                const joinFunction = () => {
                    let leftColumn = ((actualJoin.leftTable !== undefined) ? 'T' + (actualJoin.leftTable + 2) : 'T1') + '.' + actualJoin.leftColumn,
                        rightColumn = actualJoin.alias + '.' + actualJoin.rightColumn
                    if (actualJoin.noDeleted) {
                        this.on(leftColumn, '=', rightColumn)
                    } else {
                        this.on(leftColumn, '=', rightColumn).onNull(actualJoin.alias + '.deleted_by_id')
                    }
                    if (actualJoin.conditions) {
                        actualJoin.conditions.forEach(element => {
                            this.on(actualJoin.alias + '.' + element.field, element.op, auxKnex.raw('?', [element.data]))
                        })
                    }
                }
                let joinObject = {}
                joinObject[actualJoin.alias] = actualJoin.table
                switch (actualJoin.type) {
                    // TODO: testar outros casos de join
                    case 'leftOuterJoin':
                        selectObject.leftOuterJoin(joinObject, joinFunction)
                        break
                    case 'innerJoin':
                    default:
                        selectObject.innerJoin(joinObject, joinFunction)
                }
            }
        }

        if (!this.ignoreDeletedById) {
            selectObject.whereNull('T1.deleted_by_id')
        }

        if (this.filters) {
            let whereFilterObj = this.databaseHelper.searchWhereClause(this.filters, columnObject)
            selectObject.andWhere(auxKnex.raw(whereFilterObj.expressionString, whereFilterObj.arrayData))
        }

        if (this.conditions) {
            selectObject.andWhere(this.conditions)
        }

        if (this.orderBy) {
            selectObject.orderBy(this.orderBy)
        }

        if (this.groupBy) {
            selectObject.groupBy(this.groupBy)
        }

        if (this.limit) {
            selectObject.limit(this.limit)
        }

        if (this.offset) {
            selectObject.offset(this.offset)
        }

        // this.databaseLogger.debug(selectObject.toString())
        console.log(selectObject.toString())
        return new Promise((resolve, reject) => {
            selectObject.then((rows, err) => {
                console.log("rows", rows)
                // this.databaseLogger.debug('selectedRows = ' + rows.length)
                if (!this.persistentConnection) {
                    // auxKnex.destroy(console.log('knex connection destroyed'))
                }
                if (typeof callback === 'function') {
                    callback(rows, null)
                }
                (!err)
                    ? resolve(rows)
                    : reject(err)
            }).catch(err => {
                console.log("Database execute error: ", err)
                if (!this.persistentConnection) {
                    // auxKnex.destroy(console.log('knex connection destroyed'))
                }
                // this.databaseLogger.error('err = ' + err)
                reject(err)
            })
        })
    }
}