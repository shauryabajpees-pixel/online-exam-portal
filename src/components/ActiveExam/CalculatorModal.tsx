import React, { useState } from 'react';
import { Calculator as CalcIcon, X, Delete } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [clearOnNext, setClearOnNext] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (display === '0' || clearOnNext) {
      setDisplay(digit);
      setClearOnNext(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDecimal = () => {
    if (clearOnNext) {
      setDisplay('0.');
      setClearOnNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOp = (op: string) => {
    const current = parseFloat(display);
    if (memory !== null && operation && !clearOnNext) {
      const res = calculate(memory, current, operation);
      setMemory(res);
      setDisplay(String(res));
    } else {
      setMemory(current);
    }
    setOperation(op);
    setClearOnNext(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      case '%': return a % b;
      case '^': return Math.pow(a, b);
      default: return b;
    }
  };

  const handleEquals = () => {
    if (memory !== null && operation) {
      const current = parseFloat(display);
      const res = calculate(memory, current, operation);
      setDisplay(String(Number(res.toFixed(8))));
      setMemory(null);
      setOperation(null);
      setClearOnNext(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setMemory(null);
    setOperation(null);
    setClearOnNext(false);
  };

  const handleSqrt = () => {
    const val = parseFloat(display);
    if (val >= 0) {
      setDisplay(String(Number(Math.sqrt(val).toFixed(8))));
      setClearOnNext(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-80 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <CalcIcon className="w-4 h-4 text-cyan-400" />
            <span>Scratchpad Calculator</span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-right">
          <div className="text-[10px] text-slate-500 font-mono h-4">
            {memory !== null && operation ? `${memory} ${operation}` : ''}
          </div>
          <div className="text-2xl font-mono tabular-nums text-white truncate font-medium">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-1.5 text-xs font-mono font-medium">
          <button onClick={handleClear} className="py-2.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">C</button>
          <button onClick={handleSqrt} className="py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">√</button>
          <button onClick={() => handleOp('%')} className="py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">%</button>
          <button onClick={() => handleOp('÷')} className="py-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">÷</button>

          <button onClick={() => handleDigit('7')} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">7</button>
          <button onClick={() => handleDigit('8')} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">8</button>
          <button onClick={() => handleDigit('9')} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">9</button>
          <button onClick={() => handleOp('×')} className="py-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">×</button>

          <button onClick={() => handleDigit('4')} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">4</button>
          <button onClick={() => handleDigit('5')} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">5</button>
          <button onClick={() => handleDigit('6')} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">6</button>
          <button onClick={() => handleOp('-')} className="py-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">-</button>

          <button onClick={() => handleDigit('1')} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">1</button>
          <button onClick={() => handleDigit('2')} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">2</button>
          <button onClick={() => handleDigit('3')} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">3</button>
          <button onClick={() => handleOp('+')} className="py-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">+</button>

          <button onClick={() => handleDigit('0')} className="py-2.5 col-span-2 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">0</button>
          <button onClick={handleDecimal} className="py-2.5 rounded-lg bg-slate-800/80 text-white hover:bg-slate-700">.</button>
          <button onClick={handleEquals} className="py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400">=</button>
        </div>
      </div>
    </div>
  );
};
