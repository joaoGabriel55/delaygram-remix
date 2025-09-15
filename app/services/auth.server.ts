import { Authenticator } from "remix-auth";
import { createCookieSessionStorage, redirect } from "react-router";
import { FormStrategy } from "remix-auth-form";

type User = {
  id: string;
  email: string;
  name: string;
};

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3t"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production",
  },
});

export const authenticator = new Authenticator<User>();

export const { commitSession, destroySession } = sessionStorage;

// Your authentication logic (replace with your actual DB/API calls)
async function login(email: string, password: string): Promise<User> {
  // Verify credentials
  // Return user data or throw an error

  if (email !== "aaron@mail.com" || password !== "password") {
    throw new Error("Invalid email or password");
  }

  const user = Promise.resolve({
    id: "1",
    email,
    name: "John Doe",
  });

  return user;
}

const getUserSession = async (request: Request) => {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
};

export async function logout(request: Request) {
  console.log("logout");
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getUser(request: Request): Promise<User | undefined> {
  const session = await getUserSession(request);

  return session.get("user");
}

export async function createUserSession({
  request,
  user,
  remember = true,
  redirectUrl,
}: {
  request: Request;
  user: User;
  remember: boolean;
  redirectUrl?: string;
}) {
  const session = await getUserSession(request);

  session.set("user", user);

  return redirect(redirectUrl || "/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await login(email, password);

    return user;
  }),
  // each strategy has a name and can be changed to use the same strategy
  // multiple times, especially useful for the OAuth2 strategy.
  "user-pass",
);
