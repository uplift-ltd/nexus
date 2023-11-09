export interface CurrentUser {
  email?: string;
  id: string;
}

export interface CurrentUserQuery {
  currentUser: CurrentUser | null;
}

export interface CurrentUserQueryOptions {
  query: CurrentUserQuery;
}
