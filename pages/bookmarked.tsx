import { Container } from '@material-ui/core'
import { createClient } from 'contentful'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { FC, ReactElement } from 'react'
import UserModel from '../models/User.model'
import dbConnect from '../utils/dbConnect'
import BlogCard from '../Components/BlogCard'
import { isConstructorDeclaration } from 'typescript'
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
    let Blogs: any[] = []
    for (let index = 0; index < blogs.length; index++) {
      const blogID = blogs[index]
      const data = await client.getEntries({
        content_type: 'blog',
        'sys.id': blogID
      })
      Blogs.push(data.items[0])
    }
    //- fix this for method
    return { props: { Blogs } }
  }
}

const bookmarked: FC<Ibookmarked> = ({ Blogs }): ReactElement => {
  return (
    <Container>
      {Blogs.map((blog) => (
        <BlogCard key={blog.sys.id} blog={blog} />
      ))}
    </Container>
  )
}

export default bookmarked
