import React from 'react'
import { View, Image, Text } from 'react-native'
import Background from 'assets/images/welcome.jpg'
import { Button } from 'native-base'
import Style from './WelcomeStyle'
import { connect } from 'react-redux'
import { setLoginFlag } from 'redux-config/Actions'

const Welcome = (props) => {
	const loginAction = () => {
		props.navigation.navigate('MainTabs')
		props.reduxSetLoginFlag(true)
	}
	
    return (
        <View>
            <Image
                style={Style.image}
                source={Background}
            />
			<View style={Style.mainView}>
				<View style={Style.titleView}>
					<Text
						style={Style.titleStyle}
					>
						Bem vindo ao app de treinamento da Pulse!
					</Text>
				</View>
				<Button
					onPress={loginAction}
					style={Style.buttonStyle}
				>
					<Text style={Style.buttonTextStyle}>COMEÇAR</Text>
				</Button>
			</View>
        </View>
    );
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		reduxSetLoginFlag: (flag) => dispatch(setLoginFlag(flag)),
	}
};

const mapStateToProps = (state) => {
    return {
        loggedFlag: state.Reducer.logged,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);