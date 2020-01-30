export default function user(state = {}, action) {
  switch (action.type) {
    case "ADD_TO_USER":
      return { ...state, user: action.user };
    default:
      return state;
  }
}
