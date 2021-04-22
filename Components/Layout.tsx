import { makeStyles } from '@material-ui/core'
import { Session } from 'next-auth'
import { getSession, useSession } from 'next-auth/client'
import { FC, ReactElement, useEffect, useState } from 'react'
import theme from '../utils/theme'
import Footer from './Footer'

import Header from './Header'

interface ILayout {
  children: ReactElement
  auth: boolean
}
const useStyles = makeStyles({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '100%'
  },
  header: {},
  children: {
    flex: 1
  },
  footer: {}
})
const Layout: FC<ILayout> = ({ children, auth }): ReactElement => {
  const classes = useStyles()
  let [session, loading]: [Session | null | undefined, boolean] = useSession()
  const [HeaderElement, setHeaderElement] = useState<ReactElement>(
    <Header session={session} />
  )
  useEffect(() => {
    getSession({}).then((session) => {
      setHeaderElement(<Header session={session} />)
    })
  }, [auth])
  return (
    <div className={classes.layout}>
      <div className={classes.header}>{HeaderElement}</div>
      <div className={classes.children}>{children}</div>
      <div className={classes.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
