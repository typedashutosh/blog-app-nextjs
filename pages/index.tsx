import { createClient } from 'contentful'
import { GetServerSideProps } from 'next'
import { FC, ReactElement } from 'react'

import { Container, makeStyles } from '@material-ui/core'

import BlogCard, { IBlogCard } from '../Components/BlogCard'
import Carousel from '../Components/Carousel'
import setLoading from '../hooks/setLoading'

interface Iindex {
  Blogs: IBlogCard['blog'][]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
  })
  const { items } = await client.getEntries({ content_type: 'blog' })
  return { props: { Blogs: items } }
}

const useStyles = makeStyles({})

const index: FC<Iindex> = ({ Blogs }): ReactElement => {
  const classes = useStyles()
  setLoading(false)

  return (
    <>
      <Carousel />
      <Container>
        {Blogs.map((blog) => (
          <BlogCard key={blog.sys.id} blog={blog} />
        ))}
      </Container>
    </>
  )
}

export default index
