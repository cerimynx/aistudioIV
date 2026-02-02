
import React, { useState } from 'react';
import { UserRole, DiseaseType, PatientProfile, ClinicalData } from '../types';
import { SYMPTOM_OPTIONS, LIFESTYLE_OPTIONS } from '../constants';

interface Props {
  role: UserRole;
  disease: DiseaseType;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const AssessmentForm: React.FC<Props> = ({ role, disease, onSubmit, isLoading }) => {
  const [patientData, setPatientData] = useState<PatientProfile>({
    age: '', gender: 'Male', height: '', weight: '', symptoms: [], lifestyle: 'Sedentary'
  });

  const [clinicalData, setClinicalData] = useState<ClinicalData>({});

  const handleSymptomToggle = (symptom: string) => {
    setPatientData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom) 
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(role === UserRole.DOCTOR ? { ...patientData, ...clinicalData } : patientData);
  };

  const isDoctor = role === UserRole.DOCTOR;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            <i className="fas fa-user-circle"></i> 基本資料
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">年齡</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={patientData.age}
                onChange={e => setPatientData({...patientData, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">性別</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={patientData.gender}
                onChange={e => setPatientData({...patientData, gender: e.target.value})}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">身高 (cm)</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={patientData.height}
                onChange={e => setPatientData({...patientData, height: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">體重 (kg)</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={patientData.weight}
                onChange={e => setPatientData({...patientData, weight: e.target.value})}
              />
            </div>
          </div>
        </section>

        {isDoctor && (
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
              <i className="fas fa-stethoscope"></i> 臨床指標 (醫師填寫)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">HbA1c (%)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 6.5"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={clinicalData.hba1c || ''}
                  onChange={e => setClinicalData({...clinicalData, hba1c: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">血糖 (mg/dL)</label>
                <input 
                  type="text" 
                  placeholder="Fasting/Random"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={clinicalData.glucose || ''}
                  onChange={e => setClinicalData({...clinicalData, glucose: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">血壓 (Systolic / Diastolic)</label>
                <div className="flex items-center gap-2">
                   <input 
                    type="text" 
                    placeholder="120"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={clinicalData.bloodPressureSys || ''}
                    onChange={e => setClinicalData({...clinicalData, bloodPressureSys: e.target.value})}
                  />
                  <span>/</span>
                   <input 
                    type="text" 
                    placeholder="80"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={clinicalData.bloodPressureDia || ''}
                    onChange={e => setClinicalData({...clinicalData, bloodPressureDia: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">自覺症狀與生活習慣</h3>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_OPTIONS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => handleSymptomToggle(s)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                patientData.symptoms.includes(s) 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg ${
          isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <i className="fas fa-circle-notch animate-spin"></i> 正在進行 AI 分析...
          </span>
        ) : '開始健康評估'}
      </button>
    </form>
  );
};

export default AssessmentForm;
