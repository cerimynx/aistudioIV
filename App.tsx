
import React, { useState } from 'react';
import { UserRole, DiseaseType, AssessmentResult } from './types';
import { APP_NAME, MEDICAL_DISCLAIMER } from './constants';
import AssessmentForm from './components/AssessmentForm';
import ResultDisplay from './components/ResultDisplay';
import { performAssessment } from './services/geminiService';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [disease, setDisease] = useState<DiseaseType>(DiseaseType.DIABETES);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssessment = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await performAssessment(role, disease, data);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "系統發生錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = () => {
    const newRole = role === UserRole.PATIENT ? UserRole.DOCTOR : UserRole.PATIENT;
    setRole(newRole);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">{APP_NAME}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRoleToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${
                role === UserRole.DOCTOR 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              <i className={`fas ${role === UserRole.DOCTOR ? 'fa-user-md' : 'fa-user'}`}></i>
              {role === UserRole.DOCTOR ? '醫師模式 (Doctor Mode)' : '患者模式 (Patient Mode)'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 md:py-12">
        {/* Intro */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            {role === UserRole.DOCTOR ? '臨床輔助診斷系統' : '您的 AI 健康守護家'}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            透過最先進的 AI 模型，結合臨床實證與醫學規則，為您提供即時、準確的慢性病風險評估與建議。
          </p>
        </div>

        {/* Disease Selector */}
        <div className="flex justify-center gap-4 mb-10">
          {[DiseaseType.DIABETES, DiseaseType.HYPERTENSION].map(d => (
            <button
              key={d}
              onClick={() => { setDisease(d); setResult(null); }}
              className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                disease === d 
                ? 'bg-slate-900 text-white shadow-xl' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {d === DiseaseType.DIABETES ? '糖尿病 (Diabetes)' : '高血壓 (Hypertension)'}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {!result ? (
            <AssessmentForm 
              role={role} 
              disease={disease} 
              isLoading={loading}
              onSubmit={handleAssessment} 
            />
          ) : (
            <ResultDisplay 
              result={result} 
              role={role} 
              onReset={() => setResult(null)} 
            />
          )}
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-200">
          <p className="text-amber-800 text-sm md:text-base font-medium text-center">
            {MEDICAL_DISCLAIMER}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">使用條款</a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">隱私權政策</a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">聯絡我們</a>
          </div>
          <p className="text-slate-400 text-sm">
            &copy; 2024 {APP_NAME}. All rights reserved. Powered by Advanced AI reasoning.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
