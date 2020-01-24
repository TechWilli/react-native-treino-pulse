const setLoginFlagAction = (flag) => {
	return { type: 'SET_LOGIN_FLAG', flag };
}

export const setLoginFlag = (flag) => {
	return (dispatch) => {
		dispatch(setLoginFlagAction(flag));
	}
}