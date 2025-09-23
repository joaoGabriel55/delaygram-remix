import { Link } from "react-router";
import { Form } from "react-router";
import { ErrorMessage } from "../ui/error-message";

export function SignIn({ error }: { error?: string }) {
  return (
    <main className="flex flex-col items-center justify-center gap-10 pt-16 pb-4">
      <header>
        <h1 className="text-2xl font-bold">Sign In</h1>
      </header>
      <Form method="post" className="flex flex-col gap-8">
        <input
          className="border-slate-500 border p-2 rounded-sm w-2xs"
          name="email"
          type="text"
          placeholder="Email"
          required
        />
        <input
          className="border-slate-500 border p-2 rounded-sm w-2xs"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button className="bg-blue-400 p-2 rounded-sm w-2xs" type="submit">
          Confirm
        </button>
        {error ? <ErrorMessage message={error} /> : null}
      </Form>
      <Link to="/sign-up">Sign Up</Link>
    </main>
  );
}
