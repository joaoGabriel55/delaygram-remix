import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import AddPostPage, { loader, action } from "./add-post";
import { getUserToken } from "~/services/auth.server";

vi.mock("~/infrastructure/posts/post-service", async () => ({
  postService: {
    create: vi.fn(),
  },
}));

vi.mock("~/services/auth.server", async () => ({
  ...(await vi.importActual("~/services/auth.server")),
  getUserToken: vi.fn(),
}));

describe("AddPostPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const posts = [
    {
      id: 1,
      title: "Post Title",
      description: "Post Content",
      createdAt: new Date().toISOString(),
      imageUrl: "/image.jpg",
      userId: "",
      updatedAt: "",
    },
  ];

  describe("Component", () => {
    test("renders AddPostPage", () => {
      const Stub = createRoutesStub([
        {
          path: "/add-post",
          // @ts-ignore
          Component: () => <AddPostPage loaderData={{ error: null }} />,
        },
      ]);

      render(<Stub initialEntries={["/add-post"]} />);

      expect(screen.getByText("Add Post")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();

      expect(screen.getByPlaceholderText("Upload Image")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    describe("when error is not null", () => {
      test("renders error message", () => {
        const error = "Error message";

        const Stub = createRoutesStub([
          {
            path: "/add-post",
            // @ts-ignore
            Component: () => <AddPostPage actionData={{ error }} />,
          },
        ]);

        render(<Stub initialEntries={["/add-post"]} />);

        expect(screen.getByText(error)).toBeInTheDocument();
      });
    });
  });

  describe("loader function", () => {
    test("redirects to '/sign-in' when user token is null", async () => {
      // @ts-ignore
      vi.mocked(getUserToken).mockResolvedValue(null);

      const result = await loader({ request: {} } as any);

      expect(result).toEqual(expect.objectContaining({ status: 302 }));
    });

    test("does not redirect when user is not authenticated", async () => {
      // @ts-ignore
      vi.mocked(getUserToken).mockResolvedValue('token');

      const result = await loader({ request: {} } as any);

      expect(result).toBeUndefined();
    });
  });
});
