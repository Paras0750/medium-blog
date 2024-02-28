import { useGetAllBlogsQuery } from "@/service/blogService";


export const BlogPage = () => {
  const { data, isLoading, isError } =  useGetAllBlogsQuery();

  if (isLoading) return <div>Loading...</div>;
  console.log(data);

  if (isError || !data) return <div>Error</div>;

  return (
    <div>
      Welcome To Blog Page
      <div>
        {data
          ? data.posts.map((blog) => (
              <div className="py-2">
                <a href={`/blog/${blog.id}`}>
                  <div>Title: {blog.title}</div>
                  <div>Content: {blog.content}</div>
                </a>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};
