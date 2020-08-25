# Nexus

> Uplift's frontend core library.

## Docs

View docs [nexus.uplift.sh](https://nexus.uplift.sh/).

## Contributing

### What are the files in each package?

```
babel.config.js   <== extends root babelrc, needed for jest
jest.config.js    <== extends root jest.config.js, needed for jest to find config
package.json
README.md         <== package readme, should match in `website/docs`
tsconfig.json     <== if the package supports typescript it needs to configure include
```

### Publishing a new version

We use [lerna](https://github.com/lerna/lerna) to manage packages.

You can either install lerna globally or run commands through yarn.

    yarn run lerna version major|minor|patch

That will create new version as needed and push the tags to GitHub.

Go to [create a new release on GitHub](https://github.com/uplift-ltd/uplift-nexus/releases/new).

Select the tag created by lerna.

Enter a title (usually same as the tag name).

Create the release. Go to the [Actions tab](https://github.com/uplift-ltd/uplift-nexus/actions) to
check progress.

**Note:** If you publish multiple packages you should wait until the first one finishes publishing
as it will publish all the changed packages. After the first one is done you can create GitHub
releases for the other packages (or not, I'm not your mom).

## Sponsor

This project proudly sponsored by [🚀 Uplift.ltd](https://www.uplift.ltd).
