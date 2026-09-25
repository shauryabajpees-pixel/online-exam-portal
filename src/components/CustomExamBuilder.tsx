import React, { useState } from 'react';
import { Exam, Question, QuestionType, DifficultyLevel } from '../types/exam';
import { saveCustomExam } from '../utils/storage';
import { Plus, Trash2, Save, Download, Upload, CheckCircle2, ArrowLeft, Code2 } from 'lucide-react';

interface CustomExamBuilderProps {
  onBack: () => void;
  onExamCreated: (exam: Exam) => void;
}

export const CustomExamBuilder: React.FC<CustomExamBuilderProps> = ({ onBack, onExamCreated }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('JavaScript Custom');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [passingScorePercent, setPassingScorePercent] = useState(70);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [allowCalculator, setAllowCalculator] = useState(false);
  const [badgeTitle, setBadgeTitle] = useState('Certified JavaScript Specialist');

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'custom-q1',
      topic: 'JavaScript Fundamentals',
      type: 'single_choice',
      difficulty: 'Intermediate',
      prompt: 'What is the output of typeof null in JavaScript?',
      options: ['"null"', '"object"', '"undefined"', '"number"'],
      correctAnswers: [1],
      explanation: 'In the original JavaScript implementation, values were represented as a type tag and a value. Because the type tag for objects was 0 and null was represented as the NULL pointer (0x00 in most platforms), typeof null erroneously returns "object".',
      points: 5,
    }
  ]);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const addQuestion = () => {
    const newQ: Question = {
      id: 'custom-q' + (questions.length + 1) + '-' + Date.now(),
      topic: 'Core Concepts',
      type: 'single_choice',
      difficulty: 'Intermediate',
      prompt: 'New Question Prompt',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswers: [0],
      explanation: 'Detailed technical explanation of the correct choice.',
      points: 5,
    };
    setQuestions([...questions, newQ]);
    setActiveQuestionIndex(questions.length);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('An examination must have at least 1 question.');
      return;
    }
    const updated = questions.filter((_, i) => i !== idx);
    setQuestions(updated);
    setActiveQuestionIndex(Math.max(0, idx - 1));
  };

  const updateCurrentQuestion = (updated: Partial<Question>) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[activeQuestionIndex] = { ...copy[activeQuestionIndex], ...updated };
      return copy;
    });
  };

  const handleSaveExam = () => {
    if (!title.trim()) {
      alert('Please enter an exam title.');
      return;
    }

    const totalMarks = questions.reduce((acc, q) => acc + q.points, 0);

    const newExam: Exam = {
      id: 'custom-exam-' + Date.now(),
      title,
      category,
      description: description || 'Custom instructor-crafted assessment.',
      durationMinutes,
      passingScorePercent,
      totalMarks,
      negativeMarking,
      allowCalculator,
      badgeTitle: badgeTitle || 'Custom Certificate Holder',
      createdAt: new Date().toISOString(),
      questions,
    };

    saveCustomExam(newExam);
    onExamCreated(newExam);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${title.replace(/\s+/g, '_') || 'exam'}_questions.json`);
    dlAnchor.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported) && imported.length > 0) {
          setQuestions(imported);
          setActiveQuestionIndex(0);
          alert(`Successfully imported ${imported.length} questions!`);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const currQ = questions[activeQuestionIndex];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Exam Studio & Assessment Authoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author and configure custom JavaScript assessments with automatic client-side test runners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleSaveExam}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Publish Exam</span>
          </button>
        </div>
      </div>

      {/* Exam Global Configuration */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          General Exam Invariants
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Exam Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Architecture Assessment"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Architecture"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Overview of syllabus, evaluation criteria, and candidate instructions..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Duration (Minutes)
            </label>
            <input
              type="number"
              min={5}
              max={180}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Passing Benchmark (%)
            </label>
            <input
              type="number"
              min={10}
              max={100}
              value={passingScorePercent}
              onChange={(e) => setPassingScorePercent(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-emerald-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500"
              />
              <span>Negative Marking (-25%)</span>
            </label>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={allowCalculator}
                onChange={(e) => setAllowCalculator(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500"
              />
              <span>Enable Calculator</span>
            </label>
          </div>
        </div>
      </section>

      {/* Question Editor Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question List Sidebar */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Questions ({questions.length})
            </span>
            <button
              onClick={addQuestion}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-[450px] overflow-y-auto pr-1">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-colors ${
                  activeQuestionIndex === idx
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="truncate flex-1 pr-2">
                  <span className="font-mono font-bold text-slate-500 mr-2">#{idx + 1}</span>
                  <span>{q.prompt || 'Untitled Question'}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{q.points}pts</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Question Detail Form */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Editing Question #{activeQuestionIndex + 1}
            </span>
            <button
              onClick={() => removeQuestion(activeQuestionIndex)}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Question</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Topic</label>
              <input
                type="text"
                value={currQ.topic}
                onChange={(e) => updateCurrentQuestion({ topic: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Question Type</label>
              <select
                value={currQ.type}
                onChange={(e) => updateCurrentQuestion({ type: e.target.value as QuestionType })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="single_choice">Single Choice</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="code_snippet">Code Analysis</option>
                <option value="coding_challenge">Coding Sandbox Challenge</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Marks / Points</label>
              <input
                type="number"
                min={1}
                max={50}
                value={currQ.points}
                onChange={(e) => updateCurrentQuestion({ points: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Prompt / Problem Statement</label>
            <textarea
              value={currQ.prompt}
              onChange={(e) => updateCurrentQuestion({ prompt: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Optional Code Snippet */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Code Snippet for Analysis (Optional)
            </label>
            <textarea
              value={currQ.codeSnippet || ''}
              onChange={(e) => updateCurrentQuestion({ codeSnippet: e.target.value })}
              rows={4}
              placeholder="// Paste JavaScript code snippet here"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs font-mono text-cyan-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Options for MCQ */}
          {currQ.type !== 'coding_challenge' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Options & Correct Answer
              </label>
              {(currQ.options || []).map((opt, oIdx) => {
                const isCorrect = (currQ.correctAnswers || []).includes(oIdx);
                const letter = String.fromCharCode(65 + oIdx);

                return (
                  <div key={oIdx} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = currQ.type === 'multiple_choice'
                          ? isCorrect
                            ? (currQ.correctAnswers || []).filter((i) => i !== oIdx)
                            : [...(currQ.correctAnswers || []), oIdx]
                          : [oIdx];
                        updateCurrentQuestion({ correctAnswers: updated });
                      }}
                      className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        isCorrect
                          ? 'bg-emerald-500 text-slate-950'
                          : 'border border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                      title={isCorrect ? 'Marked as correct' : 'Click to set as correct answer'}
                    >
                      {letter}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const copy = [...(currQ.options || [])];
                        copy[oIdx] = e.target.value;
                        updateCurrentQuestion({ options: copy });
                      }}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Solution Explanation */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Detailed Solution & Specification Explanation
            </label>
            <textarea
              value={currQ.explanation}
              onChange={(e) => updateCurrentQuestion({ explanation: e.target.value })}
              rows={3}
              placeholder="Explain why the answer is correct according to the ECMAScript spec..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
