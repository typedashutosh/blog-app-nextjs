import { createClient } from 'contentful'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { FC, useContext, useEffect, useState } from 'react'

import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import {
  Button,
  Container,
  makeStyles,
  Toolbar,
  Typography
} from '@material-ui/core'

import { IBlogCard } from '../../Components/BlogCard'
import { authContext, loadingContext } from '../../provider/context'
import { IAuthContext, ILoadingContext } from '../../provider'

interface IBlog {
  blog: IBlogCard['blog']
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY
})

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: 'blog'
  })
  const paths = res.items.map((item) => {
    return { params: { id: item.sys.id } }
  })
  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { items } = await client.getEntries({
    content_type: 'blog',
    'sys.id': params?.id
  })
  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: { blog: items[0] },
    revalidate: 1
  }
}
const useStyles = makeStyles({
  linearProgress: {
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 100
  }
})
const blog: FC<IBlog> = ({ blog }) => {
  const { setLoadingState } = useContext(loadingContext) as ILoadingContext
  const { authState } = useContext(authContext) as IAuthContext
  useEffect(() => {
    setLoadingState(false)
  }, [])
  const classes = useStyles()

  const handleBookmark = () => {
    setLoadingState(true)
    //- fetch bookmark
    fetch('/api/resource/bookmark', {
      method: 'POST',
      body: JSON.stringify({ blogID: blog.sys.id })
    })
      .then((res) => {
        if (res.status === 201) setLoadingState(false)
        else {
          setLoadingState(false)
          throw new Error('failed to save')
        }
      })
      // .then((data) => console.log(data))
      .catch((err) => console.log(err))
    // setTimeout(() => {
    //   setLoadingState(false)
    // }, 2000)
  }

  if (!blog) {
    return <></>
  } else
    return (
      <Container>
        <div className='headerImage'>
          <Image
            src={`https:${blog.fields.headerImage.fields.file.url}`}
            // height={blog.fields.headerImage.fields.file.details.image.height}
            // width={blog.fields.headerImage.fields.file.details.image.width}
            height={400}
            width={1600}
          />
        </div>
        <Typography component='h3' variant='h3'>
          {blog.fields.title}
        </Typography>
        <Typography component='summary' variant='subtitle1'>
          {blog.fields.description}
        </Typography>
        <Typography component='span' variant='body1'>
          {documentToReactComponents(blog.fields.blogContent)}
        </Typography>
        {authState && (
          <Toolbar>
            <Button
              variant='contained'
              color='primary'
              size='medium'
              onClick={() => handleBookmark()}
            >
              Bookmark
            </Button>
          </Toolbar>
        )}
      </Container>
    )
}

export default blog
