import { useUploadBlogMutation } from "@/service/blogService";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const UploadBlog = () => {
  const navigator = useNavigate();
  const [uploadBlog, { isSuccess }] = useUploadBlogMutation();
  const blogTitle = useRef<HTMLInputElement>(null);
  const blogContent = useRef<HTMLTextAreaElement>(null);

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = blogTitle.current?.value;
    const content = blogContent.current?.value;
    if (!title || !content) return;
    uploadBlog({ title, content });
  };

  if (isSuccess) {
    navigator("/");
  }

  return (
    <div>
      UploadBlog
      <form onSubmit={handelSubmit}>
        <div className="flex items-center gap-4">
          <label>Title</label>
          <input ref={blogTitle} type="text" className="border my-2" />
        </div>
        <div className="flex items-center gap-4">
          <label>Content</label>
          <textarea
            ref={blogContent}
            className="border my-2"
            rows={10}
            cols={17}
          ></textarea>
        </div>
        <div>
          <button type="submit" className=" border px-3">
            Upload!
          </button>
        </div>
      </form>
    </div>
  );
};
