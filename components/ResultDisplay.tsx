
import React from 'react';
import { AssessmentResult, UserRole } from '../types';

interface Props {
  result: AssessmentResult;
  role: UserRole;
  onReset: () => void;
}

const ResultDisplay: React.FC<Props> = ({ result, role, onReset }) => {
  const getRiskColor = (level: string) => {
    switch(level) {
      case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const isDoctor = role === UserRole.DOCTOR;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className={`p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center gap-6 ${getRiskColor(result.riskLevel)}`}>
        <div className="text-center md:text-left flex-1">
          <span className="text-sm font-bold uppercase tracking-wider opacity-70">評估風險等級</span>
          <h2 className="text-4xl font-black">{result.riskLevel}</h2>
        </div>
        <p className="flex-[2] text-lg font-medium leading-relaxed italic">
          "{result.summary}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-lightbulb text-yellow-500"></i> 健康建議
          </h3>
          <ul className="space-y-3">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex gap-3 text-slate-600">
                <span className="text-blue-500 font-bold">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {isDoctor && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <i className="fas fa-notes-medical text-emerald-500"></i> 鑑別診斷與後續建議
            </h3>
            {result.differentials && (
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase">可能之診斷 (Differential DX)</h4>
                <div className="flex flex-wrap gap-2">
                  {result.differentials.map(d => (
                    <span key={d} className="px-3 py-1 bg-slate-100 rounded text-sm text-slate-700 font-medium">{d}</span>
                  ))}
                </div>
              </div>
            )}
            {result.furtherTests && (
              <div>
                <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase">建議進一步檢查</h4>
                <div className="space-y-2">
                  {result.furtherTests.map((t, i) => (
                    <div key={i} className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="font-bold text-emerald-900">{t.test}</div>
                      <div className="text-sm text-emerald-700">{t.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-lg"
        >
          重新測算
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
