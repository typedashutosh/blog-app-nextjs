import { AppProps } from 'next/app'
import '../Styles/tailwind.css'
import Header from '../Components/Header'
import { Provider } from 'react-redux'
import { store } from '../store'

const _app = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Header />
      <Component {...pageProps} />
    </Provider>
  )
}

export default _app
