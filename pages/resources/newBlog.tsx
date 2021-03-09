import { useEffect, useState } from 'react'
import { store } from '../../store'
import Meta from '../../Components/Meta'
import Router from 'next/router'

const newBlog = () => {
  // console.log('fdasfda', authorised)
  //--- Declare States
  const { userInfoState, newBlogState } = store.getState()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [mode, setMode] = useState<'PUBLIC' | 'PRIVATE'>('PRIVATE')
  const [work, setWork] = useState<'UPDATE' | 'PUBLISH' | 'DELETE'>('UPDATE')
  const [buttondisable, setButtondisable] = useState<boolean>(false)
  //--- Setting Authenticated state
  const isServer = () => typeof window === 'undefined'
  if (!isServer()) {
    if (!userInfoState.authorised) {
      Router.push('/login')
    }
  }
  //--- Handlers

  const saveHandler = () => {
    fetch('/api/resources/newBlog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        work,
        BlogID: newBlogState.blogID,
        title,
        description,
        content,
        mode
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._event === 'SAVED') Router.push(`/resources/${newBlogState.blogID}`)
        if (data._event === 'DELETED') Router.push(`/`)
      })
      .catch((err) => console.log('newBlog.tsx saveHandler err: ', err))
  }

  useEffect(() => {
    saveHandler()
  }, [work])

  //  const deleteHandler = () => {}

  return (
    <>
      {userInfoState.authorised && (
        <div className='mx-10'>
          <Meta title='New Blog' />
          <input
            className='text-4xl outline-none block w-full mt-4 p-2 placeholder-black '
            placeholder='Give your blog a title...'
            autoFocus={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type='text'
            name='title'
            id='blog-title'
          />
          <input
            className='text-lg outline-none block w-full mt-2 p-2 text-gray-600 placeholder-gray-500 '
            placeholder='Enter some meaningful description...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type='text'
            name='description'
            id='blog-keywords'
          />
          <textarea
            className='border-2 w-full h-60 mt-2 p-2 outline-none'
            placeholder='Enter blog content here...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <input
            className='my-2 mr-2'
            type='checkbox'
            name='post-as'
            id='post-as'
            onChange={(e) => (e.target.checked ? setMode('PUBLIC') : setMode('PRIVATE'))}
          />
          <label htmlFor='post-as'>Post as PUBLIC</label>
          <br />
          <input
            className='mt-2 py-2 px-4 rounded-tl-md rounded-bl-md bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 cursor-pointer outline-none'
            type='button'
            value='Draft'
            onClick={saveHandler}
            disabled={buttondisable}
          />
          <input
            className='mt-2 py-2 px-4 bg-green-500 hover:bg-green-600 active:bg-green-700 transition-all duration-200 cursor-pointer outline-none'
            type='button'
            value='Publish'
            onClick={() => {
              setButtondisable(true)
              setWork('PUBLISH')
            }}
            disabled={buttondisable}
          />
          <input
            className='mt-2 py-2 px-4 rounded-tr-md rounded-br-lg bg-red-500 hover:bg-red-600 active:bg-red-700 transition-all duration-200 cursor-pointer outline-none'
            type='button'
            value='Delete'
            onClick={() => {
              setButtondisable(true)
              setWork('DELETE')
            }}
            disabled={buttondisable}
          />
        </div>
      )}
    </>
  )
}

export default newBlog
