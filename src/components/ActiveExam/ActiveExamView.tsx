import React, { useState, useEffect, useRef } from 'react';
import { Exam, CandidateInfo, IncidentRecord, ExamResult, QuestionScoreDetail } from '../../types/exam';
import { QuestionViewer } from './QuestionViewer';
import { QuestionPalette } from './QuestionPalette';
import { CalculatorModal } from './CalculatorModal';
import { ScratchpadModal } from './ScratchpadModal';
import { ProctorWarningModal } from './ProctorWarningModal';
import { SubmitConfirmModal } from './SubmitConfirmModal';
import { saveScratchpad, getScratchpad, saveActiveSession, generateVerificationHash } from '../../utils/storage';
import { 
  Clock, Maximize2, Minimize2, Calculator, Edit3, Bookmark, 
  ChevronLeft, ChevronRight, Send, AlertTriangle, ShieldAlert,
  RotateCcw
} from 'lucide-react';

interface ActiveExamViewProps {
  exam: Exam;
  candidate: CandidateInfo;
  onFinishExam: (result: ExamResult) => void;
  onExitWithoutSaving: () => void;
}

export const ActiveExamView: React.FC<ActiveExamViewProps> = ({
  exam,
  candidate,
  onFinishExam,
  onExitWithoutSaving,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [codeSubmissions, setCodeSubmissions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    exam.questions.forEach((q) => {
      if (q.type === 'coding_challenge' && q.initialCode) {
        initial[q.id] = q.initialCode;
      }
    });
    return initial;
  });
  const [testResults, setTestResults] = useState<Record<string, { passed: number; total: number; details: any[] }>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [visitedIds, setVisitedIds] = useState<string[]>([exam.questions[0].id]);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);

  // Time state
  const totalSeconds = exam.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const startTimeRef = useRef<number>(Date.now());

  // Tools state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadNotes, setScratchpadNotes] = useState(() => getScratchpad(exam.id));
  const [showProctorWarning, setShowProctorWarning] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Maximum allowed proctor incidents before forced submission
  const MAX_INCIDENTS = 3;

  // Auto-save session state to local storage on changes
  useEffect(() => {
    saveActiveSession({
      examId: exam.id,
      candidate,
      startTime: startTimeRef.current,
      durationSeconds: totalSeconds,
      selectedAnswers,
      codeSubmissions,
      testResults,
      flaggedQuestionIds: flaggedIds,
      visitedQuestionIds: visitedIds,
      currentQuestionIndex: currentIndex,
      incidents,
      isSubmitted: false,
    });
  }, [selectedAnswers, codeSubmissions, testResults, flaggedIds, visitedIds, currentIndex, incidents]);

  // Sync scratchpad notes to storage
  const handleScratchpadChange = (val: string) => {
    setScratchpadNotes(val);
    saveScratchpad(exam.id, val);
  };

  // Timer countdown hook
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Real Proctoring Listeners: tab visibility and window blur
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        const incident: IncidentRecord = {
          timestamp: Date.now(),
          type: 'tab_switch',
          message: 'Candidate switched tab or minimized window context.',
        };
        setIncidents((prev) => {
          const updated = [...prev, incident];
          if (updated.length >= MAX_INCIDENTS) {
            handleFinalSubmit();
          }
          return updated;
        });
        setShowProctorWarning(true);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.warn('Fullscreen request blocked by browser policy', err);
    }
  };

  const currentQuestion = exam.questions[currentIndex];

  const handleSelectOption = (optIndex: number, isMulti: boolean) => {
    setSelectedAnswers((prev) => {
      const existing = prev[currentQuestion.id] || [];
      if (isMulti) {
        if (existing.includes(optIndex)) {
          return { ...prev, [currentQuestion.id]: existing.filter((i) => i !== optIndex) };
        } else {
          return { ...prev, [currentQuestion.id]: [...existing, optIndex].sort() };
        }
      } else {
        return { ...prev, [currentQuestion.id]: [optIndex] };
      }
    });
  };

  const handleClearCurrentResponse = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleToggleFlag = () => {
    setFlaggedIds((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id]
    );
  };

  const navigateToQuestion = (idx: number) => {
    if (idx >= 0 && idx < exam.questions.length) {
      setCurrentIndex(idx);
      const targetId = exam.questions[idx].id;
      if (!visitedIds.includes(targetId)) {
        setVisitedIds((prev) => [...prev, targetId]);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < exam.questions.length - 1) {
      navigateToQuestion(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigateToQuestion(currentIndex - 1);
    }
  };

  // Final evaluation logic
  const handleFinalSubmit = () => {
    const timeSpent = totalSeconds - secondsRemaining;
    let earnedTotal = 0;
    const questionDetails: QuestionScoreDetail[] = [];
    const topicBreakdown: Record<string, { earned: number; total: number; percentage: number }> = {};

    exam.questions.forEach((q) => {
      let isCorrect = false;
      let scoreEarned = 0;
      let partialRate = 0;

      if (!topicBreakdown[q.topic]) {
        topicBreakdown[q.topic] = { earned: 0, total: 0, percentage: 0 };
      }
      topicBreakdown[q.topic].total += q.points;

      if (q.type === 'coding_challenge') {
        const tr = testResults[q.id];
        if (tr && tr.total > 0) {
          partialRate = tr.passed / tr.total;
          scoreEarned = Math.round(q.points * partialRate);
          isCorrect = tr.passed === tr.total;
        }
      } else {
        const userSelected = selectedAnswers[q.id] || [];
        const correctAnswers = q.correctAnswers || [];
        
        // Exact match comparison
        if (
          userSelected.length === correctAnswers.length &&
          userSelected.every((val, i) => val === correctAnswers[i])
        ) {
          isCorrect = true;
          scoreEarned = q.points;
        } else if (userSelected.length > 0 && exam.negativeMarking) {
          // Negative marking penalty: deduct 25% of points for incorrect guess
          scoreEarned = -Math.round(q.points * 0.25);
        }
      }

      earnedTotal += scoreEarned;
      topicBreakdown[q.topic].earned += Math.max(0, scoreEarned);

      questionDetails.push({
        questionId: q.id,
        isCorrect,
        userAnswer: selectedAnswers[q.id],
        userCode: codeSubmissions[q.id],
        scoreEarned,
        maxPoints: q.points,
        partialPassRate: partialRate,
      });
    });

    earnedTotal = Math.max(0, earnedTotal);
    const percentage = Math.round((earnedTotal / exam.totalMarks) * 100);
    const passed = percentage >= exam.passingScorePercent;

    // Calculate percentage per topic
    Object.keys(topicBreakdown).forEach((top) => {
      const t = topicBreakdown[top];
      t.percentage = t.total > 0 ? Math.round((t.earned / t.total) * 100) : 0;
    });

    const certId = passed ? generateVerificationHash(exam.id, candidate.candidateId, percentage) : undefined;

    const result: ExamResult = {
      id: 'res-' + Date.now(),
      examId: exam.id,
      examTitle: exam.title,
      candidate,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
      totalScore: earnedTotal,
      maxScore: exam.totalMarks,
      percentage,
      passed,
      passingPercentage: exam.passingScorePercent,
      topicBreakdown,
      questionDetails,
      incidents,
      certificateId: certId,
    };

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    onFinishExam(result);
  };

  // Formatted Timer string
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = secondsRemaining <= 60;
  const isTimeWarning = secondsRemaining <= 300 && !isTimeCritical;

  const isCurrentFlagged = flaggedIds.includes(currentQuestion.id);

  // Status counts for palette
  const answeredCount = Object.keys(selectedAnswers).length + 
    Object.keys(testResults).filter((k) => testResults[k].passed > 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Distraction-Free Proctored Top Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-xs">
            {exam.title}
          </span>
          <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Candidate: {candidate.fullName}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Realtime Countdown Timer */}
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1 font-mono text-xs font-semibold tabular-nums border transition-colors ${
              isTimeCritical
                ? 'border-rose-500 bg-rose-500/20 text-rose-300 animate-pulse'
                : isTimeWarning
                ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-slate-950 text-cyan-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeFormatted}</span>
          </div>

          {/* Tools */}
          {exam.allowCalculator && (
            <button
              onClick={() => setShowCalculator(true)}
              title="Open Scratchpad Calculator"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors"
            >
              <Calculator className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowScratchpad(true)}
            title="Open Rough Notes Scratchpad"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors hidden sm:flex"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Proctor Incident Badge */}
          {incidents.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-xs text-rose-400 font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{incidents.length} alert{incidents.length > 1 ? 's' : ''}</span>
            </div>
          )}

          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish Exam</span>
          </button>
        </div>
      </header>

      {/* Main Testing Viewport Split */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Canvas */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 min-h-[620px]">
          <QuestionViewer
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={exam.questions.length}
            selectedAnswers={selectedAnswers[currentQuestion.id] || []}
            onSelectOption={handleSelectOption}
            userCode={codeSubmissions[currentQuestion.id] ?? currentQuestion.initialCode ?? ''}
            onChangeUserCode={(code) => setCodeSubmissions((prev) => ({ ...prev, [currentQuestion.id]: code }))}
            onCodeTestRun={(res) => setTestResults((prev) => ({ ...prev, [currentQuestion.id]: res }))}
            lastTestResults={testResults[currentQuestion.id]}
          />

          {/* Bottom Action Deck */}
          <div className="pt-8 border-t border-slate-800 mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleClearCurrentResponse}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Response</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  isCurrentFlagged
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-current' : ''}`} />
                <span>{isCurrentFlagged ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>

              {currentIndex < exam.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Review & Submit</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Overview */}
        <div className="lg:col-span-4 space-y-6">
          <QuestionPalette
            questions={exam.questions}
            currentIndex={currentIndex}
            onSelectIndex={navigateToQuestion}
            selectedAnswers={selectedAnswers}
            codeSubmissions={codeSubmissions}
            testResults={testResults}
            flaggedQuestionIds={flaggedIds}
            visitedQuestionIds={visitedIds}
          />

          {/* Quick Integrity & Shortcuts Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2 text-xs">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Proctoring Invariants</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Do not switch tabs, minimize your window, or open devtools. Browser events are
              monitored client-side in real-time.
            </p>
          </div>
        </div>
      </main>

      {/* Auxiliary Modals */}
      <CalculatorModal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />

      <ScratchpadModal
        isOpen={showScratchpad}
        onClose={() => setShowScratchpad(false)}
        notes={scratchpadNotes}
        onChange={handleScratchpadChange}
      />

      <ProctorWarningModal
        isOpen={showProctorWarning}
        onAcknowledge={() => setShowProctorWarning(false)}
        incidents={incidents}
        maxIncidentsAllowed={MAX_INCIDENTS}
      />

      <SubmitConfirmModal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirmSubmit={handleFinalSubmit}
        exam={exam}
        answeredCount={answeredCount}
        flaggedCount={flaggedIds.length}
        unansweredCount={exam.questions.length - answeredCount}
        timeRemainingFormatted={timeFormatted}
      />
    </div>
  );
};
