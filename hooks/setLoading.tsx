import { FC, useEffect, useContext } from 'react'
import { ILoadingContext } from '../provider'
import { loadingContext } from '../provider/context'

interface IsetLoading {}

const setLoading: FC<boolean> = (type): null => {
  const { setLoadingState } = useContext(loadingContext) as ILoadingContext

  useEffect(() => setLoadingState(type), [])

  return null
}

export default setLoading
