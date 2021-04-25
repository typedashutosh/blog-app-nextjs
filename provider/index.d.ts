import { Dispatch, SetStateAction } from 'React'
export interface IAuthContext {
  authState: 0 | 1 | 2
  setAuthState: Dispatch<SetStateAction<0 | 1 | 2>>
}

export interface ILoadingContext {
  loadingState: boolean
  setLoadingState: Dispatch<SetStateAction<boolean>>
}
