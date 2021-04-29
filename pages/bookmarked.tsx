import { createClient } from 'contentful'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { FC, ReactElement, useContext, useEffect } from 'react'

import { Container } from '@material-ui/core'

import BlogCard from '../Components/BlogCard'
import UserModel from '../models/User.model'
import { ILoadingContext } from '../provider'
import { loadingContext } from '../provider/context'
import dbConnect from '../utils/dbConnect'

interface Ibookmarked {
  Blogs: any[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  dbConnect()
  const session = await getSession(context)
  const doc = await UserModel.findById(session?.user?._id, ['blogs'])
  if (!doc) {
    return { props: { data: null } }
  } else {
    const { blogs } = doc
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_KEY
    })

    const Blogs = async () => {
      const promises = blogs.map(async (blogID: any) => {
        return (
          await client.getEntries({
            content_type: 'blog',
            'sys.id': blogID
          })
        ).items[0]
      })
      const allPromises = Promise.all(promises)
      return allPromises
    }

    return { props: { Blogs: await Blogs() } }
  }
}

const bookmarked: FC<Ibookmarked> = ({ Blogs }): ReactElement => {
  const { setLoadingState } = useContext(loadingContext) as ILoadingContext

  useEffect(() => {
    setLoadingState(false)
  }, [])
  return (
    <Container>
      {Blogs.map((blog) => (
        <BlogCard key={blog.sys.id} blog={blog} />
      ))}
    </Container>
  )
}

export default bookmarked
