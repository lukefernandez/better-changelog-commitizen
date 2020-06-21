"format cjs";

const engine = require("./engine");

const configLoader = require("commitizen").configLoader;
const config = configLoader.load() || {};

const commitTypes = require("./commit-types.json");

const options = {
  types: commitTypes,
  defaultType: config.defaultType,
  defaultScope: config.defaultScope,
  defaultSubject: config.defaultSubject,
  defaultBody: config.defaultBody,
  defaultIssues: config.defaultIssues,
  disableScopeLowerCase: false,
  maxHeaderWidth: 100,
  maxLineWidth: 100,
};

module.exports = engine(options);
