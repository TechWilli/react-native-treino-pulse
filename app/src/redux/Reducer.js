import { REHYDRATE } from 'redux-persist'

const initialState = { logged: false };

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case REHYDRATE:
            return {
                ...state,
                logged: (action.payload) ? action.payload.Reducer.logged : false
            };
        
        case 'SET_LOGIN_FLAG':
            console.log("SET_LOGIN_FLAG fired")
            console.log("action.flag", action.flag)
            return {
                ...state,
                logged: action.flag
            }
        
        default:
            return state
    }
}

export default reducer