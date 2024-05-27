# Abtion Secret ([secret.abtion.com](https://secret.abtion.com))

![Observatory](https://img.shields.io/mozilla-observatory/grade-score/secret.abtion.com)

This project is built on top of [Muffi](https://github.com/abtion/muffi).

1. [Abtion Secret](#Abtion-Secret)
2. [Requirements](#requirements)
3. [Developing](#developing)
   - [First time setup](#first-time-setup)
     - [1. Configuration](#1-configuration)
     - [2. Dependencies](#2-dependencies)
       - [Chrome driver](#chrome-driver)
     - [3. Ensure that linting and tests pass](#3-ensure-that-linting-and-tests-pass)
     - [4. Git hooks](#4-git-hooks)
   - [Day-to-day](#day-to-day)
   - [Debugging](#debugging)
4. [Notable inclusions and Notable exclusions](#notable-inclusions-and-notable-exclusions)
5. [Production](#production)

abtion-secret is a self-hosted service that makes it possible to safely share secrets (text strings) through links.

URL: <https://secret.abtion.com>

Asana: <https://app.asana.com/0/1200290320241129/board>

The technical implementation works like this:

1. Creating the **link**:
   1. Browser creates a **password**
   2. Browser encrypts the **secret** with the **password**, then sends it to the backend
   3. Backend generates a **key**
   4. Backend stores the **encrypted secret** under the **key**, with an expiry time set
   5. Backend sends back the **key**.
   6. Browser creates a **link**: origin/**key**#**password**
2. Opening the **link**
   1. Browser calls the backend to fetch the **encrypted secret** (using the **key**)
   2. Backend deletes the **encrypted secret** from the store and sends it back
   3. Browser decrypts the **encrypted secret** with the **password**

Since the password is in the hash-part of the URL it is never sent to the server

# Requirements

You must have the following installed and available on your machine:

- **Ruby 2.7.x**
- **Node JS 18.x**
- **Redis**

# Developing

## First time setup

### 1. Configuration

We use [dotenv](https://github.com/bkeepers/dotenv) for configuring env vars.

The following files are checked into git:

- `.env` - configuration common across all environments
- `.env.development` - configuration specific to the development environment
- `.env.test` - configuration specific to the test environment

If you need to make local changes to the env files, create a `.env.ENVIRONMENT.local` file (where ENVIRONMENT is test or development).

Any env var you specify in such a file will override the configuration for the corresponding environment.

### 2. Dependencies

Run: `bin/setup`

#### Chrome driver

Download the correct version of chromedriver.\*

```sh
bundle exec rails webdrivers:chromedriver:update
```

\*_It will try to do this automatically when running the tests, but if you disable network with webmock/vcr your tests will fail when it does._

If you need to, you can disable the Chrome driver by setting
`DISABLE_WEBDRIVERS` to `true` in `.env.test` or running
`DISABLE_WEBDRIVERS=true bundle exec rspec` if you only need to do it
occasionally.

### 3. Ensure that linting and tests pass

Run:

```sh
bundle exec rspec
bundle exec rubocop
bundle exec brakeman --quiet --no-summary
bundle exec erblint --lint-all
npm run lint
```

Or instead, you can run `rails test_all_strict`

### 4. Git hooks

Run: `bin/install-hooks`

This way you are getting all our git hooks for both pushing and committing.
If for some reason you don't want one of the hooks (push/commit) you can specify it by with `--no-commit` and `--no-push`.

The hooks are symlinked meaning all the changes to the repo hooks will automatically be updated in all local environments, in the case of a change.

## Day-to-day

- Run the server: `bin/rails s` and [http://localhost:3000](http://localhost:3000)
- Run tests: `bin/rspec`
- Run rubocop: `bin/rubocop`
- Run prettier: `bin/prettier`

## Debugging

- Call `byebug` anywhere in the code to stop execution and get a debugger console.
- Access an IRB console on exception pages or by using `<%= console %>` anywhere in the code.
- (Of course, [RubyMine](https://www.jetbrains.com/ruby/) includes a great [visual debugger](https://www.jetbrains.com/ruby/features/ruby_debugger.html)).

# Notable inclusions and Notable exclusions

Inclusions:

- [Devise](#devise-user-authorization)
- Shakapacker
- Jest
- Prettier for linting javascript files
- RSpec runner
  - Capybara for acceptance testing
- Rubocop for linting ruby files
- CSP header is configured, so if you need to use remotely hosted javascript, you must whitelist it in `config/initializers/content_security_policy.rb`

Exclusions:

- Spring
- Turbolinks

# Production

The project is hosted by [heroku](https://heroku.com).

Current dyno types and add-on plans can be found in the project's [heroku dashboard](https://dashboard.heroku.com/apps/abtion-secret). To access the dashboard, a heroku user with access to the abtion team is required.

## Deployments

The `main` branch is automatically deployed to the production env.

Remote (App)
Production <https://git.heroku.com/abtion-secret.git> (<https://abtion-secret.herokuapp.com/>)
