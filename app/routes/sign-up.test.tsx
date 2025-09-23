import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { userService } from "~/infrastructure/users/user-service";

import SignUpPage, { action } from "./sign-up";

// Mock the dependencies
vi.mock("~/infrastructure/users/user-service", () => ({
  userService: {
    create: vi.fn(),
  },
}));

vi.mock("~/services/auth.server", () => ({
  getUser: vi.fn(),
}));

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("Component", () => {
    test("renders sign up form", () => {
      const Stub = createRoutesStub([
        {
          path: "/sign-up",
          // @ts-ignore
          Component: SignUpPage,
        },
      ]);

      render(<Stub initialEntries={["/sign-up"]} />);

      expect(screen.getByText("Sign Up")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(screen.getByText("Create Account")).toBeInTheDocument();
    });

    test("displays error message when error prop is provided", async () => {
      const errorMessage = "Error message";

      const Stub = createRoutesStub([
        {
          path: "/sign-up",
          // @ts-ignore
          Component: () => <SignUpPage actionData={{ error: errorMessage }} />,
        },
      ]);

      render(<Stub initialEntries={["/sign-up"]} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe("action function", () => {
    test("creates user successfully and redirects to sign-in", async () => {
      // @ts-ignore
      vi.mocked(userService.create).mockResolvedValue(undefined);

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      const result = await action({
        request: {
          formData: () => formData,
        },
      } as any);

      expect(result).toEqual(
        expect.objectContaining({
          status: 302,
        }),
      );
    });

    test("returns validation error for invalid email", async () => {
      const formData = new FormData();
      formData.append("email", "invalid-email");
      formData.append("password", "password123");

      const result = await action({
        request: {
          formData: () => formData,
        },
      } as any);

      expect(result).toHaveProperty("error");
      expect(typeof (result as any).error).toBe("string");
      expect(userService.create).not.toHaveBeenCalled();
      expect((result as any).error).toBe(
        `✖ Invalid email address\n  → at email`,
      );
    });

    test("returns validation error for invalid password", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "A");

      const result = await action({
        request: {
          formData: () => formData,
        },
      } as any);

      expect(result).toHaveProperty("error");
      expect(typeof (result as any).error).toBe("string");
      expect(userService.create).not.toHaveBeenCalled();
      expect((result as any).error).toBe(
        `✖ Too small: expected string to have >=8 characters\n  → at password`,
      );
    });
  });
});
