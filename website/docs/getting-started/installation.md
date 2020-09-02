---
title: Installation
---

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

## Setting up CI to install from other repo

1. Create a GitHub Personal Access Token with `read:packages` permission.
2. Add it as `NPM_TOKEN` secret.
3. Add the GitHub Packages repository to setup-node action:

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
