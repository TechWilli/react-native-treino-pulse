import DatabaseCRUDModel from './DatabaseCRUDModel'

const DatabaseInstance = new DatabaseCRUDModel()

export const selectAction = (callback) => {
	let selectData = []
	DatabaseInstance.databaseSelect()
		.then((values) => {
			selectData = values
			console.log("selectAction selectData:", selectData)
			let dataBusiness = selectData // dataBusiness representa os dados depois de alterados por alguma regra de negócio
			callback(dataBusiness)
		})
		.catch((err) => {
			console.log("selectAction error:", err)
		})
}

export const insertAction = () => {
	let insertData = []
	DatabaseInstance.databaseInsert()
		.then((values) => {
			insertData = values
			console.log("insertAction insertData:", insertData)
		})
		.catch((err) => {
			console.log("insertAction error:", err)
		})
}

export const updateAction = () => {
	let updateData = []
	DatabaseInstance.databaseUpdate()
		.then((values) => {
			updateData = values
			console.log("updateAction updateData:", updateData)
		})
		.catch((err) => {
			console.log("updateAction error:", err)
		})
}

export const deleteAction = () => {
	let deleteData = []
	DatabaseInstance.databaseDelete()
		.then((values) => {
			deleteData = values
			console.log("deleteAction deleteData:", deleteData)
		})
		.catch((err) => {
			console.log("deleteAction error:", err)
		})
}

export const undoDeleteAction = (callback) => {
	let undoDeleteData = []
	DatabaseInstance.databaseUndoDelete()
		.then((values) => {
			undoDeleteData = values
			console.log("selectAction undoDeleteData:", undoDeleteData)
			let dataBusiness = undoDeleteData
			callback(dataBusiness)
		})
		.catch((err) => {
			console.log("undoDeleteAction error:", err)
		})
}