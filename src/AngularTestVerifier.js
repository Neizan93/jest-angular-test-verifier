/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs').promises;
const path = require('path');

class AngularTestVerifier {
  constructor(globalConfig, options) {
    const { exclusions = [], extensions = [], directory = 'src/app', showTestedFiles = false, failOnMissingTests = true } = options;
    this._globalConfig = globalConfig;
    this.exclusions = exclusions;
    this.extensions = extensions.length ? extensions : [
      '.component.ts',
      '.service.ts',
      '.guard.ts',
      '.directive.ts',
      '.pipe.ts',
    ];
    this.directory = directory;
    this.showTestedFiles = showTestedFiles;
    this.failOnMissingTests = failOnMissingTests;

    this.congratulations = [
      '🎉 Great job! All necessary files have tests. 🎉',
      '👏 Well done! Every important file has been tested. 👏',
      '💪 Excellent! All your critical files have their own tests. 💪',
      '🥳 Fantastic! You have tests for all necessary files. 🥳',
      '👍 Superb! Every single file that needs to be tested, is. 👍'
    ];
  }

  printConsoleMessage(message, type = 'info') {
    const separator = '==============================================================';
    console[type](separator);
    console[type](message);
    console[type](separator);
  }

  async onRunComplete() {
    const testlessFiles = await this.checkDirectory(path.join(process.cwd(), this.directory));

    if (testlessFiles.length > 0) {
      this.printConsoleMessage('Some files are missing tests.', 'error');
      if (this.failOnMissingTests) {
        throw new Error('Some files are missing tests.');
      }
    } else {
      const congratsIndex = Math.floor(Math.random() * this.congratulations.length);
      this.printConsoleMessage(this.congratulations[congratsIndex]);
    }
  }

  async checkDirectory(directory, testlessFiles = []) {
    const files = await fs.readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);

      if (this.exclusions.includes(filePath)) {
        continue;
      }

      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await this.checkDirectory(filePath, testlessFiles);
      } else {
        const extension = this.extensions.find(ext => file.endsWith(ext));

        if (extension && !file.includes('mock')) {
          const specFile = path.join(directory, file.replace('.ts', '.spec.ts'));
          try {
            await fs.access(specFile);
            if (this.showTestedFiles) {
              this.printConsoleMessage(`File with test: ${filePath}`);
            }
          } catch {
            this.printConsoleMessage(`File without test: ${filePath}\n\nExpected test file: ${specFile}`, 'error');
            testlessFiles.push(filePath);
          }
        }
      }
    }

    return testlessFiles;
  }
}

module.exports = AngularTestVerifier;
