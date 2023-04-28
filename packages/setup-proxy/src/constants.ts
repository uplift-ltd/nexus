import { GRAPHQL_HOST } from "@uplift-ltd/constants";

export const DEFAULT_TARGET = GRAPHQL_HOST || "http://127.0.0.1:8000";

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
