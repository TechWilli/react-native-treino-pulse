import React, { Component, Suspense } from 'react'
import { Text } from 'react-native'
import { setCustomText, setCustomTextInput } from 'react-native-global-props'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from 'redux-config/store'
import StackNavigator from 'navigation/StackNavigator'

console.disableYellowBox = true; // Retira os popups de warning do app

const customTextProps = {
	style: {
		fontSize: 14,
		fontFamily: 'Neris-Light',
		color: 'black'
	}
};

const customTextInputProps = {
	style: {
		fontSize: 12,
		fontFamily: 'Neris-Light',
		color: 'red'
	}
};

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Suspense fallback={<Text>Loading...</Text>}>
						<StackNavigator />
					</Suspense>
				</PersistGate>
			</Provider>
		)
	}
}

export default App;