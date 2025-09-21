import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("sign-up", "routes/sign-up.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("logout", "routes/logout.tsx"),

  layout("components/logged-wrapper.tsx", [
    index("routes/feed.tsx"),
    route("add-post", "routes/add-post.tsx"),
  ]),
] satisfies RouteConfig;
