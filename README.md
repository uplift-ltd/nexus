# Nexus

> Uplift's frontend core library.

## Docs

View docs [nexus.uplift.sh](https://nexus.uplift.sh/).

## Setting Up GitHub Packages

Before installing, make sure to authenticate with GitHub Package Registry using a `.npmrc` file. See
"[Configuring npm for use with GitHub Package Registry](https://docs.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-to-github-packages)."

In short you have to [create a personal access token](https://github.com/settings/tokens/new) with
the `read:packages` permission.

Then add the following to your `~/.npmrc` file.

    //npm.pkg.github.com/:_authToken=GITHUB_TOKEN
    @uplift-ltd:registry=https://npm.pkg.github.com

## Setting up CI to install from other repo

1. Create a GitHub Personal Access Token with `read:packages` permission.
2. Add it as `NPM_TOKEN` secret.
3. Add the GitHub Packages registry to setup-node action:

```yml
uses: actions/setup-node@v1
with:
  node-version: "12.x"
  registry-url: "https://npm.pkg.github.com/"
  scope: "@uplift-ltd"
```

4. Add `NODE_AUTH_TOKEN` to the yarn install step.

```yml
name: Install dependencies
run: yarn install --non-interactive --frozen-lockfile
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Contributing

### Semantic Versioning

We use [conventional commits](https://www.conventionalcommits.org/) to manage version updates. The
title of your PR needs to have a valid prefix.

Note that changing the PR title won't re-run the job so you have to re-run the workflow jobs
yourself.

Quick reference:

    fix: Correct typo.
    feat: Add support for Node 12.
    feat(apollo): Add useEnhancedQuery hook.
    refactor!: Drop support for Node 6.
    feat!: Breaking change feature.

Note that since PR titles only have a single line, you have to use the ! syntax for breaking
changes.

### What are the files in each package?

```
babel.config.js   <== extends root babelrc, needed for jest
jest.config.js    <== extends root jest.config.js, needed for jest to find config
package.json
README.md         <== package readme, should match in `website/docs`
tsconfig.json     <== if the package supports typescript it needs to configure include
```

### Publishing a new version

[Run the publish workflow](https://github.com/uplift-ltd/nexus/actions?query=workflow%3Apublish).

### Adding a new package

See the documentation for `create-nexus-package`. To summarize:

Create a new folder and `cd` to it.

    mkdir packages/my-package && cd packages/my-package

Initialize a new package using the @uplit-ltd/create-nexus-package initializer.

    npm init @uplift-ltd/nexus-package

## Working with local packages

There's some weirdness with `yarn link`. The most reliable way seems to be to use `npm link`. Also
if the package depends on `react` you may have to alias that to the app `react` to avoid duplicate
react versions (and hooks failing).

    cd packages/formik
    npm link
    cd ../..
    npm link ../../../myapp/node_modules/react
    cd myapp
    npm link @uplift-ltd/formik

Additionally you may need to alias `@apollo/client` _and_ its own `react` version to the app.

    cd packages/apollo
    npm link
    cd ../..
    npm link ../myapp/node_modules/react
    npm link ../myapp/node_modules/@apollo/client
    cd node_modules/@apollo/client
    npm link ../../../myapp/node_modules/react

Don't forget to run `yarn build` after every change.

You might have to wipe `node_modules/.cache` in your app if you ran into duplicate react issue.

See [react docs](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react) for
more details.

## Sponsor

This project proudly sponsored by [🚀 Uplift.ltd](https://www.uplift.ltd).
