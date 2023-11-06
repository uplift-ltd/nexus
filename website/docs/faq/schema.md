---
title: Fixing schema check
---

The schema check could fail if your python dependencies are out of date with the branch. Typically
you want to run:

    poetry install

And regenerate the schema:

    npm run gql-schema

However this could be annoying when switching branches a lot. You might want to check out a known
good version and push that up.

    git checkout main schema.json

    git commit -m "Revert schema changes" --no-verify

The `--no-verify` flag skips the husky pre-commit hook, which generates the schema based on your
locally installed dependencies. If the CI schema check passed you should be good to go.
