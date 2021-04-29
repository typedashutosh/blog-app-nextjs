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

import { IAuthContext } from '../provider'
import { authContext } from '../provider/context'
import { useForm } from '../hooks/useForm'
import setLoading from '../hooks/setLoading'

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

  useEffect(() => {
    setLoading(false)

    if (typeof window !== 'undefined') {
      authState === 'loading' || authState === false
        ? null
        : authState === true
        ? (setLoading(true), Router.push('/'))
        : console.log({ authState })
    }
  }, [])

  const classes = useStyles()
  const [values, handleChange] = useForm({ username: '', password: '' })
  const [loginError, setLoginError] = useState<string>('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    setLoginError('')

    setLoading(true)

    fetch('api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        csrfToken: await getCsrfToken({}),
        username: values.username,
        password: values.password
      })
    })
      .then((res) => {
        if (res.url.includes('?error=')) {
          if (res.url.includes('?error=CredentialsSignin')) {
            setLoginError('Bad credentials')
          } else console.log(res)
          setAuthState(false)
          setLoading(false)
        } else {
          setLoading(true)
          setAuthState(true)
          Router.push(res.url)
        }
      })
      .catch((err) => (setLoading(false), console.log({ err })))
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
                value={values.username}
                onChange={(e) => handleChange(e)}
                label='Username'
                error={!!loginError}
                helperText={loginError}
                id='username'
              />
              <TextField
                margin='normal'
                variant='outlined'
                color='primary'
                required
                autoComplete='off'
                type='password'
                value={values.password}
                onChange={(e) => handleChange(e)}
                label='Password'
                id='password'
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
