/**
 *  GENERATE CHANGELOG DATA TO A JSON FILE.
 */

const { argv } = require("yargs");
const fs = require("fs");
const path = require("path");
const { gitLogSync } = require("git-log-as-object");
const { version } = require("./package.json");
const commitTypes = require("./commitTypes");
const releaseAsVersion = argv.asVersion;

const getTitleDate = (commitTime) => {
  const date = commitTime ? new Date(commitTime) : new Date();
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};

const parseCommitSubject = (subject) => {
  const typePattern = commitTypes.join("|");
  const typeRegex = new RegExp(`^(${typePattern})`);
  const parse = subject.split(/:(.+)/).filter((str) => str);

  // Commits which follow conventional commit
  if (parse.length === 2) {
    const type = (parse[0].match(typeRegex) || [])[0] || null;
    const scope = (parse[0].match(/\((.+)\)/) || [])[1] || null;
    const scopeText = scope
      ? scope
          .split("-")
          .map((text) => {
            if (text === "avb" || text === "ui") {
              return text.toUpperCase();
            }
            return text[0].toUpperCase() + text.slice(1);
          })
          .join(" ")
          .split(",")
          .map((text) => {
            if (text === "AVB UI") {
              return text.split(" ").join("-");
            }
            return text[0].toUpperCase() + text.slice(1);
          })
          .join(",")
      : null;
    const breakingChange = parse[0].endsWith("!");
    const description = parse[1]
      .trim()
      .split(/\(#\d+\)/)[0] // Remove the issue number reference for squash commits
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .trim();

    return {
      type,
      scope,
      scopeText,
      breakingChange,
      description,
    };
  }

  // Tag commits do not have a conventional commit prefix
  return {
    type: null,
    scope: null,
    scopeText: null,
    description: parse[0].trim(),
    breakingChange: false,
  };
};

let curTag = releaseAsVersion ? `v${version}` : "unreleased";

const log = gitLogSync({
  startRef: "e7b9bdca12f77a3bbb39cf05c071b3b235c4c6e9",
  dir: "./",
}).map((entry) => {
  const { subject, body } = entry;
  const subjectSanitize = subject.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const bodySanitize = body.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return {
    ...entry,
    ...parseCommitSubject(subjectSanitize),
    subject: subjectSanitize,
    body: bodySanitize,
  };
});

const logTree = {
  unreleased: {
    title: "Unreleased",
    date: null,
    commits: [],
  },
  [`${version}`]: {
    title: `${version}`,
    date: getTitleDate(),
    commits: [],
  },
};

log.forEach((entry) => {
  const { tags, commitTime } = entry;
  if (tags.length > 0) {
    curTag = tags[0];
    console.log(curTag, "curTag");

    logTree[curTag] = {
      title: curTag,
      date: getTitleDate(commitTime),
      commits: [],
    };
  } else {
    logTree[curTag].commits.push(entry);
  }
});

fs.writeFileSync(
  path.resolve(__dirname, "./", "changelog.json"),
  JSON.stringify(logTree, null, 2),
  "utf-8"
);
