## An automated verisioning approach for Git-Flow using GitHub actions.

**NORMAL FLOW**

**HOTFIX FLOW**

`Draft New Release (Manual):`

**Depends on: No deps, manual trigger dispatch in GH UI**

The first action that kicks off and is executed by a button in the actions panel. Requires a version number to be inputted. Once the action is dispatched, it performs a series of operations, they are as follows:

- Creates a release branch - release/{{ version that was inputted}}

- Bumps version in package.json

- Updates our UNRELEASEDCHANGELOG.md - Has the ability to drop in any changelog generator function

- Commits the package.json

- Pushes the new branch

- Creates the Pull Request - thomaseizinger/create-pull-request@1.0.0

- Adds the unreleased changes from UNRELEASEDCHANGELOG.md as a comment on the PR

- Once the PR is created it is now just a normal release pr. When this PR is merged it kicks off the next sequence of actions.

<hr/>

`Publish New Release (Automated):`

**Depends on: Release branches being merged into master**

- Extracts version number

- Creates release - thomaseizinger/create-release@1.0.0

- Kicks off Update Changelog action

 <hr/>

`Update Changelog (Automated)`:

**Depends on: Publish New Release or Hotfix New Release successful completion**

- Runs changelog generator

- Commits the new CHANGELOG.md and pushes it to master using - stefanzweifel/git-auto-commit-action@v4

- Merges master back into dev

 <hr/>

`Hotfix New Release (Manual):`

**Depends on: No deps, manual trigger dispatch in GH UI**

- Bumps version in package.json

- Commits package.json

- Pushes to master

- Creates release - thomaseizinger/create-release@1.0.0

- Merges master back into dev

- Kicks off Update Changelog action
