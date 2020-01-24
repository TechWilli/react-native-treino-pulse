import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { HomeTab, TreinoTab, Treino2Tab, DatabaseCRUDTab } from './BottomTabNavigation'
import NavigationLoading from './NavigationLoading'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Icon } from 'native-base'
import Welcome from 'pages/welcome/Welcome'

const MainTabs = createBottomTabNavigator(
	{
		Home: HomeTab,
		Training01: TreinoTab,
		Training02: Treino2Tab,
		DatabaseCRUD: DatabaseCRUDTab,
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => {
				const { routeName } = navigation.state;
				let iconName = '';
				switch (routeName) {
					case 'Home':
						iconName = `home`;
						break;
					case 'Training01':
						iconName = `people`;
						break;
					case 'Training02':
						iconName = 'people';
						break;
					case 'DatabaseCRUD':
						iconName = `logo-buffer`;
						break;
				}

				return <Icon name={iconName} style={{ fontSize: 26, color: focused ? '#E6A000' : '#7D7D7D' }} />
			},
			initialRouteName: `Home`,
			tabBarOptions: {
				activeTintColor: `#E6A000`,
				inactiveTintColor: `#7D7D7D`,
				style: {
					height: 45
				}
			}
		}),
	}
);

const MainApp = createSwitchNavigator(
	{
		NavigationLoading: NavigationLoading,
		Welcome: Welcome,
		MainTabs: MainTabs,
	},
	{
		initialRouteName: 'NavigationLoading',
		headerMode: `none`,
		navigationOptions: {
			headerVisible: false,
		}
	}
)

export default createAppContainer(MainApp)