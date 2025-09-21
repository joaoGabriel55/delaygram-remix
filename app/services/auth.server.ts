import { createCookieSessionStorage, redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { HttpClient } from "~/infrastructure/lib/http-client";

interface SignInResponse {
  jwtToken: string;
  userData: {
    email: string;
  };
  tokenType: "Bearer";
  expiresAt: number;
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.COOKIE_SECRET!], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production",
  },
});

export const authenticator = new Authenticator<SignInResponse>();

export const { commitSession, destroySession } = sessionStorage;

const getSession = async (request: Request) => {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
};

export async function getUser(
  request: Request,
): Promise<SignInResponse["userData"] | undefined> {
  const session = await getSession(request);

  return session.get("user");
}

export async function getUserToken(
  request: Request,
): Promise<string | undefined> {
  const session = await getSession(request);

  return session.get("token");
}

export async function logout(request: Request) {
  console.log("logout");

  const session = await getSession(request);

  const token = await getUserToken(request);

  const httpClient = HttpClient();

  try {
    await httpClient.post<void>(
      "/api/sign-out",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.error("Error logging out:", error);
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function createUserSession({
  request,
  user,
  token,
  remember = true,
  redirectUrl,
}: {
  request: Request;
  user: SignInResponse["userData"];
  token: string;
  remember: boolean;
  redirectUrl?: string;
}) {
  const session = await getSession(request);

  session.set("user", user);
  session.set("token", token);

  return redirect(redirectUrl || "/", {
    headers: {
      "Set-Cookie": await commitSession(session, {
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

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const httpClient = HttpClient();
  const response = await httpClient.post<SignInResponse>("/api/sign-in", {
    email,
    password,
  });

  return response.data;
});

authenticator.use(formStrategy, "user-pass");
