// /**
//  *  GENERATE CHANGELOG DATA TO A JSON FILE.
//  */

// // const { argv } = require('yargs');
// const fs = require("fs");
// const path = require("path");
// const { gitLogSync } = require("git-log-as-object");
// const { version } = require("./package.json");
// const commitTypes = require("./commitTypes");
// // const releaseAsVersion = argv.asVersion;
// const { promisify } = require("util");
// const exec = promisify(require("child_process").exec);

// const AVB_DEV_BOT_EMAIL = "avb-dev-services@avb.net";

// const getTitleDate = (commitTime) => {
//   const date = commitTime ? new Date(commitTime) : new Date();
//   return (
//     date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
//   );
// };

// const parseCommitSubject = (subject) => {
//   const typePattern = commitTypes.join("|");
//   const typeRegex = new RegExp(`^(${typePattern})`);
//   const parse = subject.split(/:(.+)/).filter((str) => str);

//   // Commits which follow conventional commit
//   if (parse.length === 2) {
//     const type = (parse[0].match(typeRegex) || [])[0] || null;
//     const scope = (parse[0].match(/\((.+)\)/) || [])[1] || null;
//     const scopeText = scope
//       ? scope
//           .split("-")
//           .map((text) => {
//             if (text === "avb" || text === "ui") {
//               return text.toUpperCase();
//             }
//             return text[0].toUpperCase() + text.slice(1);
//           })
//           .join(" ")
//           .split(",")
//           .map((text) => {
//             if (text === "AVB UI") {
//               return text.split(" ").join("-");
//             }
//             return text[0].toUpperCase() + text.slice(1);
//           })
//           .join(",")
//       : null;
//     const breakingChange = parse[0].endsWith("!");
//     const description = parse[1]
//       .trim()
//       .split(/\(#\d+\)/)[0] // Remove the issue number reference for squash commits
//       .replace(/</g, "&lt;")
//       .replace(/>/g, "&gt;")
//       .trim();

//     return {
//       type,
//       scope,
//       scopeText,
//       breakingChange,
//       description,
//     };
//   }

//   // Tag commits do not have a conventional commit prefix
//   return {
//     type: null,
//     scope: null,
//     scopeText: null,
//     description: parse[0].trim(),
//     breakingChange: false,
//   };
// };

// const getGitTags = async (gitHash) => {
//   try {
//     const { stdout: tag } = await exec(
//       `git tag --contains ${gitHash} | head -n1`
//     );

//     // const { stdout: tags } = await exec(`git describe --contains ${gitHash}`);
//     // const [tag] = tags.split(/[\-_^~]/);

//     return tag;
//   } catch (error) {
//     console.error("There was an error gathering tags", error);
//   }
// };

// const getLogTree = async (log) => {
//   const logTree = {
//     unreleased: {
//       title: "Unreleased",
//       date: null,
//       commits: [],
//     },
//     // [`${version}`]: {
//     //   title: `${version}`,
//     //   date: getTitleDate(),
//     //   commits: [],
//     // },
//   };

//   for (entry of log) {
//     const {
//       commitTime,
//       fullHash,
//       committer: { email },
//     } = entry;

//     // ignore commits by the dev bot
//     if (email === AVB_DEV_BOT_EMAIL) {
//       continue;
//     }

//     const earliestTag = await getGitTags(fullHash);
//     // no tag so must be unreleased commit
//     if (!earliestTag) {
//       logTree["unreleased"].commits.push(entry);
//       continue;
//     }

//     if (!logTree[earliestTag]) {
//       logTree[earliestTag] = {
//         title: earliestTag,
//         date: getTitleDate(commitTime),
//         commits: [],
//       };
//     } else {
//       logTree[earliestTag].commits.push(entry);
//     }
//   }

//   return logTree;
// };
// // let curTag = releaseAsVersion ? `v${version}` : 'unreleased';

// const log = gitLogSync({
//   startRef: "70fa8467f9596e196bc7a7f708bd7b6ea9f00042",
// }).map((entry) => {
//   const { subject, body } = entry;
//   const subjectSanitize = subject.replace(/</g, "&lt;").replace(/>/g, "&gt;");
//   const bodySanitize = body.replace(/</g, "&lt;").replace(/>/g, "&gt;");

//   return {
//     ...entry,
//     ...parseCommitSubject(subjectSanitize),
//     subject: subjectSanitize,
//     body: bodySanitize,
//   };
// });

// getLogTree(log)
//   .then((logTree) => {
//     fs.writeFileSync(
//       path.resolve(__dirname, "./", "changelog.json"),
//       JSON.stringify(logTree, null, 2),
//       "utf-8"
//     );
//   })
//   .catch((error) =>
//     console.error("There was an error creating the changelog", error)
//   );

/**
 *  GENERATE CHANGELOG DATA TO A JSON FILE.
 */

// const { argv } = require('yargs');
const fs = require("fs");
const path = require("path");
const { gitLogSync } = require("git-log-as-object");
const commitTypes = require("./commitTypes");
// const releaseAsVersion = argv.asVersion;
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

const AVB_DEV_BOT_EMAIL = "avb-dev-services@avb.net";

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

const getGitTags = async (gitHash) => {
  try {
    const { stdout: tag } = await exec(
      `git tag --contains ${gitHash} | head -n1`
    );

    return tag;
  } catch (error) {
    console.error("There was an error gathering tags", error);
  }
};

const getLogTree = async (log) => {
  const logTree = {
    unreleased: {
      title: "Unreleased",
      date: null,
      commits: [],
    },
  };

  for (entry of log) {
    const {
      commitTime,
      fullHash,
      committer: { email },
    } = entry;

    // ignore commits by the dev bot
    if (email === AVB_DEV_BOT_EMAIL) {
      continue;
    }

    const earliestTag = await getGitTags(fullHash);
    // no tag so must be unreleased commit
    if (!earliestTag) {
      logTree["unreleased"].commits.push(entry);
      continue;
    }

    const earliestTagFormatted = earliestTag.trim();

    if (!logTree[earliestTagFormatted]) {
      logTree[earliestTagFormatted] = {
        title: earliestTagFormatted,
        date: getTitleDate(commitTime),
        commits: [],
      };
    } else {
      logTree[earliestTagFormatted].commits.push(entry);
    }
  }

  return logTree;
};
// let curTag = releaseAsVersion ? `v${version}` : 'unreleased';

const log = gitLogSync({
  startRef: "70fa8467f9596e196bc7a7f708bd7b6ea9f00042",
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

getLogTree(log)
  .then((logTree) => {
    fs.writeFileSync(
      path.resolve(__dirname, "./", "changelog.json"),
      JSON.stringify(logTree, null, 2),
      "utf-8"
    );
  })
  .catch((error) =>
    console.error("There was an error creating the changelog", error)
  );
