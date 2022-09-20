# An automated verisioning approach for git-flow using github actions.

__NORMAL FLOW__
![image](https://user-images.githubusercontent.com/85508050/191331335-a7b4c9a7-ea76-434b-ac9a-e5fe7cc4e0b1.png)

__HOTFIX FLOW__

![image](https://user-images.githubusercontent.com/85508050/191331311-de403200-7e23-4afa-b46b-8d9ac804e3a3.png)


`Draft New Release (Manual):` 

__Depends on: No deps, manual trigger dispatch in GH UI__

The first action that kicks off and is set to dispatch on a button and an input to set the version is required. Once the action is dispatched, it performs a series of operations, they are as follows: 

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

__Depends on: Release branches being merged into master__

- Extracts version number

- Creates release - thomaseizinger/create-release@1.0.0

- Kicks off Update Changelog action

 <hr/>

`Update Changelog (Automated)`: 

__Depends on: Publish New Release or Hotfix New Release successful completion__

- Runs changelog generator

- Commits the new CHANGELOG.md and pushes it to master using - stefanzweifel/git-auto-commit-action@v4

- Merges master back into dev

 <hr/>

`Hotfix New Release (Manual):`

__Depends on: No deps, manual trigger dispatch in GH UI__

- Bumps version in package.json 

- Commits package.json

- Pushes to master

- Creates release - thomaseizinger/create-release@1.0.0

- Merges master back into dev

- Kicks off Update Changelog action

