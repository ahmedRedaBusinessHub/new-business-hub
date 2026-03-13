import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

describe('Linting Validation', () => {
  describe('ESLint Configuration', () => {
    it('should have eslint.config.mjs', () => {
      const eslintConfigPath = join(projectRoot, 'eslint.config.mjs');
      expect(existsSync(eslintConfigPath)).toBe(true);
    });

    it('should have proper ignores configured', () => {
      const eslintConfigPath = join(projectRoot, 'eslint.config.mjs');
      const configContent = readFileSync(eslintConfigPath, 'utf8');
      expect(configContent).toContain('globalIgnores');
      expect(configContent).toContain('node_modules');
      expect(configContent).toContain('.next');
      expect(configContent).toContain('coverage');
    });
  });

  describe('ESLint Zero Warnings', () => {
    it('should run ESLint without errors', () => {
      expect(() => {
        execSync('npm run lint -- --max-warnings=0', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    it('should have zero warnings', () => {
      let output = '';
      try {
        output = execSync('npm run lint -- --format json', {
          cwd: projectRoot,
          stdio: 'pipe',
          encoding: 'utf8',
        });
      } catch (error) {
        output = (error as { stdout?: Buffer }).stdout?.toString() || '';
      }

      const results = JSON.parse(output) as Array<{ warningCount: number }>;
      const totalWarnings = results.reduce((sum: number, result: { warningCount: number }) => {
        return sum + result.warningCount;
      }, 0);

      expect(totalWarnings).toBe(0);
    });

    it('should not have unused imports or variables', () => {
      let output = '';
      try {
        output = execSync('npm run lint', {
          cwd: projectRoot,
          stdio: 'pipe',
          encoding: 'utf8',
        });
      } catch (error) {
        output = (error as { stdout?: Buffer }).stdout?.toString() || '';
      }

      const hasUnusedVars = output.includes('no-unused-vars') || output.includes('@typescript-eslint/no-unused-vars');
      expect(hasUnusedVars).toBe(false);
    });

    it('should have proper React component displayNames', () => {
      let output = '';
      try {
        output = execSync('npm run lint', {
          cwd: projectRoot,
          stdio: 'pipe',
          encoding: 'utf8',
        });
      } catch (error) {
        output = (error as { stdout?: Buffer }).stdout?.toString() || '';
      }

      const hasDisplayNameErrors = output.includes('react/display-name');
      expect(hasDisplayNameErrors).toBe(false);
    });

    it('should not have useEffect dependency issues', () => {
      let output = '';
      try {
        output = execSync('npm run lint', {
          cwd: projectRoot,
          stdio: 'pipe',
          encoding: 'utf8',
        });
      } catch (error) {
        output = (error as { stdout?: Buffer }).stdout?.toString() || '';
      }

      const hasDependencyIssues = output.includes('react-hooks/exhaustive-deps');
      expect(hasDependencyIssues).toBe(false);
    });
  });

  describe('Code Quality', () => {
    it('should not have console.log statements', () => {
      const output = execSync('grep -r "console\\.log" src/ --include="*.ts" --include="*.tsx" || true', {
        cwd: projectRoot,
        stdio: 'pipe',
        encoding: 'utf8',
      });

      const hasConsoleLogs = output.trim().length > 0;
      expect(hasConsoleLogs).toBe(false);
    });

    it('should not have @ts-ignore comments', () => {
      const output = execSync('grep -r "@ts-ignore" src/ --include="*.ts" --include="*.tsx" || true', {
        cwd: projectRoot,
        stdio: 'pipe',
        encoding: 'utf8',
      });

      const hasTsIgnore = output.trim().length > 0;
      expect(hasTsIgnore).toBe(false);
    });
  });
});
