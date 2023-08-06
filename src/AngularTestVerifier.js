/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs').promises;
const path = require('path');
const minimatch = require('minimatch');

const FILE_EXTENSION = '.ts';
const TEST_EXTENSION = '.spec.ts';

class AngularTestVerifier {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    
    this.setBaseOptions(options);
    this.setStatisticsOptions(options);
    this.setExclusionOptions(options);
    this.setCustomMessages(options);
  }

  setBaseOptions(options) {
    const {
      extensions = ['.component.ts', '.service.ts', '.guard.ts', '.directive.ts', '.pipe.ts'],
      mockIdentifier = 'mock',
      directory = 'src/app',
      showTestedFiles = false,
      failOnMissingTests = true,
      depthLevel = Infinity,
    } = options;

    this.extensions = extensions;
    this.mockIdentifier = mockIdentifier;
    this.directory = directory;
    this.showTestedFiles = showTestedFiles;
    this.failOnMissingTests = failOnMissingTests;
    this.depthLevel = depthLevel;
  }

  setStatisticsOptions(options) {
    const { showStatistics = false } = options;
    this.showStatistics = showStatistics;

    if (this.showStatistics) {
      this.statistics = {
        totalFiles: 0,
        testedFiles: 0,
        testlessFiles: 0
      };
    }
  }

  setExclusionOptions(options) {
    const {
      exclusions = [],
      exclusionRules = [],
    } = options;

    this.exclusions = exclusions;
    this.exclusionRules = exclusionRules;
  }

  setCustomMessages(options) {
    const {
      congratulations = [
        '🎉 Great job! All necessary files have tests. 🎉',
        '👏 Well done! Every important file has been tested. 👏',
        '💪 Excellent! All your critical files have their own tests. 💪',
        '🥳 Fantastic! You have tests for all necessary files. 🥳',
        '👍 Superb! Every single file that needs to be tested, is. 👍'
      ]
    } = options;

    this.congratulations = congratulations;
  }

  printConsoleMessage(message, type = 'info') {
    const separator = '==============================================================';
    console[type](separator);
    console[type](message);
    console[type](separator);
  }

  async onRunComplete() {
    const testlessFiles = await this.checkDirectory(path.join(process.cwd(), this.directory));

    if (this.showStatistics) {
      this.printStatistics();
    }

    if (testlessFiles.length > 0) {
      this.notifyTestlessFiles();
    } else {
      this.printRandomCongratulation();
    }
  }

  printStatistics() {
    this.printConsoleMessage(`
      Total Files: ${this.statistics.totalFiles}
      Files with Tests: ${this.statistics.testedFiles}
      Files without Tests: ${this.statistics.testlessFiles}
    `);
  }

  notifyTestlessFiles() {
    this.printConsoleMessage('Some files are missing tests.', 'error');
    if (this.failOnMissingTests) {
      throw new Error('Some files are missing tests.');
    }
  }

  printRandomCongratulation() {
    const congratsIndex = Math.floor(Math.random() * this.congratulations.length);
    this.printConsoleMessage(this.congratulations[congratsIndex]);
  }

  async isExcluded(filePath) {
    for (const pattern of this.exclusions) {
      if (minimatch(filePath, pattern)) {
        return true;
      }
    }
    return this.isExcludedByRule(filePath);
  }

  async isExcludedByRule(filePath) {
    if(!this.exclusionRules?.length) {
      return false;
    }
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return this.exclusionRules.some(rule => {
      if (typeof rule === 'string' && fileContent.includes(rule)) {
        return true;
      } else if (rule instanceof RegExp && rule.test(fileContent)) {
        return true;
      }
      return false;
    });
  }

  async checkDirectory(directory, testlessFiles = [], currentDepth = 0) {
    if (currentDepth > this.depthLevel) {
      return testlessFiles;
    }

    const files = await fs.readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);

      if (await this.isExcluded(filePath)) {
        continue;
      }

      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await this.checkDirectory(filePath, testlessFiles, currentDepth + 1);
      } else {
        await this.verifyTestFile(directory, file, testlessFiles);
      }
    }

    return testlessFiles;
  }

  async verifyTestFile(directory, file, testlessFiles) {
    const extension = this.extensions.find(ext => file.endsWith(ext));

    if (extension && !file.includes(this.mockIdentifier)) {
      this.incrementTotalFiles();

      const specFile = path.join(directory, file.replace(FILE_EXTENSION, TEST_EXTENSION));

      if (await this.testFileExists(specFile)) {
        this.incrementTestedFiles();
        this.notifyTestedFile(directory, file);
      } else {
        this.incrementTestlessFiles();
        this.notifyTestlessFile(directory, file, specFile, testlessFiles);
      }
    }
  }

  incrementTotalFiles() {
    if (this.showStatistics) {
      this.statistics.totalFiles += 1;
    }
  }

  async testFileExists(specFile) {
    try {
      await fs.access(specFile);
      return true;
    } catch {
      return false;
    }
  }

  incrementTestedFiles() {
    if (this.showStatistics) {
      this.statistics.testedFiles += 1;
    }
  }

  notifyTestedFile(directory, file) {
    if (this.showTestedFiles) {
      this.printConsoleMessage(`File with test: ${path.join(directory, file)}`);
    }
  }

  incrementTestlessFiles() {
    if (this.showStatistics) {
      this.statistics.testlessFiles += 1;
    }
  }

  notifyTestlessFile(directory, file, specFile, testlessFiles) {
    const filePath = path.join(directory, file);
    this.printConsoleMessage(`File without test: ${filePath}\n\nExpected test file: ${specFile}`, 'error');
    testlessFiles.push(filePath);
  }
}

module.exports = AngularTestVerifier;
