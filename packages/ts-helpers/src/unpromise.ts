// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
