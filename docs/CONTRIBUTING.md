# Contributing to Market Watch UI 🚀

Welcome, team! This document outlines the standards for contributing to this project. Following these guidelines helps us work together efficiently and maintain a clean codebase.

## 📦 Getting Started

Please start at the project [README.md](../README.md) for the full setup steps. You should have cloned the repo and installed the project dependencies locally before getting to this part of the setup

### Step 1: Confirm your current Git branch

```bash
$ git branch

# * develop
#   main
```

> Please ensure you can run the project and its tests locally before making any changes. Run `ng test` for this

## GitHub WorkFlow

Our workflow for Git will be based on the GitFlow branching model ([read more about it here](https://nvie.com/posts/a-successful-git-branching-model/))

- `main` holds stable, production-ready code.

- `develop` is the base for all ongoing development.

- All new work must branch off `develop`.

- All new development happens in `feature/` branches based on the `develop` branch.

Here's what a typical flow would look like:

### Confirm the branches available on your local clone of the repo

```bash
# After cloning the repo
git branch --list
```

### If you're not already on the `develop` branch, switch to it

```bash
git switch develop

# After switching you can run `git pull` to make sure you have the latest changes from the develop branch
git pull origin develop
```

### Create and switch to a new feature branch off the `develop` branch

Use this format for naming the branch: `feature/<short-description>`

```bash
git switch -c feature/payment develop

# This command creates the `feature/payment` branch based on the current state of your local `develop` branch
```

### Make your changes. Write your code, add or update tests, and make commits

### Commit your changes using Conventional Commits

This is mandatory. Your commit messages must follow this format: `type(scope): subject` format. This helps us auto-generate changelogs and understand the history at a glance.

Example Commits:

```Bash
git commit -m "feat(auth): implement password reset endpoint"

git commit -m "chore(deps): add new dependency package"

git commit -m "fix(login): prevent crash on invalid credentials"

git commit -m "test(validation): write test case for eInvoice stamp validation"

git commit -m "docs: update README with setup instructions"

git commit -m "docs(api): add section for password reset endpoint"
```

#### Common types for commit messages

- feat: A new feature for the user.

- fix: A bug fix for the user.

- chore: Routine tasks, build process, or config changes.

- docs: Changes to the documentation.

- style: Code style changes (formatting, whitespaces etc.) that don't affect logic.

- refactor: Code changes that neither fix a bug nor add a feature.

- test: Adding or refactoring tests.

[You can read more about conventional commits here](https://www.conventionalcommits.org/en/v1.0.0/)

### Push your branch to remote

```bash
git push origin feature/payment

# Or use the VScode interface to publish your branch
```

### Open a Pull Request (PR)

- Go to the repository on GitHub and create a new Pull Request.

- Ensure the base branch is develop and the compare branch is your feature branch.

- Write a clear description of what your PR does and why. If it resolves an issue, link to it.

- Assign other team members as reviewers.

---

## Documentation Navigation

- [Home](../README.md)

> Contributing - You are here

- [Architecture](ARCHITECTURE.md)
