import { NextPage } from 'next'
import { Provider, getSession } from 'next-auth/client'
import { AppProps } from 'next/app'
import { ReactElement, useEffect } from 'react'

import { CssBaseline, ThemeProvider } from '@material-ui/core'

import Layout from '../Components/Layout'
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
  //  useEffect(() => {
  //    console.log(router.query.auth)
  //  }, [Component])
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout auth={Boolean(router.query.auth) || false}>
          <Component {...pageProps} />
        </Layout>
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
