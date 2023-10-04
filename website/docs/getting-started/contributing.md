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

[Run the publish workflow](https://github.com/uplift-ltd/nexus/actions/workflows/publish.yml).

Select the branch you want to publish from and enter `latest` or `prerelease` as the `distTag`.

For production release use `master` branch and `latest`.

For prereleases use any branch and the `prerelease` dist tag.

The versioning is based on conventional commit history (see the Contributing section).

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

Don't forget to run `npm run build` after every change.

You might have to wipe `node_modules/.cache` in your app if you ran into duplicate react issue.

See [react docs](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react) for
more details.
