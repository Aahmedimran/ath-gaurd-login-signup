export const reducer = (state, action) => {
  
    switch (action.type) {
      case "add": {
        return { ...state, myNum: state.myNum+1}
      }
      case "subtract": {
        return { ...state, myNum: state.myNum-1}
      }

      case "USER_LOGIN": {
        return { ...state, user: action.payload, isLogin:true }
      }
      case "USER_LOGOUT": {
        return { ...state, user: null, isLogin:false } 
      }
      case "CHANGE_THEME": {
        return { ...state, darkTheme: !state.darkTheme }
      }
      default: {
       return state
      }
    }
  }