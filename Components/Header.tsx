import Link from 'next/link'
import Router from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { newBlogAction } from '../actions/blog.action'
import { userLoginAction } from '../actions/user.action'
import { store } from '../store'

const Header = () => {
  const dispatch = useDispatch()

  //* Local States
  const [search, setSearch] = useState<string>('')
  const { userInfoState } = store.getState()

  //* Handlers
  const logoutHandler = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(userLoginAction(data))
        Router.push('/')
      })
      .catch((err) => console.log(err))
  }

  const newBlogHandler = () => {
    fetch('/api/resources/new_blog', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data._event === 'CREATED') {
          dispatch(newBlogAction(data))
          Router.push('/resources/new_blog')
        } else console.log('err:::>', data)
      })
      .catch((err) => console.log('err:::>', err))
  }

  //?
  return (
    <header className='py-2 mb-2 mt-2 px-10 flex justify-between items-center'>
      <span className=' logo font-medium text-3xl mr-4 cursor-pointer border-white border-b-2 transition-all duration-200 hover:border-black'>
        <Link href='/'>BLOG</Link>
      </span>
      <div className='flex-1'>
        <input
          className=' shadow-md px-2 py-1  max-w-4xl rounded transition-all duration-200  hover:shadow-lg focus:outline-none focus:shadow-lg outline-none '
          placeholder='Search everywhere...'
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className=''></div>
      </div>
      {userInfoState.authorised ? (
        <>
          <a
            className='text-lg py-1 px-2 cursor-pointer border-white border-b-2 transition-all duration-200 hover:border-black font-light'
            onClick={newBlogHandler}
          >
            New Blog
          </a>
          <Link href='/profile'>
            <span className='text-lg py-1 px-2 cursor-pointer border-white border-b-2 transition-all duration-200 hover:border-black font-light'>
              Profile
            </span>
          </Link>
          <a
            className=' text-lg py-1 px-2 cursor-pointer border-white border-b-2 transition-all duration-200 hover:border-black font-light'
            onClick={logoutHandler}
          >
            Logout
          </a>
        </>
      ) : (
        <>
          <Link href='/login'>
            <span className='text-lg py-1 px-2 cursor-pointer border-white border-b-2 transition-all duration-200 hover:border-black font-light'>
              Login
            </span>
          </Link>
          <Link href='/signup'>
            <span className='text-lg py-1 px-2 cursor-pointer border-white border-b-2 transition-all duration-200 hover:border-black font-light'>
              Signup
            </span>
          </Link>
        </>
      )}
    </header>
  )
}

export default Header
