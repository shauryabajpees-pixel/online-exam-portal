import React, { useState } from 'react';
import { Question, TestCase } from '../../types/exam';
import { runJavaScriptChallenge, TestExecutionResult } from '../../utils/codeRunner';
import { Play, RotateCcw, Check, CheckCircle2, XCircle, Copy, Terminal, HelpCircle, Code2 } from 'lucide-react';

interface QuestionViewerProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswers: number[];
  onSelectOption: (optionIndex: number, isMulti: boolean) => void;
  userCode: string;
  onChangeUserCode: (code: string) => void;
  onCodeTestRun: (results: { passed: number; total: number; details: any[] }) => void;
  lastTestResults?: { passed: number; total: number; details: any[] };
}

export const QuestionViewer: React.FC<QuestionViewerProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswers,
  onSelectOption,
  userCode,
  onChangeUserCode,
  onCodeTestRun,
  lastTestResults,
}) => {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testOutput, setTestOutput] = useState<TestExecutionResult | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleRunCodeTests = async () => {
    if (!question.testCases) return;
    setIsRunningTests(true);
    try {
      const results = await runJavaScriptChallenge(userCode || question.initialCode || '', question.testCases);
      setTestOutput(results);
      onCodeTestRun({
        passed: results.passedTests,
        total: results.totalTests,
        details: results.testDetails,
      });
    } catch (err: any) {
      console.error('Test execution failed', err);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleResetCode = () => {
    if (confirm('Reset your code to the default template? Your current edits will be lost.')) {
      onChangeUserCode(question.initialCode || '');
      setTestOutput(null);
    }
  };

  const isMulti = question.type === 'multiple_choice';
  const isCoding = question.type === 'coding_challenge';

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-cyan-400">
            QUESTION {questionNumber} OF {totalQuestions}
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="text-xs font-semibold text-slate-300">{question.topic}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{question.points} Points</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>{question.difficulty}</span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
          {question.prompt}
        </h2>
        {isMulti && (
          <p className="text-xs text-cyan-400 font-medium">
            (Select all that apply)
          </p>
        )}
      </div>

      {/* Code Snippet for Analysis (if applicable) */}
      {question.codeSnippet && (
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
            <span className="text-slate-500">JavaScript Source</span>
            <button
              onClick={() => handleCopyCode(question.codeSnippet!)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-cyan-200/90 overflow-x-auto leading-relaxed whitespace-pre font-mono">
            {question.codeSnippet}
          </pre>
        </div>
      )}

      {/* MCQ Options (Single or Multiple Choice) */}
      {!isCoding && question.options && (
        <div className="space-y-3 pt-2">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswers.includes(idx);
            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectOption(idx, isMulti)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-sm shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950'
                      : 'border border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  {letter}
                </div>
                <div className="flex-1 text-sm pt-0.5 leading-relaxed font-normal">
                  {option}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Interactive JavaScript Coding Sandbox */}
      {isCoding && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Interactive Solution Editor (JavaScript ES2024)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden focus-within:border-cyan-500">
            <div className="bg-slate-900/80 px-4 py-2 text-[11px] font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between">
              <span>solution.js</span>
              <span className="text-slate-500">Client Sandbox</span>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => onChangeUserCode(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full bg-slate-950 p-4 font-mono text-xs text-cyan-100 placeholder-slate-600 focus:outline-none resize-y leading-relaxed"
              placeholder="// Write your JavaScript function here..."
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 font-mono">
              Press "Run Test Cases" to verify your logic before moving forward.
            </span>
            <button
              onClick={handleRunCodeTests}
              disabled={isRunningTests}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-md shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningTests ? 'Running Assertions...' : 'Run Test Cases'}</span>
            </button>
          </div>

          {/* Test Execution Output */}
          {(testOutput || lastTestResults) && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Automated Assertion Matrix</span>
                </div>
                <div className="text-xs font-mono">
                  {testOutput ? (
                    <span className={testOutput.passed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {testOutput.passedTests} / {testOutput.totalTests} Passed
                    </span>
                  ) : lastTestResults ? (
                    <span className="text-slate-300 font-mono">
                      {lastTestResults.passed} / {lastTestResults.total} Passed
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Individual test case results */}
              <div className="space-y-2">
                {(testOutput?.testDetails || lastTestResults?.details || []).map((detail: any, i: number) => (
                  <div
                    key={detail.id || i}
                    className={`rounded-lg border p-3 text-xs font-mono space-y-1 ${
                      detail.passed
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
                        : 'border-rose-500/20 bg-rose-500/5 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-sans font-medium">
                      <div className="flex items-center gap-2">
                        {detail.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span>{detail.description}</span>
                      </div>
                      <span className="text-[11px] font-mono">
                        {detail.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>

                    {!detail.passed && (
                      <div className="text-[11px] space-y-0.5 pt-1 text-slate-400 border-t border-slate-800/80">
                        {detail.error ? (
                          <div className="text-rose-400">{detail.error}</div>
                        ) : (
                          <>
                            <div>Expected: <span className="text-slate-200">{detail.expected}</span></div>
                            <div>Received: <span className="text-rose-300">{detail.actual}</span></div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {testOutput?.logs && testOutput.logs.length > 0 && (
                <div className="rounded-lg bg-slate-950 p-2.5 text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="text-slate-500 text-[10px]">Console Output:</div>
                  {testOutput.logs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
