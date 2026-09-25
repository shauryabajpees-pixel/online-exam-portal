import React, { useState, useEffect } from 'react';
import { Exam, ExamResult, CandidateInfo, ExamSessionState } from './types/exam';
import { 
  getAllExams, getExamResults, saveExamResult, getCandidateInfo, 
  saveCandidateInfo, getActiveSession, clearActiveSession, getExamById 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { ExamCatalog } from './components/ExamCatalog';
import { CandidateModal } from './components/CandidateModal';
import { ActiveExamView } from './components/ActiveExam/ActiveExamView';
import { ResultDashboard } from './components/ExamResult/ResultDashboard';
import { SolutionReview } from './components/ExamResult/SolutionReview';
import { CustomExamBuilder } from './components/CustomExamBuilder';
import { ExamHistory } from './components/ExamHistory';

type AppView = 'catalog' | 'active_exam' | 'results' | 'solution_review' | 'history' | 'builder';

export default function App() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [candidate, setCandidate] = useState<CandidateInfo>(getCandidateInfo());
  const [currentView, setCurrentView] = useState<AppView>('catalog');
  
  // Selected Exam / Result States
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [activeResult, setActiveResult] = useState<ExamResult | null>(null);
  
  // Modals
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [examToStartAfterVerify, setExamToStartAfterVerify] = useState<Exam | null>(null);
  const [activeSession, setActiveSession] = useState<ExamSessionState | null>(null);

  // Initialize data on mount
  useEffect(() => {
    refreshData();
    const existingSession = getActiveSession();
    if (existingSession && !existingSession.isSubmitted) {
      setActiveSession(existingSession);
    }
  }, []);

  const refreshData = () => {
    setExams(getAllExams());
    setResults(getExamResults());
  };

  // When user clicks "Start Exam" on catalog card
  const handleSelectExamForStart = (exam: Exam) => {
    setExamToStartAfterVerify(exam);
    setIsCandidateModalOpen(true);
  };

  // When candidate confirms readiness in modal
  const handleConfirmStartExam = () => {
    if (!examToStartAfterVerify) return;
    setSelectedExam(examToStartAfterVerify);
    setExamToStartAfterVerify(null);
    setIsCandidateModalOpen(false);
    setCurrentView('active_exam');
  };

  // Resume active unsubmitted session if available
  const handleResumeActiveSession = () => {
    if (!activeSession) return;
    const exam = getExamById(activeSession.examId);
    if (exam) {
      setSelectedExam(exam);
      setCurrentView('active_exam');
    }
  };

  // On Exam completion
  const handleFinishExam = (result: ExamResult) => {
    saveExamResult(result);
    setActiveResult(result);
    setActiveSession(null);
    refreshData();
    setCurrentView('results');
  };

  const handleRetakeExam = () => {
    if (!selectedExam && activeResult) {
      const exam = getExamById(activeResult.examId);
      if (exam) setSelectedExam(exam);
    }
    setCurrentView('active_exam');
  };

  const handleClearAllHistory = () => {
    localStorage.removeItem('evalscript_exam_results');
    setResults([]);
  };

  const completedExamIds = results.map((r) => r.examId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Bar Contract (hidden during active exam for proctoring discipline) */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'catalog') setSelectedExam(null);
          setCurrentView(view);
        }}
        candidate={candidate}
        onEditCandidate={() => setIsCandidateModalOpen(true)}
        hasActiveSession={Boolean(activeSession)}
        onResumeSession={handleResumeActiveSession}
      />

      {/* Main View Area */}
      <div className="flex-1 w-full">
        {currentView === 'catalog' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <ExamCatalog
              exams={exams}
              onSelectExam={handleSelectExamForStart}
              onOpenStudio={() => setCurrentView('builder')}
              completedExamIds={completedExamIds}
            />
          </main>
        )}

        {currentView === 'active_exam' && selectedExam && (
          <ActiveExamView
            exam={selectedExam}
            candidate={candidate}
            onFinishExam={handleFinishExam}
            onExitWithoutSaving={() => {
              clearActiveSession();
              setActiveSession(null);
              setCurrentView('catalog');
            }}
          />
        )}

        {currentView === 'results' && activeResult && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <ResultDashboard
              exam={selectedExam || getExamById(activeResult.examId)!}
              result={activeResult}
              onRetake={handleRetakeExam}
              onReturnToCatalog={() => {
                setSelectedExam(null);
                setCurrentView('catalog');
              }}
              onOpenDetailedReview={() => setCurrentView('solution_review')}
            />
          </main>
        )}

        {currentView === 'solution_review' && activeResult && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <SolutionReview
              exam={selectedExam || getExamById(activeResult.examId)!}
              result={activeResult}
              onBackToScorecard={() => setCurrentView('results')}
            />
          </main>
        )}

        {currentView === 'history' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <ExamHistory
              results={results}
              onSelectResult={(res) => {
                setActiveResult(res);
                setSelectedExam(getExamById(res.examId) || null);
                setCurrentView('results');
              }}
              onNavigateToCatalog={() => setCurrentView('catalog')}
              onClearHistory={handleClearAllHistory}
            />
          </main>
        )}

        {currentView === 'builder' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <CustomExamBuilder
              onBack={() => setCurrentView('catalog')}
              onExamCreated={(newExam) => {
                refreshData();
                setSelectedExam(newExam);
                setCurrentView('catalog');
              }}
            />
          </main>
        )}
      </div>

      {/* Pre-Exam Hall Ticket / Candidate Profile Modal */}
      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => {
          setIsCandidateModalOpen(false);
          setExamToStartAfterVerify(null);
        }}
        candidate={candidate}
        onSave={(updated) => {
          setCandidate(updated);
          saveCandidateInfo(updated);
        }}
        examToStart={examToStartAfterVerify}
        onConfirmStart={handleConfirmStartExam}
      />

      {/* Footer (hidden during active proctored exam) */}
      {currentView !== 'active_exam' && (
        <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">EvalScript</span>
              <span>· Professional JavaScript Examination Engine</span>
            </div>
            <div className="font-mono text-slate-600">
              ECMAScript 2026 Sandbox Ready
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
