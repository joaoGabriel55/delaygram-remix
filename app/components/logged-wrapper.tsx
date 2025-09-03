import { Form, Link, Outlet, redirect, useLoaderData } from "react-router";
import { getUserId } from "~/services/session.server";
import type { Route } from "../+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect("/sign-in");
  } else {
    return { userId };
  }
}

export default function LoggedWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col justify-center p-4">
      {data?.userId ? (
        <Form className="self-end" action="/logout" method="post">
          <button
            type="submit"
            className="border border-gray-300 p-2 rounded-sm"
          >
            Logout
          </button>
        </Form>
      ) : (
        <Link
          className="self-end border border-gray-300 p-2 rounded-sm"
          to="/sign-in"
        >
          Sign In
        </Link>
      )}
      {children}
      <Outlet />
    </main>
  );
}
