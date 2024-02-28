import { RootState } from "@/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}
interface AllBlogResponse {
  posts: Post[];
}
interface BlogResponse {
  post: Post;
}
interface AuthRootState extends RootState {
  auth: {
    token: string | null;
  };
}

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token =
        localStorage.getItem("token") ||
        (getState() as AuthRootState).auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  keepUnusedDataFor: 60 * 1000,
  endpoints: (builder) => ({
    getAllBlogs: builder.query<AllBlogResponse, void>({
      query: () => "/blog",
    }),
    getBlog: builder.query<BlogResponse, string>({
      query: (id: string) => `/blog/${id}`,
    }),
    updateBlog: builder.mutation<BlogResponse, Partial<Post>>({
      query: (post) => ({
        url: `/blog`,
        method: "PUT",
        body: post,
      }),
    }),
    uploadBlog: builder.mutation<BlogResponse, Partial<Post>>({
      query: (post) => ({
        url: "/blog",
        method: "POST",
        body: post,
      }),
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogQuery,
  useUpdateBlogMutation,
  useUploadBlogMutation,
} = blogApi;
