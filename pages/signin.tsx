import { GetServerSideProps } from 'next'
import { getCsrfToken, getSession } from 'next-auth/client'
import Router from 'next/router'
import { FC, FormEvent, useContext, useState } from 'react'

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

interface ISignIn {
  csrfToken: string | null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  }
}

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

const SignIn: FC<ISignIn> = ({ csrfToken }): JSX.Element => {
  const { authState, setAuthState } = useContext(authContext) as IAuthContext

  typeof window !== 'undefined' && authState && Router.push('/')

  const classes = useStyles()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError('')
    fetch('api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csrfToken, username, password })
    })
      .then((res) => {
        if (res.url.includes('?error=')) {
          setLoginError('Bad credentials')
          setAuthState(false)
        } else {
          Router.push(res.url)
          setAuthState(true)
        }
      })
      .catch((err) => console.log({ err }))
  }

  return (
    <>
      {authState && (
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
