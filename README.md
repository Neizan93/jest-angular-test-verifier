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
      directory: "src/app", // Directory to start checking from. Default is 'src/app'.
      showTestedFiles: false, // Whether or not to show files that already have tests. Default is 'false'.
      failOnMissingTests: true // Whether or not Jest should fail when it finds files without tests. Default is 'true'.
    }]
  ]
};
```

## License

[MIT](./LICENSE)

