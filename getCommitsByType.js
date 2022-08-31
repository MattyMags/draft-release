const commitTypes = require('./commitTypes');

/**
 * Split commits by type.
 * @param commits Array of commits.
 * @return Object, each with a type key and its commits list.
 */
const getCommitsByType = (commits) => {
  const commitsObj = commitTypes.reduce((acc, type) => {
    acc[type] = commits.filter(
      (commit) => commit.type === type && !commit.breakingChange,
    );
    return acc;
  }, {});

  return {
    ...commitsObj,
    breaking: commits.filter((commit) => commit.breakingChange),
  };
};

module.exports = getCommitsByType;
