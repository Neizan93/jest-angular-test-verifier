const fs = require('fs').promises;
const path = require('path');
const minimatch = require('minimatch');

jest.mock('fs');

const AngularTestVerifier = require('../AngularTestVerifier');

const FILE_EXTENSION = '.ts';
const TEST_EXTENSION = '.spec.ts';

describe('AngularTestVerifier', () => {
  describe('setBaseOptions', () => {
    it('should set default options if none are provided', () => {
      const verifier = new AngularTestVerifier({}, {});
      expect(verifier.extensions).toEqual([
        '.component.ts',
        '.service.ts',
        '.guard.ts',
        '.directive.ts',
        '.pipe.ts',
      ]);
      expect(verifier.mockIdentifier).toBe('mock');
      expect(verifier.directory).toBe('src/app');
      expect(verifier.showTestedFiles).toBe(false);
      expect(verifier.failOnMissingTests).toBe(true);
      expect(verifier.depthLevel).toBe(Infinity);
    });

    it('should override default options with provided options', () => {
      const options = {
        extensions: ['.component.ts'],
        mockIdentifier: 'custom-mock',
        directory: 'test-dir',
        showTestedFiles: true,
        failOnMissingTests: false,
        depthLevel: 2,
      };
      const verifier = new AngularTestVerifier({}, options);
      expect(verifier.extensions).toEqual(['.component.ts']);
      expect(verifier.mockIdentifier).toBe('custom-mock');
      expect(verifier.directory).toBe('test-dir');
      expect(verifier.showTestedFiles).toBe(true);
      expect(verifier.failOnMissingTests).toBe(false);
      expect(verifier.depthLevel).toBe(2);
    });
  });

  describe('setStatisticsOptions', () => {
    it('should set showStatistics to true and initialize statistics object', () => {
      const verifier = new AngularTestVerifier({}, { showStatistics: true });
      expect(verifier.showStatistics).toBe(true);
      expect(verifier.statistics).toEqual({
        totalFiles: 0,
        testedFiles: 0,
        testlessFiles: 0,
      });
    });

    it('should set showStatistics to false and statistics to undefined', () => {
      const verifier = new AngularTestVerifier({}, {});
      expect(verifier.showStatistics).toBe(false);
      expect(verifier.statistics).toBeUndefined();
    });
  });

  describe('setExclusionOptions', () => {
    it('should set exclusions and exclusionRules from options', () => {
      const options = {
        exclusions: ['**/*.test.ts'],
        exclusionRules: ['DEPRECATED', /TO_BE_REMOVED/],
      };
      const verifier = new AngularTestVerifier({}, options);
      expect(verifier.exclusions).toEqual(['**/*.test.ts']);
      expect(verifier.exclusionRules).toEqual(['DEPRECATED', /TO_BE_REMOVED/]);
    });

    it('should set exclusions and exclusionRules to empty arrays if not provided', () => {
      const verifier = new AngularTestVerifier({}, {});
      expect(verifier.exclusions).toEqual([]);
      expect(verifier.exclusionRules).toEqual([]);
    });
  });

  describe('setCustomMessages', () => {
    it('should set custom congratulations messages', () => {
      const options = {
        congratulations: ['Great job!', 'Well done!'],
      };
      const verifier = new AngularTestVerifier({}, options);
      expect(verifier.congratulations).toEqual(['Great job!', 'Well done!']);
    });

    it('should set default congratulations messages if not provided', () => {
      const verifier = new AngularTestVerifier({}, {});
      expect(verifier.congratulations).toEqual([
        '🎉 Great job! All necessary files have tests. 🎉',
        '👏 Well done! Every important file has been tested. 👏',
        '💪 Excellent! All your critical files have their own tests. 💪',
        '🥳 Fantastic! You have tests for all necessary files. 🥳',
        '👍 Superb! Every single file that needs to be tested, is. 👍',
      ]);
    });
  });

  describe('printConsoleMessage', () => {
    it('should print message to console with info type', () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
      const verifier = new AngularTestVerifier({}, {});
      verifier.printConsoleMessage('Test message');
      expect(consoleSpy).toHaveBeenCalledWith('==============================================================');
      expect(consoleSpy).toHaveBeenCalledWith('Test message');
      expect(consoleSpy).toHaveBeenCalledWith('==============================================================');
      consoleSpy.mockRestore();
    });
  });

  describe('onRunComplete', () => {
    let consoleErrorSpy, consoleInfoSpy;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      consoleInfoSpy.mockRestore();
    });

    it('should notify of testless files if there are any', async () => {
      const verifier = new AngularTestVerifier({}, { failOnMissingTests: true });
      const testlessFiles = ['path/to/file1', 'path/to/file2'];
      verifier.checkDirectory = jest.fn().mockResolvedValue(testlessFiles);
      await expect(verifier.onRunComplete()).rejects.toThrow('Some files are missing tests.');
      expect(consoleErrorSpy).toHaveBeenCalledWith('==============================================================');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Some files are missing tests.');
    });

    it('should congratulate if there are no testless files', async () => {
      const verifier = new AngularTestVerifier({}, { failOnMissingTests: true });
      const spyOnCongratulation = jest.spyOn(verifier, 'printRandomCongratulation');
      verifier.checkDirectory = jest.fn().mockResolvedValue([]);
      await verifier.onRunComplete();
      expect(spyOnCongratulation).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
    });
  });

});
