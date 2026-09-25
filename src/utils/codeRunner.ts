import { TestCase } from '../types/exam';

export interface TestExecutionResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  logs: string[];
  testDetails: {
    id: string;
    description: string;
    passed: boolean;
    expected: string;
    actual: string;
    error?: string;
  }[];
}

/**
 * Executes user JavaScript code in a sandboxed Function scope with test assertions.
 */
export async function runJavaScriptChallenge(
  userCode: string,
  testCases: TestCase[]
): Promise<TestExecutionResult> {
  const logs: string[] = [];
  const testDetails: TestExecutionResult['testDetails'] = [];
  let passedTests = 0;

  // Intercept console.log safely
  const customConsole = {
    log: (...args: any[]) => {
      try {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      } catch {
        logs.push(String(args));
      }
    },
    error: (...args: any[]) => {
      try {
        logs.push('[Error] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      } catch {
        logs.push('[Error] ' + String(args));
      }
    },
    warn: (...args: any[]) => {
      try {
        logs.push('[Warn] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      } catch {
        logs.push('[Warn] ' + String(args));
      }
    }
  };

  try {
    // Compile user code inside a wrapper function that returns exports or exposes declared identifiers
    // We execute user code and test cases within the same context
    for (const tc of testCases) {
      try {
        // Construct sandbox runner
        const runnerSrc = `
          "use strict";
          const console = customConsole;
          ${userCode}

          // Run assertion for test case
          ${tc.testFnBody || `
            if (typeof targetFunction === 'function') {
              return targetFunction();
            }
          `}
        `;

        const runner = new Function('customConsole', runnerSrc);
        
        // Execute with timeout safeguard
        const resultPromise = new Promise<{ passed: boolean; actual: any }>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Execution timed out (> 2000ms). Possible infinite loop.'));
          }, 2000);

          try {
            const out = runner(customConsole);
            clearTimeout(timeoutId);
            
            // Check if result is a promise
            if (out instanceof Promise) {
              out.then((resolvedOut) => {
                resolve({ passed: Boolean(resolvedOut.passed), actual: resolvedOut.actual });
              }).catch(reject);
            } else {
              resolve({
                passed: typeof out === 'object' && out !== null && 'passed' in out ? Boolean(out.passed) : Boolean(out),
                actual: typeof out === 'object' && out !== null && 'actual' in out ? out.actual : out
              });
            }
          } catch (err: any) {
            clearTimeout(timeoutId);
            reject(err);
          }
        });

        const execResult = await resultPromise;
        const stringifiedActual = typeof execResult.actual === 'object' 
          ? JSON.stringify(execResult.actual) 
          : String(execResult.actual ?? '');

        if (execResult.passed) {
          passedTests++;
          testDetails.push({
            id: tc.id,
            description: tc.description,
            passed: true,
            expected: tc.expected,
            actual: stringifiedActual || tc.expected,
          });
        } else {
          testDetails.push({
            id: tc.id,
            description: tc.description,
            passed: false,
            expected: tc.expected,
            actual: stringifiedActual,
          });
        }
      } catch (err: any) {
        testDetails.push({
          id: tc.id,
          description: tc.description,
          passed: false,
          expected: tc.expected,
          actual: 'Execution Error',
          error: err.message || String(err),
        });
      }
    }
  } catch (globalErr: any) {
    logs.push(`Syntax/Compilation error: ${globalErr.message}`);
  }

  return {
    passed: testCases.length > 0 && passedTests === testCases.length,
    totalTests: testCases.length,
    passedTests,
    logs,
    testDetails,
  };
}
