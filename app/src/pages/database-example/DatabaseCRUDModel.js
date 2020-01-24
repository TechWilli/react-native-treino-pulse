import Model from 'classes/Model'

export default class DatabaseCRUDModel extends Model {
	constructor() {
		super()
	}

	databaseSelect(callback) {
		return new Promise((resolve, reject) => {
			this.select({ // método extendido da classe Model
				table: ['teste_table'], // nome da tabela
				columns: [
					{columnName: 'id', alias: 'id'}, 
					{columnName: 'first_name', alias: 'nome'},
					{columnName: 'last_name', alias: 'sobrenome'},
					{columnName: 'email', alias: 'email'},
					{columnName: 'gender', alias: 'gender'},
					{columnName: 'city', alias: 'cidade'},
					{columnName: 'age', alias: 'idade'},
				],
				// limit: 50,
				orderBy: 'nome',
				// ignoreDeletedById: true
			}, callback)
				.then((values) => {
					resolve(values)
				})
				.catch((err) => {
					reject(err)
				})
		})
	}

	databaseInsert(callback) {
		return new Promise((resolve, reject) => {
			this.insert({ // método extendido da classe Model
				table: 'teste_table', 
				columns: {
					first_name: 'Abel', 
					last_name: 'Santos',
					email: 'abel.santos@gmal.com',
					gender: 'Male',
					city: 'São Paulo',
					age: 33,
				}
			}, callback)
				.then((values) => {
					resolve(values)
				})
				.catch((err) => {
					reject(err)
				})
		})
	}

	databaseUpdate(callback) {
		return new Promise((resolve, reject) => {
			this.update({ // método extendido da classe Model
				table: 'teste_table', 
				columns: {first_name: 'Aline (alterado)', last_name: 'Castro'},
				// columns: {first_name: 'Alaine', last_name: 'Pods'},
				conditions: {id: '82'}
			}, callback)
				.then((values) => {
					resolve(values)
				})
				.catch((err) => {
					reject(err)
				})
		})
	}

	databaseDelete(callback) {
		return new Promise((resolve, reject) => {
			this.delete({ // nossos deletes são apenas "lógicos", ou seja, é executado um UPDATE na coluna deleted_by_id e esse registro não é retornado no SELECT
				table: 'teste_table', 
				conditions: {id: '119'},
			}, callback)
				.then((values) => {
					resolve(values)
				})
				.catch((err) => {
					reject(err)
				})
		})
	}

// nossos deletes são apenas "lógicos", ou seja, é executado um UPDATE na coluna deleted_by_id e esse registro não é retornado no SELECT
	databaseUndoDelete(callback) {
		return new Promise((resolve, reject) => {
			this.undoDelete({ // método extendido da classe Model
				table: ['teste_table'], // nome da tabela
				columns: [
					{columnName: 'id', alias: 'id'}, 
					{columnName: 'first_name', alias: 'nome'},
					{columnName: 'last_name', alias: 'sobrenome'},
					{columnName: 'email', alias: 'email'},
					{columnName: 'gender', alias: 'gender'},
					{columnName: 'city', alias: 'cidade'},
					{columnName: 'age', alias: 'idade'},
				],
				// limit: 50,
				orderBy: 'nome',
				ignoreDeletedById: true
			}, callback)
				.then((values) => {
					resolve(values)
				})
				.catch((err) => {
					reject(err)
				})
		})
	}
}