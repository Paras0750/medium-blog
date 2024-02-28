import { useGetAllBlogsQuery } from "@/service/blogService";
import { useNavigate } from "react-router-dom";

export const BlogPage = () => {
  const { data, isLoading, isError } = useGetAllBlogsQuery();
  const navigate = useNavigate();
  if (isLoading) return <div>Loading...</div>;
  console.log(data);

  if (isError || !data) return <div>Error</div>;

  if (localStorage.getItem("token") === null) navigate("/signin");
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
