import { getCsrfToken } from 'next-auth/client'
import Router from 'next/router'
import { FC, FormEvent, useContext, useEffect, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core'

import { IAuthContext, ILoadingContext } from '../provider'
import { authContext, loadingContext } from '../provider/context'

interface ISignIn {}

const useStyles = makeStyles({
  loading: {
    margin: 'auto'
  },
  heading: {
    marginTop: 20
  },
  error: {
    marginTop: 20
  }
})

const SignIn: FC<ISignIn> = (): JSX.Element => {
  const { authState, setAuthState } = useContext(authContext) as IAuthContext
  const { setLoadingState } = useContext(loadingContext) as ILoadingContext

  useEffect(() => {
    setLoadingState(false)

    if (typeof window !== 'undefined') {
      authState === 'loading' || authState === false
        ? null
        : authState === true
        ? (setLoadingState(true), Router.push('/'))
        : console.log({ authState })
    }
  }, [])

  const classes = useStyles()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    setLoginError('')

    setLoadingState(true)

    getCsrfToken({}).then((csrfToken) =>
      fetch('api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csrfToken,
          username,
          password
        })
      })
        .then((res) => {
          if (res.url.includes('?error=')) {
            if (res.url.includes('?error=CredentialsSignin')) {
              setLoginError('Bad credentials')
            } else console.log(res)
            setAuthState(false)
            setLoadingState(false)
          } else {
            setLoadingState(true)
            setAuthState(true)
            Router.push(res.url)
          }
        })
        .catch((err) => (setLoadingState(false), console.log({ err })))
    )
  }

  return (
    <>
      {!!authState && (
        <Grid
          container
          alignItems='center'
          justify='center'
          style={{ minHeight: '100vh' }}
        >
          <CircularProgress className={classes.loading} />
        </Grid>
      )}
      {!authState && (
        <Container>
          <Typography variant='h3' className={classes.heading}>
            Login:
          </Typography>
          <form
            autoComplete='off'
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
          >
            <Box
              margin='auto'
              maxWidth='25rem'
              display='flex'
              flexDirection='column'
            >
              <TextField
                margin='normal'
                variant='outlined'
                color='primary'
                required
                autoComplete='off'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label='Username'
                error={!!loginError}
                helperText={loginError}
              />
              <TextField
                margin='normal'
                variant='outlined'
                color='primary'
                required
                autoComplete='off'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label='Password'
                error={!!loginError}
                helperText={loginError}
              />
              <Button variant='contained' color='primary' type='submit'>
                Sign in
              </Button>
            </Box>
          </form>
        </Container>
      )}
    </>
  )
}

//SignIn.getInitialProps = async (context: NextPageContext) => {
//    const session = await getSession(context)
//    session &&
//      context.res
//        ?.writeHead(302, 'User found', {
//          Location: `${process.env.NEXTAUTH_URL}`
//        })
//        .end()
//    //- This isn't working as expected. going to frontend way {Router}
//return {
//csrfToken: await csrfToken(context)
//}
//}
export default SignIn
