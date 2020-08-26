# Nexus

> Uplift's frontend core library.

## Docs

View docs [nexus.uplift.sh](https://nexus.uplift.sh/).

## Setting Up GitHub Packages

Before installing, make sure to authenticate with GitHub Package Registry or using a `.npmrc` file.
See
"[Configuring npm for use with GitHub Package Registry](https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry#authenticating-to-github-package-registry)."

In short you have to
[create a personal access token](https://docs.github.com/en/packages/publishing-and-managing-packages/about-github-packages#about-tokens)
with the following permissions:

- `read:packages`
- `write:packages`
- `delete:packages`
- `repo`

Then add the following to your `~/.npmrc` file.

    //npm.pkg.github.com/:_authToken=GITHUB_TOKEN
    @uplift-ltd:registry=https://npm.pkg.github.com

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

    yarn lerna version major|minor|patch

To select the bumps for each package:

    yarn lerna version

That will create new versions as needed and push the tags to GitHub.

Go to [create a new release on GitHub](https://github.com/uplift-ltd/nexus/releases/new).

Select the tag created by lerna.

Enter a title (usually same as the tag name).

Create the release. Go to the [Actions tab](https://github.com/uplift-ltd/nexus/actions) to check
progress.

**Note:** If you publish multiple packages you should wait until the first one finishes publishing
as it will publish all the changed packages. After the first one is done you can create GitHub
releases for the other packages (or not, I'm not your mom).

### Adding a new package

See the documentation for `create-nexus-package`. To summarize:

Create a new folder and `cd` to it.

    mkdir packages/my-package && cd packages/my-package

Initialize a new package using the @uplit-ltd/create-nexus-package initializer.

    npm init @uplift-ltd/nexus-package

## Sponsor

This project proudly sponsored by [🚀 Uplift.ltd](https://www.uplift.ltd).
