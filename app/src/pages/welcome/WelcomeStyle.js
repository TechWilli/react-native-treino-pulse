import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    },
    mainView: {
		position: 'absolute',
		marginTop: 0,
		width: '100%',
		alignItems: 'center'
    },
    titleView: {
		width: '80%',
		marginTop: '16%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonStyle: {
		backgroundColor: '#E6A000',
		marginTop: '20%',
		width: '60%',
		height: '15%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
	},
	buttonTextStyle: {
		flex: 1,
		color: '#FFFFFF',
		fontWeight: 'bold', 
		fontSize: 20,
		textAlign: 'center',
		justifyContent: 'center',
		marginBottom: '6%'
	},
	titleStyle: {
        fontSize: 30,
        fontFamily: 'Neris-SemiBold',
        color: '#FFFFFF',
        textAlign: 'center',
    }
})