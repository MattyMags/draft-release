const fs = require("fs-extra");
const path = require("path");
const getCommitsByType = require("./getCommitsByType");
const changelogJson = require("./changelog.json");
var argv = require("yargs/yargs")(process.argv.slice(2)).argv;

/**
 * The final markup for the CHANGELOG.
 */

const changelogJsonToPass = () => {
  let arr;
  if (argv.u) {
    const json = changelogJson["unreleased"];
    arr = json;
    return arr;
  } else {
    arr = changelogJson;
    return arr;
  }
};
const changelogArr = Object.keys(changelogJsonToPass).map((tag) => {
  // const tagToPass = argv.u ? "unreleased" : tag;
  const { commits, title, date } = changelogJson[tag];
  let body = "";

  const { feat, fix, enh, refactor, revert, chore, test } =
    getCommitsByType(commits);

  const createSection = (sectionTitle, commitsList) => {
    const transformList = commitsList
      .map((commit) => {
        const { scopeText, description, fullHash, partialHash } = commit;
        return (
          `- ${scopeText ? `**${scopeText}:** ` : ""}` +
          `${description} ([${partialHash}](https://github.com/BrandSourceDigital/alta/commit/${fullHash}))`
        );
      })
      .join("\n");

    return `
### ${sectionTitle}

${transformList}
`;
  };

  if (test.length > 0) {
    body = body + createSection("BREAKING CHANGES", test);
  }

  if (feat.length > 0) {
    body = body + createSection("✨ Features", feat);
  }

  if (fix.length > 0) {
    body = body + createSection("🐛 Fixes", fix);
  }

  if (refactor.length > 0) {
    body = body + createSection("🔨 Refactors", refactor);
  }

  if (enh.length > 0) {
    body = body + createSection("🧪 Enhancements", enh);
  }

  if (revert.length > 0) {
    body = body + createSection("🚧 Reverts", revert);
  }

  if (chore.length > 0) {
    body = body + createSection("🔧 Chores", chore);
  }

  return `
## ${title} ${date ? `(${date})` : ""}
${body}`;
});

/**
 * Write to the file.
 */
fs.writeFileSync(
  path.resolve(
    __dirname,
    ".",
    argv.u ? "UNRELEASEDCHANGELOG.md" : "CHANGELOG.md"
  ),
  changelogArr.join("\n"),
  {
    encoding: "utf8",
  }
);
