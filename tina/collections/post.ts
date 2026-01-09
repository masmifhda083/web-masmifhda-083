import type { Collection } from "tinacms";

export const PostsCollection: Collection = {

  name: "post",
  label: "Posts",
  path: "src/content/posts",
  format: "md",
  fields: [
    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
    { type: "string", name: "author", label: "Author", required: false },
    { type: "datetime", name: "pubdate", label: "Publish Date", required: false },
    { type: "string", name: "description", label: "Description", required: false },
    { type: "string", name: "category", label: "Category", required: false },
    { type: "image", name: "heroImage", label: "Image (Ukuran gambar maksimal 1MB)"},
    // body handled by isBody
    { type: "rich-text", name: "body", label: "Body", isBody: true },
  ],
}
