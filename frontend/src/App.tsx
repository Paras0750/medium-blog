import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { BlogPage } from "./pages/BlogPage";
import { Navbar } from "./components/navbar";
import { UploadBlog } from "./pages/UploadBlog";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<BlogPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/upload-blog" element={<UploadBlog />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
