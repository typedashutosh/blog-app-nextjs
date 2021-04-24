export interface IAuthContext {
  authState: boolean
  setAuthState: Dispatch<SetStateAction<boolean>>
}

export interface ILoadingContext {
  loadingState: boolean
  setLoadingState: Dispatch<SetStateAction<boolean>>
}
