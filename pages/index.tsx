import { createClient } from 'contentful'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps
} from 'next'
import { FC, ReactElement } from 'react'

import { Container, makeStyles } from '@material-ui/core'

import BlogCard from '../Components/BlogCard'
import { IBlogCard } from '../Components/BlogCard'
import Carousel from '../Components/Carousel'
import { ParsedUrlQuery } from 'node:querystring'

interface Iindex {
  Blogs: IBlogCard['blog'][]
}
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>
) => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
  })
  const res = await client.getEntries({ content_type: 'blog' })
  return { props: { Blogs: res.items } }
}

const useStyles = makeStyles({})
const index: FC<Iindex> = ({ Blogs }): ReactElement => {
  const classes = useStyles()
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
