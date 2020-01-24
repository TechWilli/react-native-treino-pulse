import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('screen')
const height = Dimensions.get('screen').height - 117

export default StyleSheet.create({
	container: {
		height,  // Testar em outros celulares 
		flexDirection: 'column', 
		flexWrap: 'wrap', 
		// backgroundColor: 'blue',
	},
	listView: {
		height: height/8 * 6,
		width,
		flexDirection: 'column', 
		flexWrap: 'wrap', 
		// backgroundColor: 'orange',
	},
	rowButtonView: {
		width,
		height: height/15,
		flexDirection: 'row', 
		flexWrap: 'wrap', 
		// backgroundColor: '#F7F6F0',
	},
	buttonView: {
		width: width/2,
		flexDirection: 'row', 
		flexWrap: 'wrap', 
		// backgroundColor: 'green',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '2%',
	},
	buttonViewFull: {
		width: width,
		flexDirection: 'row', 
		flexWrap: 'wrap', 
		// backgroundColor: 'blue',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '2%',
	},
	buttonFullStyle: {
		height: '10%',
		backgroundColor: '#E6A000',
		width: '90%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
	},
	buttonStyle: {
		height: '10%',
		backgroundColor: '#E6A000',
		width: '80%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
	},
	buttonTextStyle: {
		flex: 1,
		color: '#FFFFFF', 
		fontSize: 14,
		justifyContent: 'center',
		textAlign: 'center',
	},
	columnHeaderStyle: {
		width: width/6 * 2,
		backgroundColor: '#c9c9c3',
		marginBottom: 'solid 2px',
		borderColor: 'black'
	},
	textHeaderStyle: {
		fontFamily: 'Neris-SemiBold',
		fontSize: 16,
	},
	columnStyle: {
		width: width/3,
	},
	textColumnStyle: {
		fontSize: 12,
	},
})