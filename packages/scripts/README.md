# @uplift-ltd/scripts

## Installation

    yarn add -D @uplift-ltd/scripts

Add this to package.json scripts:

```json
{
  "scripts": {
    "src-clean": "src-clean",
    "gql-clean": "gql-clean",
    "global-types-clean": "global-types-clean",
    "cache-clear": "cache-clear",
    "cache-clear-eslint": "cache-clear-eslint",
    "cache-clear-npm": "cache-clear-npm",
    "cache-clear-rn": "cache-clear-rn",
    "cache-clear-expo": "cache-clear-expo"
  }
}
```

Or run these through npx:

    npx -p @uplift-ltd/scripts cache-clear

## API

### src-clean

Remove any gitignored files from the `src` folder. Throws an error if there are any modified files
tracked by git.

```json
{
  "scripts": {
    "src-clean": "src-clean"
  }
}
```

### gql-clean

Remove all `__generated__` folders/files.

```json
{
  "scripts": {
    "gql-clean": "gql-clean"
  }
}
```

### global-types-clean

Removes the `globalTypes.ts` file if it's empty (TypeScript will fail with `isolatedModules: true`
setting).

```json
{
  "scripts": {
    "global-types-clean": "global-types-clean"
  }
}
```

### cache-clear

Clears all the common caches.

```json
{
  "scripts": {
    "cache-clear": "cache-clear"
  }
}
```

### cache-clear-eslint

Clears the (standalone) eslint cache file (`.eslintcache`).

```json
{
  "scripts": {
    "cache-clear-eslint": "cache-clear-eslint"
  }
}
```

### cache-clear-npm

Removes the `node_modules/.cache` folder.

```json
{
  "scripts": {
    "cache-clear-npm": "cache-clear-npm"
  }
}
```

### cache-clear-rn

Clears the react-native watchman cache.

```json
{
  "scripts": {
    "cache-clear-rn": "cache-clear-rn"
  }
}
```

### cache-clear-expo

Clears the expo cache.

```json
{
  "scripts": {
    "cache-clear-expo": "cache-clear-expo"
  }
}
```
