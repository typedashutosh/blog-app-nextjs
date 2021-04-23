import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { NextPage } from 'next'
import { Provider } from 'next-auth/client'
import { AppProps } from 'next/app'
import { ReactElement, useEffect } from 'react'
import Layout from '../Components/Layout'
import GlobalState from '../hooks/contexts'
import theme from '../utils/theme'

interface I_app extends AppProps {}

const _app: NextPage<I_app> = ({
  Component,
  pageProps,
  router
}): ReactElement => {
  useEffect(() => {
    const jssStyles = document?.querySelector('#jss-server-side')
    jssStyles?.parentElement?.removeChild(jssStyles)
  }, [])

  return (
    <Provider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalState>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </GlobalState>
      </ThemeProvider>
    </Provider>
  )
}

//_app.getInitialProps = async (context: NextPageContext) => {
//  const session = await getSession(context)
//
//  return { session }
//}
//
export default _app
