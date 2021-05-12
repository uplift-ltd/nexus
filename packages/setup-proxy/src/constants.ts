export const DEFAULT_TARGET = "http://localhost:5000";

export const LOGOUT_URL =
  process.env.NEXT_PUBLIC_LOGOUT_URL || process.env.REACT_APP_LOGOUT_URL || "/logout";

export const DEFAULT_PROXY_PATHS = [
  "/admin/",
  "/static/admin",
  "/static/graphene_django",
  "/graphql/",
  "/auth/graphql/",
  "/batch/graphql/",
  "/batch/auth/graphql/",
  "/upload/s3/",
  LOGOUT_URL,
];
