import { useGetBlogQuery, useUpdateBlogMutation } from "@/service/blogService";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";

export const Blog = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch, isFetching } = useGetBlogQuery(id || "");
  const [updateBlog, { isSuccess: isUpdateSuccess, isLoading: isUpdating }] = useUpdateBlogMutation();
  const updatedTitle = useRef<HTMLInputElement>(null);
  const updatedContent = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUpdateSuccess) {
      refetch();
    }
  }, [isUpdateSuccess, refetch]);


  function handleBlogEdit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    e.preventDefault();
    if (!updatedTitle.current || !updatedContent.current) return;
    console.log(updatedTitle.current?.value, updatedContent.current?.value);
    updateBlog({
      id: data?.post.id,
      title: updatedTitle.current?.value,
      content: updatedContent.current?.value,
    });
  }

  if (isLoading || isUpdating || isFetching) return <div>Loading...</div>;

  if (isError || !data) return <div>Error</div>;
  return (
    <div>
      <h1>Blog: {id}</h1>
      {data ? (
        <div className="flex gap-10">
          <div>
            <h1>{data.post.title}</h1>
            <h1>{data.post.content}</h1>
          </div>
          <div className="flex gap-4">
            {/* edit button */}
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Blog</DialogTitle>
                    <DialogDescription>
                      Make Changes to your blog
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        defaultValue={data.post.title}
                        className="col-span-3"
                        ref={updatedTitle}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content" className="text-right">
                        Content
                      </Label>
                      <Input
                        id="content"
                        defaultValue={data.post.content}
                        className="col-span-3"
                        ref={updatedContent}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit" onClick={handleBlogEdit}>
                        Save changes
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
            {/* delete button */}
            <button className="border p-1">Delete</button>
            {/* share button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Share</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    Anyone who has this link will be able to view this.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input id="link" value={document.location.href} readOnly />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="px-3"
                    // copy to clipboard
                    onClick={() =>
                      navigator.clipboard.writeText(document.location.href)
                    }
                  >
                    <span className="sr-only">Copy</span>
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : null}
    </div>
  );
};
