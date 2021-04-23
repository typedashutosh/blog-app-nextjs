import { makeStyles } from '@material-ui/core'
import { Session } from 'next-auth'
import { getSession, useSession } from 'next-auth/client'
import { FC, ReactElement, useContext, useEffect, useState } from 'react'
import { authContext, IAuthContext } from '../hooks/contexts'
import theme from '../utils/theme'
import Footer from './Footer'

import Header from './Header'

interface ILayout {
  children: ReactElement
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

const Layout: FC<ILayout> = ({ children }): ReactElement => {
  const classes = useStyles()

  let [session, loading]: [Session | null | undefined, boolean] = useSession()
  const { authState } = useContext(authContext) as IAuthContext
  const [HeaderElement, setHeaderElement] = useState<ReactElement>(
    <Header session={session} />
  )

  useEffect(() => {
    getSession({}).then((session) => {
      setHeaderElement(<Header session={session} />)
    })
  }, [authState])

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
