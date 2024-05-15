
const initialState = {
  user: null,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        error: null
      };
    default:
      return state;
  }
};

export default userReducer;