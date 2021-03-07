import BlogElement from "../../Components/BlogElement";
import BlogModel, { IBlog } from "../../models/Blog.model";
import Meta from "../../Components/Meta";

export const getStaticProps = async () => {
  const result = await BlogModel.find();
  const blogs = result.map((doc) => {
    const blog = doc.toObject();
    blog._id = blog._id.toString();
    blog.createdAt = blog.createdAt.toString();
    blog.updatedAt = blog.updatedAt.toString();
    return blog;
  });

  return {
    props: { blogs: blogs },
  };
};

const allBlogs = ({ blogs }: { blogs: IBlog[] }) => {
  return (
    <div className="">
      <Meta title="All Blogs" />
      {blogs && blogs.map((blog) => <BlogElement key={blog._id} {...blog} />)}
    </div>
  );
};

export default allBlogs;
