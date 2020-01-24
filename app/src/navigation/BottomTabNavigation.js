import { createStackNavigator } from 'react-navigation-stack'

import HomePage from 'pages/home/Home';
import Training01Page from 'pages/training/Training01'
import Training02Page from  'pages/training/Training02'
import DatabaseCRUDPage from 'pages/database-example/DatabaseCRUD'

export const HomeTab = createStackNavigator(
	{
		Home: HomePage,
	},
	{
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#F7F6F0',
			},
			headerTintColor: '#333333',
			title: 'Home Title',
		},
	}
);

export const TreinoTab = createStackNavigator(
	{
		Training01: Training01Page,
	},
	{
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#F7F6F0',
			},
			headerTintColor: '#333333',
			title: 'Training 01 Title',
		},
	}
);

export const Treino2Tab = createStackNavigator(
	{
		Training02: Training02Page,
	},
	{
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#F7F6F0',
			},
			headerTintColor: '#333333',
			title: 'Training 02 Title'
		},
	}
);

export const DatabaseCRUDTab = createStackNavigator(
	{
		DatabaseCRUD: DatabaseCRUDPage,
	},
	{
		headerMode: `none`,
		navigationOptions: {
			headerVisible: false,
		},
	}
);