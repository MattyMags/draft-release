const fs = require("fs-extra");
const path = require("path");
const getCommitsByType = require("./getCommitsByType");
const changelogJson = require("./changelog.json");
var argv = require("yargs/yargs")(process.argv.slice(2)).argv; // Pass in -u flag to 'yarn changelog' script in package.json in order to only show 'unreleased' commits.

/**
 * The final markup for the CHANGELOG.
 */
const changelogArr = () => {
  const { commits, title, date } = changelogJson[argv.tag];
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
    body = body + createSection("โจ Features", feat);
  }

  if (fix.length > 0) {
    body = body + createSection("๐ Fixes", fix);
  }

  if (refactor.length > 0) {
    body = body + createSection("๐จ Refactors", refactor);
  }

  if (enh.length > 0) {
    body = body + createSection("๐งช Enhancements", enh);
  }

  if (revert.length > 0) {
    body = body + createSection("๐ง Reverts", revert);
  }

  if (chore.length > 0) {
    body = body + createSection("๐ง Chores", chore);
  }

  return `
## ${title} ${date ? `(${date})` : ""}
${body}`;
};

/**
 * Write to the file.
 */
// console.log(changelogArr());
fs.writeFileSync(
  path.resolve(__dirname, ".", "TAGGEDCHANGELOG.md"),
  changelogArr(),
  {
    encoding: "utf8",
  }
);
