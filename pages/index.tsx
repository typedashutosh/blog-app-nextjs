import { createClient } from 'contentful'
import { GetServerSideProps } from 'next'
import { FC, ReactElement, useContext, useEffect } from 'react'

import { Container, makeStyles } from '@material-ui/core'

import BlogCard, { IBlogCard } from '../Components/BlogCard'
import Carousel from '../Components/Carousel'
import { ILoadingContext } from '../provider'
import { loadingContext } from '../provider/context'

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
  const { setLoadingState } = useContext(loadingContext) as ILoadingContext

  useEffect(() => {
    setLoadingState(false)
  }, [])

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
