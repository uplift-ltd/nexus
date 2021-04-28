---
title: Fixing audit
---

### Fixing audit error and warnings

Yarn audit will tell you where the dependency is coming from. For example it could look something
like this:

    react-scripts -> react-dev-utils -> handlebars

The easiest would be to upgrade the top level dependency to the latest:

    yarn upgrade --latest react-scripts

If upgrading to latest isn't an option, you can try updating to a newer compatible version. First
see what you can upgrade to by running:

    yarn outdated

Look for the Wanted or Latest version of `react-scripts` and update it in `package.json`.

    yarn install

Try yarn audit. Did that fix it? If that didn't work, try:

    yarn upgrade react-scripts

Try yarn audit. Did that fix it? If not, chances are we will have to use yarn resolutions. In
`package.json` look for the `resolutions` field or create one if it doesn't exist:

```json
{
  "resolutions": {
    "react-scripts/react-dev-utils/handlebars": "^1.33.7"
  }
}
```

Finally run `yarn install` one last time to update the lockfile.

Alternatively you can update a single, specific sub dependency by removing it from `yarn.lock` and
running yarn install again. This should only be done when upgrading the top level dependency would
break a bunch of things (typically for react-scripts).
