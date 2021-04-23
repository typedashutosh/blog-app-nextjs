import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useState
} from 'react'

interface Iindex {
  children: ReactElement
}

export interface IAuthContext {
  authState: boolean
  setAuthState: Dispatch<SetStateAction<boolean>>
}

export const authContext = createContext<IAuthContext | null>(null)

export const context: FC<Iindex> = ({ children }): ReactElement => {
  const [authState, setAuthState] = useState<boolean>(false)

  return (
    <authContext.Provider value={{ authState, setAuthState }}>
      {children}
    </authContext.Provider>
  )
}

export default context
