import { FC, ReactElement } from 'react'
import setLoading from '../hooks/setLoading'

interface Isettings {}

const settings: FC<Isettings> = (): ReactElement => {
  setLoading(false)

  return <div>new settings what?</div>
}

export default settings
