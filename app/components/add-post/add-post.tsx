import { Form, Link } from "react-router";
import { ErrorMessage } from "../ui/error-message";

export function AddPost({ error }: { error?: string }) {
  return (
    <div className="flex flex-col gap-16 min-h-0 w-1/2 mx-auto">
      <header className="flex gap-9 justify-between">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Add Post
        </h1>
        <Link className="p-2 rounded border" to="/">
          Cancel
        </Link>
      </header>
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col gap-8 w-xs"
      >
        <input
          className="border-slate-500 border p-2 rounded-sm"
          name="image"
          type="file"
          placeholder="Upload Image"
          required
        />
        <input
          className="border-slate-500 border p-2 rounded-sm"
          name="title"
          type="text"
          placeholder="Title"
          required
        />
        <textarea
          className="border-slate-500 border p-2 rounded-sm"
          name="description"
          placeholder="Description"
          required
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Save
        </button>
        {error ? <ErrorMessage message={error} /> : null}
      </Form>
    </div>
  );
}
