# Market Watch UI

This projects contains the entire user interface surfaces of the Market Watch platform.

## Getting Started

### Requirements

- Bun v1.3.14
- Angular v22.0.2 (and higher)
- Angular CLI v22.0.3 (and higher)

### Clone the repo

```bash
$ git clone <github repo URL>

# Cloning into market-watch-ui...

cd market-watch-ui
```

### Install dependencies

```bash
$ bun install

# bun add v1.3.14 (0d9b296a)

## installed ...
## installed ...

# 71 packages installed [3.75s]
```

### Confirm your current Git branch

```bash
$ git branch

# * develop
#   main
```

> Please refer to the [guidelines for contributing](./docs/CONTRIBUTING.md) to the project before making any code changed

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Documentation

Below is a list of documentation for your reference

| Topic           | Description                                                              | Source                                       |
|---------------  |------------------------------------------------------------------------- |--------------------------------------------- |
| Home            | Project setup                                                            | [README.md](#getting-started) (you are here) |
| Architecture    | Details the Market Watch UI system architecure approach                  | [ARCHITECTURE.md](./docs/ARCHITECTURE.md)    |
| Contributing    | Provides a guide for making contrbutions to the Market Watch UI via Git  | [CONTRIBUTING.md](./docs/CONTRIBUTING.md)    |

## Architecture

The system is currently implemented as a Modular Monolith, using strict clean architecture layering, dependency inversion and encapsulation to enforce business rules. The full architecture document is listed in the table above.

## Modules and Features

| Module Name        | Description                                                                 | Source                                                                                |
| :---------------:  | :-------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
| Auth               | User sign in and verification concerns                                      | --                                                                                    |
| User               | User registration, profile and address management                           | --                                                                                    |
