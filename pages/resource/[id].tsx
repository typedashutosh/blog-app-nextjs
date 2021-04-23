import {
  Button,
  Container,
  LinearProgress,
  makeStyles,
  Toolbar,
  Typography
} from '@material-ui/core'
import { createClient } from 'contentful'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { FC, useState } from 'react'
import { IBlogCard } from '../../Components/BlogCard'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

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
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const classes = useStyles()
  const handleBookmark = () => {
    setLoadingState(true)
  }
  if (!blog) {
    return <></>
  } else
    return (
      <>
        {loadingState && (
          <LinearProgress
            color='secondary'
            className={classes.linearProgress}
          />
        )}
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
          <Typography>
            {documentToReactComponents(blog.fields.blogContent)}
          </Typography>
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
        </Container>
      </>
    )
}

export default blog
