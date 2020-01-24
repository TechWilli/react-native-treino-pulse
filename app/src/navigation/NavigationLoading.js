import React from 'react';
import {
	ActivityIndicator,
	StatusBar,
	View,
} from 'react-native';
import { connect } from 'react-redux'

class NavigationLoading extends React.Component {
	componentDidMount() {
		this._bootstrapAsync();
	}

	// Fetch the token from storage then navigate to our appropriate place
	_bootstrapAsync = async () => {

		// This will switch to the App screen or Auth screen and this loading
		// screen will be unmounted and thrown away.
		this.props.navigation.navigate(this.props.userLogged ? 'MainTabs' : 'Welcome');
	};

	// Render any loading content that you like here
	render() {
		return (
			<View>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userLogged: state.Reducer.logged,
	};
};

export default connect(mapStateToProps)(NavigationLoading)