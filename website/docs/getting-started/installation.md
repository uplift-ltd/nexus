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
