import { FC, useEffect, useState } from 'react'
import { store } from '../../store'
import Meta from '../../Components/Meta'
import { useDispatch } from 'react-redux'
import { userLoginAction } from '../../actions/user.action'

const newBlog: FC<any> = () => {
  // console.log('fdasfda', authorised)
  //. Declare States
  // const { userInfoState, newBlogState } = store.getState()
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [mode, setMode] = useState<'public' | 'private'>('private')

  //. Setting Authenticated state

  //  //* Handlers
  //  const draftHandler = () => {
  //    fetch('/api/resources/newBlog', {
  //      method: 'PATCH',
  //      headers: { 'Content-Type': 'application/json' },
  //      body: JSON.stringify({
  //        work: 'UPDATE',
  //        blogID,
  //        title,
  //        description,
  //        content
  //      })
  //    })
  //      .then((res) => res.json())
  //      .then((data) => console.log(data))
  //      .catch((err) => console.log('12121212121 err: ', err))
  //  }
  //  const publishHandler = () => {}
  //  const deleteHandler = () => {}
  return (
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
        // onChange={(e) =>
        // e.target.checked ? setMode('private') : setMode('public')
        // }
      />
      <label htmlFor='post-as'>Post as private</label>
      <br />
      <input
        className='mt-2 py-2 px-4 rounded-tl-md rounded-bl-md bg-blue-400 hover:bg-blue-500 transition-all duration-200 cursor-pointer'
        type='button'
        value='Draft'
        // onClick={draftHandler}
      />
      <input
        className='mt-2 py-2 px-4 bg-green-400 hover:bg-green-500 transition-all duration-200 cursor-pointer'
        type='button'
        value='Publish'
        // onClick={publishHandler}
      />
      <input
        className='mt-2 py-2 px-4 rounded-tr-md rounded-br-lg bg-red-400 hover:bg-red-500 transition-all duration-200 cursor-pointer'
        type='button'
        value='Delete'
        // onClick={deleteHandler}
      />
    </div>
  )
}

export default newBlog
