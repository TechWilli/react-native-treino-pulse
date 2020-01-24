import React, { Component } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

export default class TrainingButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
    
        };
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={.7} onPress={this.props.eventHandler} 
            style={{marginTop: 15,
                backgroundColor: this.props.corBotao,
                width: 200,
                height: 45,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                }}>
                <Text style={styles.textButtonStyle}>{this.props.textoBotao}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    textButtonStyle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white'
    }
});