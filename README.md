# Skip CI Action
This action allows you to trigger different CI statuses based on the changed
files or commands in commit messages. It can be configured to either output the
status, or trigger the status itself.

## Inputs

### `excluded-paths`
A list of paths that should be excluded from CI.

- **Optional:** `true`
- **Default:** `[]`

### `stop-internally`
Whether or not the action should stop the workflow itself.

- **Optional:** `true`
- **Default:** `false`

## Example Usage

```yaml
name: Skip CI On Files
uses: luna/skip-ci-action@0.1
with:
    excluded-paths:
    - /doc/*
    - README.md
    stop-internally: true
```

