import { FC, useEffect } from 'react'
import setLoading from '../hooks/setLoading'

interface Ierror {}

const error: FC<Ierror> = (): JSX.Element => {
  useEffect(() => {
    setLoading(false)
  }, [])

  return <div>THIS IS ERROR PAGE</div>
}

export default error
