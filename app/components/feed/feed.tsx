import { Link } from "react-router";

export function Feed() {
  return (
    <div className="flex flex-col gap-16 min-h-0 w-1/2 mx-auto">
      <header className="flex gap-9 justify-between">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Feed
        </h1>
        <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" to="add-post">
          Add Post
        </Link>
      </header>
    </div>
  );
}
