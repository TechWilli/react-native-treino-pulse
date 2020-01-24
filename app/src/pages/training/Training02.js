import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, Picker, TextInput } from 'react-native'
import { CheckBox, DatePicker } from 'native-base'
import TrainingButton from 'components/TrainingButton'
// import axios from 'axios'

// DICA: Ctrl + Alt + F identa o código

const Ola = (props) => {
	return (
		<View style={styles.card}>
			<Text>{props.nome}</Text>
		</View>

	);
}

const MyCard = (props) => {
	return (
		<View style={styles.card}>
			<View style={{ paddingLeft: '80%' }}>
				<Text style={{ color: 'red', fontWeight: 'bold', paddingRight: 15, paddingLeft: 10 }} onPress={props.fechar}>X</Text>
			</View>

			<View>
				<Text style={{textAlign: 'center'}}>{props.name}</Text>
				<Text style={{textAlign: 'center'}}>{props.birth}</Text>
				<Text style={{textAlign: 'center'}}>{props.salary}</Text>
				<Text style={{textAlign: 'center'}}>{props.isActive}</Text>
			</View>

		</View>
	);
}

class Training02 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nome: '',
			salary: '',
			dataNasc: '',
			checkAtivo: false,
			checkInativo: false,
			isCardVisible: false, // inicial deve ser false
			showNome: '-',
			showSalary: '-',
			showDataNasc: '-',
			showCheckAtivo: '-',
		};
	}

	buildCard = () => {
		if (this.state.nome === '' || this.state.dataNasc === '' || this.state.salary === '') {
			alert('Todos os campos são obrigatórios. Por favor, preencha-os corretamente');
		} else {
			this.setState({
				showNome: this.state.nome,
				showSalary: this.state.salary,
				showDataNasc: this.formatedDate(),
				showCheckAtivo: this.state.checkAtivo ? 'Ativo' : 'Inativo'
			}, this.setState({
				nome: '',
				salary: '',
				dataNasc: '',
				checkAtivo: false,
				checkInativo: false,
				showCheckAtivo: ''
			}));
		}
	}

	formatedDate = () => {
		const month = {
			Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12', default: ''
		}

		return this.state.dataNasc.toString().substr(8, 2) + '/' + month[this.state.dataNasc.toString().substr(4, 3) || 'default'] + '/' + this.state.dataNasc.toString().substr(10, 5)
	}

	render() {
		return (
			<View style={styles.mainView}>

				{this.state.isCardVisible && <MyCard fechar={() => { this.setState({ isCardVisible: false }) }} name={this.state.showNome} birth={this.state.showDataNasc} salary={this.state.showSalary} isActive={this.state.showCheckAtivo} />}

				<TextInput
					style={styles.input}
					placeholder={'Nome...'}
					onChangeText={(texto) => this.setState({ nome: texto })}
					value={this.state.nome}
				/>

				<View style={{ marginTop: 15, backgroundColor: 'white', width: 200, height: 40, borderRadius: 25, paddingLeft: 10, }}>
					<DatePicker
						placeHolderText={'Data de Nacimento...'}
						placeHolderTextStyle={{ color: '#9c9ea0', fontSize: 14 }}
						defaultDate={Date.now()}
						locale={'pt-br'}
						onDateChange={(novaData) => this.setState({ dataNasc: novaData })}
					/>
				</View>

				<Picker
					selectedValue={this.state.salary}
					style={{ height: 70, width: 200, marginLeft: 10 }}
					onValueChange={(itemValue) => this.setState({ salary: itemValue })}>
					<Picker.Item label="Selecione um valor" value={''}/>
					<Picker.Item label="R$500,00" value={500} />
					<Picker.Item label="R$1.000,00" value={1000} />
					<Picker.Item label="R$1.500,00" value={1500} />
					<Picker.Item label="R$2.000,00" value={2000} />
					<Picker.Item label="R$2.500,00" value={2500} />
				</Picker>

				<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
					<View style={{ flexDirection: 'row', marginRight: 25, marginLeft: 5 }}>
						<CheckBox
							color={'#000000'}
							style={{ borderRadius: 5, width: 25, height: 25, paddingLeft: 4, paddingTop: 2 }}
							checked={this.state.checkAtivo}
							onPress={() => { this.setState({ checkAtivo: this.state.checkAtivo === false ? true : false }, this.setState({ checkInativo: false })) }}
						/>
						<Text style={{ marginLeft: 15, paddingTop: 3 }}>Ativo</Text>
					</View>

					<View style={{ flexDirection: 'row', marginRight: 20 }}>
						<CheckBox
							color={'#000000'}
							style={{ borderRadius: 5, width: 25, height: 25, paddingLeft: 4, paddingTop: 2 }}
							checked={this.state.checkInativo}
							onPress={() => { this.setState({ checkInativo: this.state.checkInativo === false ? true : false }, this.setState({ checkAtivo: false })) }}
						/>
						<Text style={{ marginLeft: 15, paddingTop: 3 }}>Inativo</Text>
					</View>
				</View>

				<TrainingButton
					textoBotao={'Construir Card'}
					corBotao={'#E6A000'}
					eventHandler={this.buildCard}
				/>

				<TrainingButton
					textoBotao={'Vizualizar detalhes'}
					corBotao={'#1565c0'}
					eventHandler={() => { this.setState({ isCardVisible: true }) }}
				/>
			</View >
		);
	}
}

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		alignItems: 'center',
		padding: 15,
		backgroundColor: 'lightgrey',
	},
	input: {
		marginTop: 15,
		backgroundColor: 'white',
		width: 200,
		height: 40,
		borderRadius: 25,
		paddingLeft: 20,
		// borderWidth: .5,
		// borderColor: 'black',
	},
	card: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: 200,
		borderRadius: 15,
		backgroundColor: '#ffffff',
	},
	form: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
	}
});

// Para alterar o título da navBar por props (faça o reload ou invés de utilizar o fast fresh)
Training02.navigationOptions = {
	title: 'Treino React Native - 02',
};

export default Training02;