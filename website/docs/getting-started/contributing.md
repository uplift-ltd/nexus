---
title: Contributing
---

## What are the files in each package?

```
babel.config.js   <== extends root babelrc, needed for jest
jest.config.js    <== extends root jest.config.js, needed for jest to find config
package.json
README.md         <== package readme, should match in `website/docs`
tsconfig.json     <== if the package supports typescript it needs to configure include
```

## Publishing a new version

We use [lerna](https://github.com/lerna/lerna) to manage packages.

You can either install lerna globally or run commands through yarn.

    yarn lerna version major|minor|patch

That will create new versions as needed and push the tags to GitHub.

Next, create a GitHub release:

1. Go to [tags](https://github.com/uplift-ltd/nexus/tags) in GitHub and find one for your release.
2. Click on the triple dots on the right and select `Create Release`.
3. Enter a description of what changed.
4. Press `Publish Release`

Go to the [Actions tab](https://github.com/uplift-ltd/nexus/actions) to check progress.

**Note:** If you publish multiple packages you should wait until the first one finishes publishing
as it will publish all the changed packages. After the first one is done you can create GitHub
releases for the other packages (or not, I'm not your mom).

## Adding a new package

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

    npm link ../../../myapp/node_modules/react

    cd myapp

    npm link @uplift-ltd/formik

Don't forget to run `yarn build` after every change.

You might have to wipe `node_modules/.cache` in your app if you ran into duplicate react issue.

See [react docs](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react) for
more details.
