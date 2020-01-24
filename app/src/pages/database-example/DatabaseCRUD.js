import React, { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { List, ListItem, Right, Body, Left, } from 'native-base';
import { Button } from 'native-base'
import { selectAction, insertAction, updateAction, deleteAction, undoDeleteAction } from './DatabaseCRUDController'
import styles from './DatabaseCRUDStyles'

const DatabaseCRUD = () => {
	const [rowsData, setRowsData] = useState([])

	const buildList = (rows, error) => {
		if (!error) {
			setRowsData(rows)
		} else {
			console.log("erro na query: ", query)
		}
	}
	
	const selectHandler = () => {
		selectAction(buildList)
	}
	
	const insertHandler = () => {
		insertAction()
		selectAction(buildList)
	}
	
	const updateHandler = () => {
		updateAction()
		selectAction(buildList)
	}
	
	const deleteHandler = () => {
		deleteAction()
		selectAction(buildList)
	}
	
	const undoDeleteHandler = () => {
		undoDeleteAction(buildList)
	}

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: 'row', position: 'relative', paddingBottom: 15, paddingLeft: 35, paddingTop: 15, backgroundColor: '#F7F6F0'}}>
								<View style={styles.columnStyle, {flex: 1}}>
									<Text style={styles.textHeaderStyle}>NOME</Text>
								</View>
								<View style={styles.columnStyle, {flex: 1}}>
									<Text style={styles.textHeaderStyle}>IDADE</Text>
								</View>
								<View style={styles.columnStyle, {flex: 1}}>
									<Text style={styles.textHeaderStyle}>CIDADE</Text>
								</View>
							</View>
			<ScrollView style={styles.listView}>
				{(rowsData.length > 0) && 
					<View>
						<List>
							{/* <ListItem key="header"> */}
							
							{/* </ListItem> */}
							{rowsData.map((data) => {
								return (
									<ListItem key={data.id}>
										<View style={styles.columnStyle}>
											<Text>{data.nome} {data.sobrenome}</Text>
										</View>
										<View style={styles.columnStyle}>
											<Text>{data.idade} anos</Text>
										</View>
										<View style={styles.columnStyle}>
											<Text>{data.cidade}</Text>
										</View>
									</ListItem>
								)
							})}
						</List>
					</View>
				}
			</ScrollView>
			<View style={{ paddingBottom: 10, backgroundColor: '#F7F6F0' }}>
				<View style={styles.rowButtonView}>
					<View style={styles.buttonViewFull}>
						<Button style={styles.buttonFullStyle} onPress={selectHandler}>
							<Text style={styles.buttonTextStyle}>SELECT</Text>
						</Button>
					</View>
				</View>

				<View style={styles.rowButtonView}>
					<View style={styles.buttonView}>
						<Button style={styles.buttonStyle} onPress={insertHandler}>
							<Text style={styles.buttonTextStyle}>INSERT</Text>
						</Button>
					</View>

					<View style={styles.buttonView}>
						<Button style={styles.buttonStyle} onPress={updateHandler}>
							<Text style={styles.buttonTextStyle}>UPDATE</Text>
						</Button>
					</View>
				</View>

				<View style={styles.rowButtonView}>
					<View style={styles.buttonView}>
						<Button style={styles.buttonStyle} onPress={deleteHandler}>
							<Text style={styles.buttonTextStyle}>DELETE</Text>
						</Button>
					</View>

					<View style={styles.buttonView}>
						<Button style={styles.buttonStyle} onPress={undoDeleteHandler}>
							<Text style={styles.buttonTextStyle}>UNDO DELETE</Text>
						</Button>
					</View>
				</View>
			</View>
		</View>
	)
}

export default DatabaseCRUD;