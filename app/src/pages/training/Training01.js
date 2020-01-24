import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Dimensions } from 'react-native'
import TrainingButton from 'components/TrainingButton'

// SHIFT + ALT + F identa todo o código

const { height } = Dimensions.get('screen');

class Training01 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			texto: 'VAI',
			cor: 'orange'
		};
	}

	changeText = () => {
		this.setState({
			texto: (this.state.texto === 'VAI') ? 'VOLTA': 'VAI',
			cor: (this.state.cor === 'orange') ? 'brown' : 'orange'
		});
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text style={{fontSize: 30}}>{this.state.texto}</Text>

				<TrainingButton
					eventHandler={this.changeText}
					corBotao={this.state.cor}
					textoBotao={'CLIQUE AQUI'} />

			</View>
		);
	}
}

// Para alterar o título da navBar por props (faça o reload ou invés de utilizar o fast fresh)
Training01.navigationOptions = {
	title: 'Treino React Native - 01',
};

export default Training01;