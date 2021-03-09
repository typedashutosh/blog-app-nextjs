import { GetStaticPaths, GetStaticProps } from 'next'
import Router from 'next/router'
import { useState } from 'react'
import Meta from '../../Components/Meta'
import BlogModel, { IBlog } from '../../models/Blog.model'
import dbConnect from '../../utils/dbConnect'

export const getStaticPaths: GetStaticPaths = async () => {
  dbConnect()
  const result = await BlogModel.find()
  const paths = result.map((doc) => {
    const blog = doc.toObject()
    return {
      params: { id: blog._id.toString() }
    }
  })
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const result = await BlogModel.findById(context.params?.id)
  const blog = result.toObject()
  blog._id = blog._id.toString()
  blog.createdAt = blog.createdAt.toString()
  blog.updatedAt = blog.updatedAt.toString()
  return { props: { blog } }
}

const BlogPage = ({ blog }: { blog: IBlog }) => {
  const [votes, setVotes] = useState(blog.votes)

  //---Vote Handler

  const vote = async () => {
    fetch('/api/resources/vote', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        work: 'INCREMENT',
        id: blog._id
      })
    })
      .then((res) => res.json())
      .then((doc: IBlog) => setVotes(doc.votes))
      .catch((err) => console.log(err))
  }

  return (
    <div className=''>
      <Meta title={blog.title} />
      <div onClick={() => Router.back()} className='ml-8 flex px-2 py-1 cursor-pointer w-max items-center'>
        <div className='go-back-btn border-l-2 border-b-2 border-black h-4 w-4 transform rotate-45'></div>
        <div className='go-back-text text-lg px-2 border-b-2 border-white hover:border-black transition-all duration-200'>
          Go Back
        </div>
      </div>
      <h1 className='mx-10 mt-5 text-4xl mb-2'>{blog.title}</h1>
      <span className='mx-10 p-2 pl-0 text-gray-600'>Author : {blog.author}</span>
      <p className='mx-10 mt-2 text-justify'>{blog.content}</p>
      <div className='mx-10 mt-2 mb-4'>
        <input
          className='rounded-tl-lg rounded-bl-lg bg-gray-400 py-2 px-4 text-base cursor-pointer outline-none'
          type='button'
          value={votes}
          disabled
        />
        <input
          className='rounded-tr-lg rounded-br-lg bg-blue-500 active:bg-blue-500 hover:bg-blue-600 transition-all duration-200 py-2 px-4 text-base cursor-pointer outline-none'
          type='button'
          onClick={vote}
          value='Vote now'
        />
      </div>
      <style>
        {`
          div.go-back-btn:hover + div.go-back-text {
            border-color: black;
          }
        `}
      </style>
    </div>
  )
}

export default BlogPage
