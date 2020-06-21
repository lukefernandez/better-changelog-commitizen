# better-changelog-commitizen

A commitizen adapter for the opinionated better-changelog standard.

Heavily influenced by [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog).

## Configuration

You can configure the better-changelog-commitizen adapter through the `~/.czrc` file or the `config.commitizen` key in your `package.json` file.

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/better-changelog-commitizen",
      "defaultType": "",
      "defaultScope": "",
      "defaultSubject": "",
      "defaultBody": "",
      "defaultIssues": ""
    }
  }
}
```

## Commit Types

```json
{
  "feat": "New feature addition",
  "fix": "Bug fix",
  "refactor": "Code change that does not change the behavior of the code",
  "form": "Formatting change (e.g. comma removal, spacing change)",
  "docs": "Documentation change",
  "test": "Testing change",
  "perf": "Performance improvement",
  "security": "Security patch",
  "ci/cd": "CI/CD configuration change",
  "depend": "Dependency change",
  "revert": "Reversion to a previous commit",
  "feat-removal": "Feature removal"
}
```
