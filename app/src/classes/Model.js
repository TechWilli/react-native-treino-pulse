// query - formato para aceitar parâmetros, ex: INSERT INTO tabela(name, status) VALUES(?,?)
// select - Retorna um array de objetos da query requisitada
// insert - Retorna um array de objetos da query requisitada

import Database from './Database'

class Model {
	constructor() {
		this.database = new Database();
	}

	select(object, callback = null) {
		return new Promise((resolve, reject) => {
			this.database.select(object, callback)
			   .then((values) => {
				   resolve(values)
			   })
			   .catch((err) => {
				   reject(err)
			   })
		})
	}

	insert(object, callback = null) {
		return new Promise((resolve, reject) => {
			this.database.insert(object, callback)
			   .then((values) => {
				   resolve(values)
			   })
			   .catch((err) => {
				   reject(err)
			   })
		})
	}

	update(object, callback = null) {
		return new Promise((resolve, reject) => {
			this.database.update(object, callback)
			   .then((values) => {
				   resolve(values)
			   })
			   .catch((err) => {
				   reject(err)
			   })
		})
	}

	delete(object, callback = null) {
		object.userId = 'user_test'
		return new Promise((resolve, reject) => {
			this.database.delete(object, callback)
			   .then((values) => {
				   resolve(values)
			   })
			   .catch((err) => {
				   reject(err)
			   })
		})
	}

	undoDelete(object, callback = null) {
		return new Promise((resolve, reject) => {
			this.database.select(object, callback)
			   .then((values) => {
				   resolve(values)
			   })
			   .catch((err) => {
				   reject(err)
			   })
		})
	}
}

export default Model;