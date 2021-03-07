import { userLoginAction, userLoginProps } from '../actions/user.action'

const initialUserLoginState: userLoginProps = {
  authorised: false,
  username: undefined
}

export const userInfoReducer = (
  state: userLoginProps = initialUserLoginState,
  action: userLoginAction
) => {
  switch (action.type) {
    case 'LOG_IN':
      return (state = {
        authorised: action.payload.auth,
        username: action.payload.username
      })
    case 'UN_AUTH':
      return (state = {
        authorised: action.payload.auth,
        username: action.payload.username
      })

    default:
      return state
  }
}
