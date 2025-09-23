import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import FeedPage, { loader } from "./feed";
import { postService } from "~/infrastructure/posts/post-service";

vi.mock("~/infrastructure/posts/post-service", async () => ({
  postService: {
    findAll: vi.fn(),
  },
}));

describe("FeedPage", () => {
  beforeEach(() => {
    process.env.API_URL = "http://localhost:3000/api";
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
    test("renders FeedPage", () => {
      const Stub = createRoutesStub([
        {
          path: "/feed",
          Component: () => (
            // @ts-ignore
            <FeedPage
              loaderData={{
                posts,
                apiURL: "http://localhost:3000/api",
              }}
            />
          ),
        },
      ]);

      render(<Stub initialEntries={["/feed"]} />);

      expect(screen.getByText("Feed")).toBeInTheDocument();
      expect(screen.getByText("Add Post")).toBeInTheDocument();

      expect(screen.getByText("Post Title")).toBeInTheDocument();
      expect(screen.getByText("Post Content")).toBeInTheDocument();
    });

    describe("when posts are empty", () => {
      test("renders empty state", () => {
        const Stub = createRoutesStub([
          {
            path: "/feed",
            Component: () => (
              // @ts-ignore
              <FeedPage
                loaderData={{
                  posts: [],
                  apiURL: "http://localhost:3000/api",
                }}
              />
            ),
          },
        ]);

        render(<Stub initialEntries={["/feed"]} />);

        expect(
          screen.getByText(
            'No posts found. Click on the "Add Post" button to create your first post.',
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe("loader function", () => {
    test("returns posts and apiURL", async () => {
      vi.mocked(postService.findAll).mockResolvedValue(posts);

      const result = await loader();

      expect(result).toStrictEqual({
        posts,
        apiURL: process.env.API_URL,
      });
    });

    describe("when findAll throws error", () => {
      test("returns empty posts and apiURL", async () => {
        vi.mocked(postService.findAll).mockRejectedValue(
          new Error("Mocked error"),
        );

        const result = await loader();

        expect(result).toStrictEqual({
          posts: [],
          apiURL: process.env.API_URL,
        });
      });
    });
  });
});
