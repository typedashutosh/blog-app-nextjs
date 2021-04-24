import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useState
} from 'react'

import { IAuthContext, ILoadingContext } from '.'

interface Iindex {
  children: ReactElement
}

export const authContext = createContext<IAuthContext | null>(null)

export const loadingContext = createContext<ILoadingContext | null>(null)

export const context: FC<Iindex> = ({ children }): ReactElement => {
  const [authState, setAuthState] = useState<boolean>(false)
  const [loadingState, setLoadingState] = useState<boolean>(false)

  return (
    <authContext.Provider value={{ authState, setAuthState }}>
      <loadingContext.Provider value={{ loadingState, setLoadingState }}>
        {children}
      </loadingContext.Provider>
    </authContext.Provider>
  )
}

export default context
