import path from "path";
import ts from "typescript";

// Jest strips types through babel, so these cases run the real compiler
// against src/urls.ts to catch regressions in the token parsing types.
const PACKAGE_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.join(PACKAGE_DIR, "src");

const HEADER = `
import { makeUrl, type UrlTokens } from "./urls.js";
type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Expect<T extends true> = T;
`;

const TOKEN_CASES = [
  ["/:orgId/:userId", `"orgId" | "userId"`],
  ["/:orgId/:userId/", `"orgId" | "userId"`],
  ["/:course/:lesson/:topicSlug", `"course" | "lesson" | "topicSlug"`],
  ["/:course/:lesson/:topicSlug/", `"course" | "lesson" | "topicSlug"`],
  ["/learn/:course/:lesson/:topicSlug/", `"course" | "lesson" | "topicSlug"`],
  ["/courses/:course/lessons/:lesson/topics/:topicSlug/", `"course" | "lesson" | "topicSlug"`],
  ["/[course]/[lesson]/[topicSlug]/", `"course" | "lesson" | "topicSlug"`],
  ["/blog/[...slug]", `"...slug"`],
  ["https://example.com/:orgId/:userId", `"orgId" | "userId"`],
  ["http://localhost:8000/users/:userId/", `"userId"`],
  ["/users/", "never"],
] as const;

const MAKE_URL_SOURCE = `
const LESSON_URL = "/:course/:lesson/:topicSlug/";
makeUrl(LESSON_URL, { course: "skin", lesson: 2, topicSlug: "intro" });
// @ts-expect-error every token is still required
makeUrl(LESSON_URL, { lesson: 2, topicSlug: "intro" });
`;

const virtualFiles = new Map<string, string>([
  ...TOKEN_CASES.map(
    ([url, expected], index) =>
      [
        path.join(SRC_DIR, `__urlTokensCase${index}.ts`),
        `${HEADER}export type Case = Expect<Equal<UrlTokens<"${url}">, ${expected}>>;\n`,
      ] as const
  ),
  [path.join(SRC_DIR, "__urlTokensMakeUrl.ts"), `${HEADER}${MAKE_URL_SOURCE}`],
]);

let program: ts.Program;

beforeAll(() => {
  const config = ts.getParsedCommandLineOfConfigFile(
    path.join(PACKAGE_DIR, "tsconfig.json"),
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
      },
    }
  );
  if (!config) throw new Error("Unable to read tsconfig.json");

  const options = { ...config.options, noEmit: true, noUnusedLocals: false };
  const host = ts.createCompilerHost(options);
  const { fileExists, getSourceFile, readFile } = host;

  host.fileExists = (fileName) => virtualFiles.has(fileName) || fileExists(fileName);
  host.readFile = (fileName) => virtualFiles.get(fileName) ?? readFile(fileName);
  host.getSourceFile = (fileName, languageVersion, ...rest) => {
    const source = virtualFiles.get(fileName);
    return source === undefined
      ? getSourceFile(fileName, languageVersion, ...rest)
      : ts.createSourceFile(fileName, source, languageVersion);
  };

  program = ts.createProgram([...virtualFiles.keys()], options, host);
}, 60000);

function getErrors(fileName: string) {
  const sourceFile = program.getSourceFile(fileName);
  return ts
    .getPreEmitDiagnostics(program, sourceFile)
    .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
}

test.each(TOKEN_CASES.map(([url, expected], index) => [url, expected, index] as const))(
  "UrlTokens<%s> is %s",
  (_url, _expected, index) => {
    expect(getErrors(path.join(SRC_DIR, `__urlTokensCase${index}.ts`))).toEqual([]);
  }
);

test("makeUrl requires every token of a url with consecutive tokens and a trailing slash", () => {
  expect(getErrors(path.join(SRC_DIR, "__urlTokensMakeUrl.ts"))).toEqual([]);
});
