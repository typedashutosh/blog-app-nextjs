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

interface InewUser {}

const useStyles = makeStyles({
  loading: {}
})

const newUser: FC<InewUser> = (): JSX.Element => {
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
  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [firstnameError, setFirstnameError] = useState<string>('')
  const [usernameError, setUsernameError] = useState<string>('')
  const [passwordError, setpasswordError] = useState<string>('') // todo setup confirm password

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    setFirstnameError('')
    setUsernameError('')
    setpasswordError('')

    setLoadingState(true)

    getCsrfToken({})
      .then((csrfToken) => {
        fetch('/api/auth/new_user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            csrfToken,
            firstname,
            lastname,
            username,
            password
          })
        })
          .then(async (res) => res.json())
          .then(async (data) => {
            if (data.success) {
              setLoadingState(true)

              fetch('/api/auth/callback/credentials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  csrfToken,
                  username: data.username,
                  password: data.password
                })
              })
                .then((res) => {
                  if (res.url.includes('?error=')) {
                    // todo error handling if there any
                    setAuthState(false)
                    setLoadingState(false)
                    console.log(res)
                  } else {
                    setLoadingState(true)
                    setAuthState(true)
                    Router.push(res.url)
                  }
                })
                .catch((err) => (setLoadingState(false), console.log({ err })))
            } else {
              console.log(data)
              setLoadingState(false)
              if (data.errors) {
                data.errors.forEach((err: any) => {
                  if (!!err.path) {
                    if (err.path === 'firstname') setFirstnameError(err.message)
                    if (err.path === 'username') setUsernameError(err.message)
                    if (err.path === 'password') setpasswordError(err.message)
                  }
                  setUsernameError(err.message)
                })
              } else if (data.err) console.log(data.err.status)
              //- check this
              else console.log(data)
            }
          })
      })
      .catch((err: any) => (setLoadingState(false), console.log({ err })))
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
          <Typography variant='h2'>Register</Typography>
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
                color='primary'
                variant='outlined'
                label='Firstname'
                autoComplete='off'
                required
                value={firstname}
                onChange={(e) => {
                  setFirstname(e.target.value)
                }}
              />
              {firstnameError}
              <TextField
                margin='normal'
                color='primary'
                variant='outlined'
                autoComplete='off'
                label='Lastname'
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              <TextField
                margin='normal'
                color='primary'
                variant='outlined'
                autoComplete='off'
                required
                label='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!usernameError}
                helperText={usernameError}
              />
              <TextField
                margin='normal'
                color='primary'
                variant='outlined'
                autoComplete='off'
                required
                label='Password'
                type='password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
              <Button variant='contained' color='primary' type='submit'>
                Signup
              </Button>
            </Box>
          </form>
        </Container>
      )}
    </>
  )
}

//newUser.getInitialProps = async (context: NextPageContext) => {
//  const session = await getSession(context)
//  session &&
//    context.res
//      ?.writeHead(302, 'User found', {
//        Location: `${process.env.NEXTAUTH_URL}`
//      })
//      .end()
//  return {
//    csrfToken: await csrfToken(context)
//  }
//}

export default newUser
