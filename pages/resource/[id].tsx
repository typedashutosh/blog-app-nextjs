import { Container } from '@material-ui/core'
import { createClient } from 'contentful'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { FC } from 'react'
import { IBlogCard } from '../../Components/BlogCard'

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

const blog: FC<IBlog> = ({ blog }) => {
  return (
    <Container>
      {/* <div className='headerImage'>
        <Image
          src={`https:${blog.fields.headerImage.fields.file.url}`}
          height={900}
          width={1600}
        />
      </div> */}
    </Container>
  )
}

export default blog
