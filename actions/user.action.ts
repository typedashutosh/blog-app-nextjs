//* loginAction
export type userLoginProps = {
  authorised: boolean
  username?: string
}

export type userLoginAction = {
  type: 'LOG_IN' | 'UN_AUTH'
  payload: {
    auth: boolean
    username?: string
  }
}

export const userLoginAction = ({
  authorised,
  username
}: userLoginProps): userLoginAction => {
  switch (authorised) {
    case true:
      return {
        type: 'LOG_IN',
        payload: {
          auth: true,
          username
        }
      }

    case false:
      return {
        type: 'UN_AUTH',
        payload: {
          auth: false,
          username: undefined
        }
      }
  }
}
