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
import { useForm } from '../hooks/useForm'
import setLoading from '../hooks/setLoading'

interface InewUser {}

const useStyles = makeStyles({
  loading: {}
})

const newUser: FC<InewUser> = (): JSX.Element => {
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
  const [values, handleChange] = useForm({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [firstnameError, setFirstnameError] = useState<string>('')
  const [usernameError, setUsernameError] = useState<string>('')
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    setFirstnameError('')
    setUsernameError('')
    setConfirmPasswordError('')

    if (values.confirmPassword !== values.password) {
      setConfirmPasswordError('Password Mismatched')
      return
    }
    setLoading(true)

    getCsrfToken({})
      .then((csrfToken) => {
        fetch('/api/auth/new_user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            csrfToken,
            firstname: values.firstname,
            lastname: values.lastname,
            username: values.username,
            password: values.password
          })
        })
          .then(async (res) => res.json())
          .then(async (data) => {
            if (data.success) {
              setLoading(true)

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
                    setLoading(false)
                    console.log(res)
                  } else {
                    setLoading(true)
                    setAuthState(true)
                    Router.push(res.url)
                  }
                })
                .catch((err) => (setLoading(false), console.log({ err })))
            } else {
              console.log(data)
              setLoading(false)
              if (data.errors) {
                data.errors.forEach((err: any) => {
                  if (!!err.path) {
                    if (err.path === 'firstname') setFirstnameError(err.message)
                    if (err.path === 'username') setUsernameError(err.message)
                    if (err.path === 'password')
                      setConfirmPasswordError(err.message)
                  }
                  setUsernameError(err.message)
                })
              } else if (data.err) console.log(data.err.status)
              //- check this
              else console.log(data)
            }
          })
      })
      .catch((err: any) => (setLoading(false), console.log({ err })))
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
                id='firstname'
                value={values.firstname}
                onChange={(e) => handleChange(e)}
                helperText={firstnameError}
              />
              <TextField
                margin='normal'
                color='primary'
                variant='outlined'
                autoComplete='off'
                label='Lastname'
                id='lastname'
                value={values.lastname}
                onChange={(e) => handleChange(e)}
              />
              <TextField
                margin='normal'
                color='primary'
                variant='outlined'
                autoComplete='off'
                required
                label='Username'
                id='username'
                value={values.username}
                onChange={(e) => handleChange(e)}
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
                id='password'
                value={values.password}
                onChange={(e) => handleChange(e)}
              />
              <TextField
                margin='normal'
                color='primary'
                variant='outlined'
                autoComplete='off'
                required
                label='Confirm Password'
                type='password'
                id='confirmPassword'
                value={values.confirmPassword}
                onChange={(e) => handleChange(e)}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
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
