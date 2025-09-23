import { Link } from "react-router";
import type { Post } from "~/domain/posts";

export function Feed({ posts, apiURL }: { posts: Post[]; apiURL: string }) {
  return (
    <div className="flex flex-col gap-16 min-h-0 w-1/2 mx-auto">
      <header className="flex gap-9 justify-between">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Feed
        </h1>
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          to="add-post"
        >
          Add Post
        </Link>
      </header>
      <section className="flex flex-col justify-center items-center gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-1/2"
            >
              <img
                src={`${apiURL}${post.imageUrl}`}
                alt={post.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <article className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {post.description}
                </p>
              </article>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No posts found. Click on the "Add Post" button to create your first
            post.
          </p>
        )}
      </section>
    </div>
  );
}
