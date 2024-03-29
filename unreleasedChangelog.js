const fs = require("fs-extra");
const path = require("path");
const getCommitsByType = require("./getCommitsByType");
const changelogJson = require("./changelog.json");

/**
 * The final markup for the CHANGELOG.
 */
const changelogArr = () => {
  const { commits, title, date } = changelogJson["unreleased"];
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
};

/**
 * Write to the file.
 */
// console.log(changelogArr());
fs.writeFileSync(
  path.resolve(__dirname, ".", "URELEASEDCHANGELOG.md"),
  changelogArr(),
  {
    encoding: "utf8",
  }
);
