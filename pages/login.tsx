import { FormEvent, useState } from 'react'
import Meta from '../Components/Meta'
import Router from 'next/router'
import { useDispatch } from 'react-redux'
import { userLoginAction } from '../actions/user.action'

const login = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [usernameError, setUsernameError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const dispatch = useDispatch()

  const loginHandler = (e: FormEvent): void => {
    e.preventDefault()
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then((res) => res.json())
      .then((data) => {
        setUsernameError('')
        setPasswordError('')
        dispatch(userLoginAction(data))
        if (data.authorised) Router.push('/')
        if (data.message === 'Username not found') {
          setUsernameError(data.message)
        }
        if (data.message === 'Password mismatched') {
          setPasswordError(data.message)
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='w-max shadow-lg mx-auto py-4 px-4 rounded-lg'>
      <Meta title='login' />
      <form className='flex flex-col' onSubmit={loginHandler}>
        <span className='py-2 px-4 text-2xl'>Login:</span>

        <label htmlFor='username' className='my-2 mx-4 text-lg'>
          Username:
          <span style={{ color: 'red', margin: '0', fontSize: '1rem' }}>*</span>
        </label>
        <input
          className='my-4 mx-2 py-1 px-2 text text-base shadow-md hover:shadow-lg focus:shadow-lg w-72 transition-all duration-200 outline-none rounded-md'
          id='username'
          type='text'
          placeholder='Username'
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />
        <span style={{ color: 'red', fontSize: '.75rem' }}>{usernameError}</span>

        <label htmlFor='password' className='my-2 mx-4 text-lg'>
          Password:
          <span style={{ color: 'red', margin: '0', fontSize: '1rem' }}>*</span>
        </label>
        <input
          className='my-4 mx-2 py-1 px-2 text text-base shadow-md hover:shadow-lg focus:shadow-lg w-72 transition-all duration-200 outline-none rounded-md'
          id='password'
          type='password'
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <span style={{ color: 'red', fontSize: '.75rem' }}>{passwordError}</span>

        <button
          className='px-4 py-2 m-auto w-max bg-black shadow-sm hover:shadow-md hover:bg-white text-white hover:text-black transition-all duration-200 rounded-md cursor-pointer outline-none'
          type='submit'
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default login
