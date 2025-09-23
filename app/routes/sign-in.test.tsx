import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { authenticator, getUser } from "~/services/auth.server";

import SignInPage, { action, loader } from "./sign-in";

vi.mock("~/services/auth.server", async () => ({
  ...(await vi.importActual("~/services/auth.server")),
  getUser: vi.fn(),
  authenticator: {
    authenticate: vi.fn(),
  },
  createUserSession: vi.fn(() => Promise.resolve({ status: 302 })),
}));

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component", () => {
    test("renders sign in form", () => {
      const Stub = createRoutesStub([
        {
          path: "/sign-in",
          // @ts-ignore
          Component: SignInPage,
        },
      ]);

      render(<Stub initialEntries={["/sign-in"]} />);

      expect(screen.getByText("Sign In")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    test("displays error message when error prop is provided", async () => {
      const errorMessage = "Error message";

      const Stub = createRoutesStub([
        {
          path: "/sign-in",
          // @ts-ignore
          Component: () => <SignInPage actionData={{ error: errorMessage }} />,
        },
      ]);

      render(<Stub initialEntries={["/sign-in"]} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe("loader function", () => {
    test("redirects to '/' when user is already authenticated", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      vi.mocked(getUser).mockResolvedValue(mockUser);

      const result = await loader({ request: {} } as any);

      expect(result).toEqual(expect.objectContaining({ status: 302 }));
    });

    test("does not redirect when user is not authenticated", async () => {
      // @ts-ignore
      vi.mocked(getUser).mockResolvedValue(null);

      const result = await loader({ request: {} } as any);

      expect(result).toBeUndefined();
    });
  });

  describe("action function", () => {
    test("signs in user successfully", async () => {
      // @ts-ignore
      vi.mocked(authenticator.authenticate).mockResolvedValue({
        userData: {
          email: "test@example.com",
        },
        jwtToken: "test-token",
      });

      const result = await action({ request: {} } as any);

      expect(result).toEqual(expect.objectContaining({ status: 302 }));
    });

    test("returns error property", async () => {
      // @ts-ignore
      vi.mocked(authenticator.authenticate).mockRejectedValue(
        new Error("Invalid email"),
      );

      const result = await action({ request: {} } as any);

      expect(result).toHaveProperty("error");
    });
  });
});
