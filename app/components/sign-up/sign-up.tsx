import { Form } from "react-router";

export function SignUp({ error }: { error?: string }) {
  return (
    <main className="flex flex-col items-center justify-center gap-10 pt-16 pb-4">
      <header>
        <h1 className="text-2xl font-bold">Sign Up</h1>
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
          Create Account
        </button>
        {error ? (
          <div className="flex flex-row bg-red-400 w-2xs p-2 rounded-sm">
            <p>{error}</p>
          </div>
        ) : null}
      </Form>
    </main>
  );
}
