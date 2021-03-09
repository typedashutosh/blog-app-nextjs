import dbconnect from '../utils/dbConnect'
import BlogModel, { IBlog } from '../models/Blog.model'
import BlogElement from '../Components/BlogElement'
import Carousal from '../Components/Carousal'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import Meta from '../Components/Meta'
import 'swiper/swiper.min.css'
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.min.css'
import 'swiper/components/scrollbar/scrollbar.min.css'

export const getStaticProps: GetStaticProps = async () => {
  await dbconnect()

  const result = await BlogModel.find(
    { mode: 'PUBLIC', state: 'PUBLISHED' },
    ['title', 'description', 'content', '_id', 'authorID', 'author', 'votes', 'createdAt'],
    {
      skip: 0,
      limit: 10,
      sort: {
        votes: -1
      }
    }
  )
  const blogs = result.map((doc) => {
    const blog = doc.toObject()
    blog._id = blog._id.toString()
    blog.createdAt = blog.createdAt.toString()
    return blog
  })

  return { revalidate: 5 }
}

const index = ({ blogs }) => {
  return (
    <div className=''>
      <Meta title='BLOG | HOMEPAGE' />
      <Carousal />
      <div>
        {blogs && blogs.slice(0, 5).map((blog: IBlog) => <BlogElement key={blog._id} {...blog} />)}
        <Link href='/resources'>
          <div className='mb-2 mx-auto py-2 px-4 text-white active:bg-gray-100 rounded-md bg-black transition-all duration-200 hover:bg-white hover:text-black cursor-pointer shadow-lg w-max'>
            View all blogs
          </div>
        </Link>
      </div>
    </div>
  )
}

export default index
