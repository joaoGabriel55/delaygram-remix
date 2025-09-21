import { Form, Link, Outlet, redirect, useLoaderData } from "react-router";
import { getUser } from "~/services/auth.server";
import type { Route } from "../+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const user = await getUser(request);

  if (!user) {
    throw redirect("/sign-in");
  } else {
    return { userEmail: user.email };
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
      {data?.userEmail ? (
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
