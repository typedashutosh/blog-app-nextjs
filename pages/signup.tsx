import { FormEvent, useState } from 'react'
import Meta from '../Components/Meta'
import Router from 'next/router'
import { useDispatch } from 'react-redux'
import { userLoginAction } from '../actions/user.action'

const signup = () => {
  const [firstname, setFirstname] = useState<string>('')
  const [lastname, setLastname] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [usernameError, setUsernameError] = useState<string>('')
  const [firstnameError, setFirstnameError] = useState<string>('')
  const dispatch = useDispatch()

  const signupHandler = (e: FormEvent) => {
    e.preventDefault()
    fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, username, password })
    })
      .then((res) => res.json())
      .then((data) => {
        setUsernameError('')
        dispatch(userLoginAction(data))
        if (data.authorised) Router.push(Router.query.referer?.toString() || '/')
        if (data.message === 'Firstname is required') {
          setFirstnameError(data.message)
        }
        if (data.message === 'Username already taken') {
          setUsernameError(data.message)
        }
      })
      .catch((err) => console.log(err))
  }
  return (
    <div className='w-max shadow-lg mx-auto py-4 px-4 rounded-lg'>
      <Meta title='Signup' />
      <form className='flex flex-col'>
        <span className='py-2 px-4 text-2xl'>Signup:</span>

        <label className='my-2 mx-4 text-lg' htmlFor='firstname'>
          Firstname:
          <span style={{ color: 'red', margin: '0', fontSize: '1rem' }}>*</span>
        </label>
        <input
          className='my-4 mx-2 py-1 px-2 text text-base shadow-md hover:shadow-lg focus:shadow-lg w-72 transition-all duration-200 outline-none rounded-md'
          id='firstname'
          type='text'
          placeholder='Firstname'
          onChange={(e) => setFirstname(e.target.value)}
          value={firstname}
          required
        />
        <span style={{ color: 'red', fontSize: '.75rem' }}>{firstnameError}</span>

        <label className='my-2 mx-4 text-lg' htmlFor='lastname'>
          Lastname:
        </label>
        <input
          className='my-4 mx-2 py-1 px-2 text text-base shadow-md hover:shadow-lg focus:shadow-lg w-72 transition-all duration-200 outline-none rounded-md'
          id='lastname'
          type='text'
          placeholder='Lastname'
          onChange={(e) => setLastname(e.target.value)}
          value={lastname}
        />

        <label className='my-2 mx-4 text-lg' htmlFor='username'>
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

        <label className='my-2 mx-4 text-lg' htmlFor='password'>
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
        <input
          className='px-4 py-2 m-auto w-max bg-black shadow-sm hover:shadow-md hover:bg-white text-white hover:text-black transition-all duration-200 rounded-md cursor-pointer outline-none'
          type='button'
          value='Signup'
          onClick={signupHandler}
        />
      </form>
    </div>
  )
}

export default signup
