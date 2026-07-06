# @uplift-ltd/sammy

## Installation

```sh
npm i --save @uplift-ltd/sammy
```

## Getting Started

### Prerequisites

Install [doctl](https://github.com/digitalocean/doctl#installing-doctl)

MacOS:

```sh
brew install doctl
```

Ubuntu:

```sh
sudo snap install doctl
```

### Authenticating with DigitalOcean

[Generate an API](https://cloud.digitalocean.com/account/api/tokens) token for the team you want to
use.

```sh
doctl auth init --context uplift
```

You can log into multiple teams.

```sh
doctl auth init --context runbook
```

And switch between them:

```sh
doctl auth switch --context uplift
```

### Configuring

In your project's `package.json`, set the context and app IDs.

```json
{
  "sammy": {
    "context": "runbook",
    "apps": {
      "production": "DO APP ID",
      "staging": "ANOTHER DO APP ID"
    }
  }
}
```

### Formatting the appspec (optional)

After `appspec:get` downloads the YAML, sammy formats it in place. By default it auto-detects a
YAML-capable formatter (prettier or dprint) from your project's config files, walking up to the repo
root — so monorepos work without setup.

To use a specific command, set `format`. `{file}` is replaced with the appspec filename; if you omit
it, the command runs unchanged:

```json
{
  "sammy": {
    "format": "prettier --write {file}"
  }
}
```

If no YAML-capable formatter is found (e.g. a biome- or oxide-only project, since those can't format
YAML), sammy logs a notice and writes the file unformatted — `appspec:get` still succeeds. Set
`format` to override detection.

> Note: yarn Plug'n'Play is not supported for auto-detection; set an explicit `format` command (e.g.
> `yarn exec prettier --write {file}`) in a PnP project.

### File Structure

The CLI will create `appspec.${env}.yml` files. For examples:

```
appspec.production.yml
appspec.staging.yml
```

## API

### sammy appspec:get

Download and write the appspec yaml file for the specified environment.

```sh
sammy appspec:get --env production
```

### sammy appspec:update

Upload the appspec yaml file for the specified environment to DigitalOcean.

```sh
sammy appspec:update --env production
```

### sammy create-deployment

Trigger a new deployment.

```sh
sammy create-deployment --env production
```
