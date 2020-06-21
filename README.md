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
