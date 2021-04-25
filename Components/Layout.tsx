import { Session } from 'next-auth'
import { getSession, useSession } from 'next-auth/client'
import { FC, ReactElement, useContext, useEffect, useState } from 'react'

import { LinearProgress, makeStyles } from '@material-ui/core'

import { IAuthContext, ILoadingContext } from '../provider'
import { authContext, loadingContext } from '../provider/context'
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
  footer: {},
  loadingBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 100
  }
})

const Layout: FC<ILayout> = ({ children }): ReactElement => {
  const classes = useStyles()

  const { authState, setAuthState } = useContext(authContext) as IAuthContext
  // console.log(authState)
  let [session, loading]: [Session | null | undefined, boolean] = useSession()

  const [HeaderElement, setHeaderElement] = useState<ReactElement>(
    <Header session={session} />
  )

  // useEffect(() => setAuthState(loading), [])
  // useEffect(() => setAuthState(!!session), [!!session])

  useEffect(() => {
    getSession({}).then((session) => {
      setHeaderElement(<Header session={session} />)
      setAuthState(session !== null ? 1 : 0)
    })
  }, [authState])

  const { loadingState } = useContext(loadingContext) as ILoadingContext
  return (
    <div className={classes.layout}>
      <LinearProgress
        className={classes.loadingBar}
        variant={loadingState ? 'indeterminate' : 'determinate'}
        value={loadingState ? 30 : 100}
        color={loadingState ? 'secondary' : 'primary'}
      />
      <div className={classes.header}>{HeaderElement}</div>
      <div className={classes.children}>{children}</div>
      <div className={classes.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
