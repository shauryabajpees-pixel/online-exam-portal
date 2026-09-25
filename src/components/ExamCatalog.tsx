import React, { useState } from 'react';
import { Exam } from '../types/exam';
import { Clock, CheckSquare, Award, ArrowRight, ShieldCheck, Terminal, Filter, BookOpen } from 'lucide-react';

interface ExamCatalogProps {
  exams: Exam[];
  onSelectExam: (exam: Exam) => void;
  onOpenStudio: () => void;
  completedExamIds: string[];
}

export const ExamCatalog: React.FC<ExamCatalogProps> = ({
  exams,
  onSelectExam,
  onOpenStudio,
  completedExamIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(exams.map((e) => e.category)))];

  const filteredExams = selectedCategory === 'all'
    ? exams
    : exams.filter((e) => e.category === selectedCategory);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="p-8 sm:p-12 lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Proctored Technical Assessment Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
              Assess JavaScript Competence Under Real Conditions
            </h1>

            <p className="text-base text-slate-300 max-w-xl leading-relaxed">
              Standardized evaluations testing ECMAScript execution contexts, event loop microtasks,
              prototype hierarchies, and live coding challenges with automated browser test assertions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-medium text-slate-200">Active JavaScript Sandbox</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-medium text-slate-200">Tab Focus Tracking</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="font-medium text-slate-200">Verified Credentials</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onSelectExam(exams[0])}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>Launch Benchmark Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenStudio}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Create Custom Exam</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-800">
            <img
              src="/src/assets/images/hero_exam_hall_1790340704668.jpg"
              alt="Digital examination testing terminal"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter saturate-110 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Quantitative Rigor Proof Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-slate-800/80 py-6">
        <div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">40+</div>
          <div className="text-xs text-slate-400 mt-1">Rigorous questions compiled</div>
        </div>
        <div>
          <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400">100% Client-side</div>
          <div className="text-xs text-slate-400 mt-1">Direct V8 engine execution</div>
        </div>
        <div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">0.0 ms</div>
          <div className="text-xs text-slate-400 mt-1">Proctor latency recording</div>
        </div>
        <div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-400">Instant</div>
          <div className="text-xs text-slate-400 mt-1">Certificate generation</div>
        </div>
      </section>

      {/* Exam Listings Header & Segmented Controls */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Available Examinations</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select an assessment to initiate proctored environment verification.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Assessments' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const isCompleted = completedExamIds.includes(exam.id);
            const codingCount = exam.questions.filter((q) => q.type === 'coding_challenge').length;

            return (
              <div
                key={exam.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 shadow-sm"
              >
                <div className="space-y-4">
                  {/* Clean unboxed category header */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
                      {exam.category}
                    </span>
                    {isCompleted ? (
                      <span className="text-emerald-400 font-medium">Completed</span>
                    ) : (
                      <span className="text-slate-500 font-mono">{exam.durationMinutes}m test</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {exam.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {exam.description}
                    </p>
                  </div>

                  {/* Clean Unboxed Metadata with Typographic Separator */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono tabular-nums pt-1 border-t border-slate-800/80">
                    <span>{exam.questions.length} questions</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{exam.totalMarks} total marks</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{exam.passingScorePercent}% pass</span>
                    {codingCount > 0 && (
                      <>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-indigo-400 font-sans">{codingCount} live coding</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onSelectExam(exam)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 px-4 text-xs font-semibold text-white group-hover:border-cyan-500/50 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all"
                  >
                    <span>{isCompleted ? 'Retake Examination' : 'Start Examination'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
