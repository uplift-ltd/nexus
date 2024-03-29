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
