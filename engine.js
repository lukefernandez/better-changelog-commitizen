"format cjs";

var wrap = require("word-wrap");
var map = require("lodash.map");
var longest = require("longest");
var chalk = require("chalk");

var filter = function(array) {
  return array.filter(function(x) {
    return x;
  });
};

var headerLength = function(answers) {
  return (
    answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0)
  );
};

var maxSummaryLength = function(options, answers) {
  return options.maxHeaderWidth - headerLength(answers);
};

var filterSubject = function(subject) {
  subject = subject.trim();
  if (subject.charAt(0).toLowerCase() !== subject.charAt(0)) {
    subject =
      subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);
  }
  while (subject.endsWith(".")) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};

module.exports = function(options) {
  var types = options.types;

  var length = longest(Object.keys(types)).length + 1;
  var choices = map(types, function(type, key) {
    return {
      name: (key + ":").padEnd(length) + " " + type.description,
      value: key,
    };
  });

  return {
    prompter: function(cz, commit) {
      cz.prompt([
        {
          type: "list",
          name: "type",
          message: "What type of change are you making?",
          choices: choices,
          default: options.defaultType,
        },
        {
          type: "input",
          name: "scope",
          message:
            "What is the scope of this change (e.g. component or file name)? (press enter to skip)",
          default: options.defaultScope,
          filter: function(value) {
            return options.disableScopeLowerCase
              ? value.trim()
              : value.trim().toLowerCase();
          },
        },
        {
          type: "input",
          name: "subject",
          message: function(answers) {
            return (
              "Write a short, imperative tense description of the change (max " +
              maxSummaryLength(options, answers) +
              " chars):\n"
            );
          },
          default: options.defaultSubject,
          validate: function(subject, answers) {
            var filteredSubject = filterSubject(subject);
            return filteredSubject.length == 0
              ? "A subject is required"
              : filteredSubject.length <= maxSummaryLength(options, answers)
              ? true
              : "The subject length must be less than or equal to " +
                maxSummaryLength(options, answers) +
                " characters. The current length is " +
                filteredSubject.length +
                " characters.";
          },
          transformer: function(subject, answers) {
            var filteredSubject = filterSubject(subject);
            var color =
              filteredSubject.length <= maxSummaryLength(options, answers)
                ? chalk.green
                : chalk.red;
            return color("(" + filteredSubject.length + ") " + subject);
          },
          filter: function(subject) {
            return filterSubject(subject);
          },
        },
        {
          type: "input",
          name: "body",
          message:
            "Provide a longer description of the change: (press enter to skip)\n",
          default: options.defaultBody,
        },
        {
          type: "confirm",
          name: "isBreaking",
          message: "Are there any breaking changes?",
          default: false,
        },
        {
          type: "input",
          name: "breakingBody",
          default: "-",
          message:
            "A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit:\n",
          when: function(answers) {
            return answers.isBreaking && !answers.body;
          },
          validate: function(breakingBody, answers) {
            return (
              breakingBody.trim().length > 0 ||
              "A body is required for a BREAKING CHANGE commit"
            );
          },
        },
        {
          type: "input",
          name: "breaking",
          message: "Describe the breaking changes:\n",
          when: function(answers) {
            return answers.isBreaking;
          },
        },

        {
          type: "confirm",
          name: "isIssueAffected",
          message: "Does this change affect any open issues?",
          default: options.defaultIssues ? true : false,
        },
        {
          type: "input",
          name: "issuesBody",
          default: "-",
          message:
            "If issues are affected, the commit requires a body. Please enter a longer description of the commit:\n",
          when: function(answers) {
            return (
              answers.isIssueAffected && !answers.body && !answers.breakingBody
            );
          },
        },
        {
          type: "input",
          name: "issues",
          message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
          when: function(answers) {
            return answers.isIssueAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined,
        },
      ]).then(function(answers) {
        var wrapOptions = {
          trim: true,
          cut: false,
          newline: "\n",
          indent: "",
          width: options.maxLineWidth,
        };

        var scope = answers.scope ? "(" + answers.scope + ")" : "";
        var head = answers.type + scope + ": " + answers.subject;
        var body = answers.body ? wrap(answers.body, wrapOptions) : false;
        var breaking = answers.breaking ? answers.breaking.trim() : "";
        breaking = breaking
          ? "BREAKING CHANGE: " + breaking.replace(/^BREAKING CHANGE: /, "")
          : "";
        breaking = breaking ? wrap(breaking, wrapOptions) : false;

        var issues = answers.issues ? wrap(answers.issues, wrapOptions) : false;

        commit(filter([head, body, breaking, issues]).join("\n\n"));
      });
    },
  };
};
