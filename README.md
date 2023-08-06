# jest-angular-test-verifier

A custom Jest reporter specifically designed for Angular projects. This reporter checks and ensures that specific types of files (components, services, directives, etc.) have their corresponding test file.

## Installation

Install the package using npm:

```bash
npm install jest-angular-test-verifier --save-dev
```

## Usage

In your Jest configuration file (e.g., `jest.config.js`), add `jest-angular-test-verifier` to your list of reporters:

```javascript
module.exports = {
  // ... other Jest configuration options
  reporters: ["default", "jest-angular-test-verifier"]
};
```

## Configuration Options

You can configure the reporter by providing a second argument with options in your configuration file:

```javascript
module.exports = {
  // ... other Jest configuration options
  reporters: [
    "default",
    ["jest-angular-test-verifier", {
      directory: "src/app",
      showTestedFiles: false,
      failOnMissingTests: true,
      exclusions: ['**/*.module.ts', 'src/app/somefolder/**'],
      exclusionRules: [/DEPRECATED/, "TO_BE_REMOVED"],
    }]
  ]
};
```

### Directory

Specifies the directory from where the reporter should start checking for test files.

* Default: `'src/app'`

### Extensions

Define which types of files you want to ensure have tests. By default, the reporter checks for components, services, guards, directives, and pipes.

* Default:
    
    ```javascript
    [
      '.component.ts',
      '.service.ts',
      '.guard.ts',
      '.directive.ts',
      '.pipe.ts'
    ]
    ```
    

Example:

```javascript
module.exports = {
  // ... other Jest configuration options
  reporters: [
    "default",
    ["jest-angular-test-verifier", {
      ...
      extensions: ['.component.ts', '.service.ts']
    }]
  ]
};
```

### ShowTestedFiles

Determines whether the reporter should display files that already have associated test files.

* Default: `false`

### FailOnMissingTests

Indicates whether Jest should terminate with a failure if it finds files that are missing test files.

* Default: `true`

### ShowStatistics

Determines whether the reporter should display statistics about the total files checked, how many have tests, and how many are missing tests.

* Default: `false`

Example:

```javascript
module.exports = {
  // ... other Jest configuration options
  reporters: [
    "default",
    ["jest-angular-test-verifier", {
      ...
      showStatistics: true
    }]
  ]
};
```

### Exclusions

Using the `exclusions` option, you can define specific files or directories that you want the reporter to skip. This is particularly useful when you have certain files or folders in your project that you know shouldn't have tests.

The exclusions accept glob patterns, allowing for flexible configurations:

* `'**/*.module.ts'` - will exclude all module files in your project.
* `'src/app/somefolder/**'` - will exclude everything within `src/app/somefolder/`.

### ExclusionRules

Allows you to exclude files based on content using strings or regular expressions. For example, if you have deprecated files containing the "DEPRECATED" string, you can easily exclude them without needing to rely on filenames or paths.

Examples:

* Using a string: `"TO_BE_REMOVED"` would exclude any file containing that exact string.
* Using a regular expression: `/DEPRECATED/` would exclude any file containing the word "DEPRECATED".

### DepthLevel

Allows you to specify how many levels of subdirectories you want to check for test files. A value of `1` will check only the files and directories directly inside the specified directory. A value of `2` will check those and their immediate subdirectories, and so on.

* Default: `Infinity` (All subdirectories will be checked)

Example:

```javascript
module.exports = {
  // ... other Jest configuration options
  reporters: [
    "default",
    ["jest-angular-test-verifier", {
      ...
      depthLevel: 2
    }]
  ]
};
```

### MockIdentifier

Determines the string used to identify mock files in your project. This is useful if you have a different naming convention for mock files than the standard 'mock'.

* Default: `'mock'`

### Congratulations Messages

You can customize the congratulatory messages displayed when all necessary files have tests. Provide an array of messages, and a random one will be chosen when all files are covered:

```javascript
module.exports = {
  // ... other Jest configuration options
  reporters: [
    "default",
    ["jest-angular-test-verifier", {
      directory: "src/app",
      extensions: ['.component.ts', '.service.ts'],
      showTestedFiles: false,
      failOnMissingTests: true,
      showStatistics: true,
      exclusions: ['**/*.module.ts', 'src/app/somefolder/**'],
      exclusionRules: [/DEPRECATED/, "TO_BE_REMOVED"],
      depthLevel: 2,
      mockIdentifier: 'mock',
      congratulations: [
        "🚀 Awesome! All files are covered.",
        "💡 Brilliance! Every file has a test.",
        "🔥 Blazing! 100% of files have tests."
      ]
    }]
  ]
};
```

## License

[MIT](./LICENSE)

