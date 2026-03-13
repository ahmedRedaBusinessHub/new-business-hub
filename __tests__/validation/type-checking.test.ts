import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

describe('Type Checking Validation', () => {
  describe('TypeScript Compilation', () => {
    it('should compile without errors', () => {
      expect(() => {
        execSync('npm run type-check', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    it('should have zero TypeScript errors', () => {
      let output = '';
      try {
        output = execSync('npm run type-check', {
          cwd: projectRoot,
          stdio: 'pipe',
          encoding: 'utf8',
        });
      } catch (error) {
        output = (error as { stdout?: Buffer }).stdout?.toString() || '';
      }

      const hasErrors = output.includes('error TS');
      expect(hasErrors).toBe(false);
    });

    it('should not use @ts-ignore or @ts-expect-error', () => {
      const output = execSync('grep -r "@ts-ignore\\|@ts-expect-error" src/', {
        cwd: projectRoot,
        stdio: 'pipe',
        encoding: 'utf8',
      });

      const hasIgnoreDirectives = output.trim().length > 0;
      expect(hasIgnoreDirectives).toBe(false);
    });
  });

  describe('TypeScript Strict Mode Compliance', () => {
    it('should have strict mode enabled', () => {
      const tsconfigPath = join(projectRoot, 'tsconfig.json');
      const tsconfigContent = readFileSync(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(tsconfigContent) as { compilerOptions?: { strict?: boolean } };
      expect(tsconfig.compilerOptions?.strict).toBe(true);
    });

    it('should have noImplicitAny enabled', () => {
      const tsconfigPath = join(projectRoot, 'tsconfig.json');
      const tsconfigContent = readFileSync(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(tsconfigContent) as { compilerOptions?: { noImplicitAny?: boolean } };
      expect(tsconfig.compilerOptions?.noImplicitAny).toBe(true);
    });
  });
});
