import React, { useState } from 'react';
import { Student, RubricLevel } from '../../types';
import { sessionStore } from '../../services/sessionStore';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface Props {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const RubricAssessmentView: React.FC<Props> = ({
  students,
  onSelectStudent
}) => {
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');

  const handleLevelChange = (
    studentNo: number,
    criteria: 'ethicalSensitivity' | 'moralReflection' | 'actionCommunity',
    level: RubricLevel
  ) => {
    sessionStore.updateRubric(studentNo, criteria, level);
  };

  // Summary counts
  const total = students.length || 1;
  const guardianCount = students.filter(s => s.rubric.overallRank === '도덕 가디언').length;
  const detectiveCount = students.filter(s => s.rubric.overallRank === '견습 탐정').length;
  const growingCount = students.filter(s => s.rubric.overallRank === '성장 중').length;

  return (
    <div className="space-y-6">
      {/* 2022 Revised Curriculum Standards & Rubric Guide Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>2022 개정 교육과정 초등 4학년 도덕과 [4도03-02] 과정중심평가</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              정보통신윤리 탐구 활동 루브릭 자동 채점 및 교사 확정
            </h2>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed max-w-3xl">
              학생이 수행한 4단계 퀘스트의 텍스트 로그, 솔직 고백, 상호작용 횟수를 기반으로 1차 판정되었습니다. 교사는 학생별 수준을 클릭 한 번으로 자유롭게 수정 확정할 수 있습니다 (HITL).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 text-center min-w-[90px]">
              <div className="text-[11px] text-emerald-400 font-bold">도덕 가디언(상)</div>
              <div className="text-xl font-black text-white">{guardianCount}명</div>
              <div className="text-[10px] text-slate-400">{Math.round((guardianCount / total) * 100)}%</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 text-center min-w-[90px]">
              <div className="text-[11px] text-amber-400 font-bold">견습 탐정(중)</div>
              <div className="text-xl font-black text-white">{detectiveCount}명</div>
              <div className="text-[10px] text-slate-400">{Math.round((detectiveCount / total) * 100)}%</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 text-center min-w-[90px]">
              <div className="text-[11px] text-rose-400 font-bold">성장 중(하)</div>
              <div className="text-xl font-black text-white">{growingCount}명</div>
              <div className="text-[10px] text-slate-400">{Math.round((growingCount / total) * 100)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rubric Criteria Criteria Info Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            1. 윤리적 민감성 (Q1, Q2)
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            • <b>상:</b> 피해자 감정을 공감하고 다각적 파급효과 서술<br />
            • <b>중:</b> 상황의 문제점을 파악하고 표준적 결과 서술<br />
            • <b>하:</b> 단순 장난으로 치부하거나 문제 인식 미흡
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            2. 도덕적 성찰 (Q3)
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            • <b>상:</b> 습관 점검을 솔직히 수행하고 구체적 약점 고백<br />
            • <b>중:</b> 습관 점검 완료, 일반적 반성 서술<br />
            • <b>하:</b> 형식적 체크, 고백 항목 누락
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            3. 실천 및 공동체성 (Q4)
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            • <b>상:</b> 구체적 다짐 작성 및 친구 2명 이상 진정성 있는 격려<br />
            • <b>중:</b> 다짐 작성 완료, 격려 1회 수행<br />
            • <b>하:</b> 다짐 작성이 모호하고 상호작용 미참여
          </p>
        </div>
      </div>

      {/* Student List Rubric Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>학급 학생별 루브릭 평가 매트릭스 (원클릭 수정 가능)</span>
          </h3>
          <span className="text-xs text-slate-500">
            총 {students.length}명 평가 진행 중
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-14 text-center">번호</th>
                <th className="py-3 px-4 w-28">이름</th>
                <th className="py-3 px-4 min-w-[200px]">윤리적 민감성 (Q1, Q2)</th>
                <th className="py-3 px-4 min-w-[200px]">도덕적 성찰 (Q3)</th>
                <th className="py-3 px-4 min-w-[200px]">실천 및 공동체성 (Q4)</th>
                <th className="py-3 px-4 w-28 text-center">종합 판정</th>
                <th className="py-3 px-4 w-20 text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {students.map((s) => {
                return (
                  <tr key={s.studentNo} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {s.studentNo}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      <button
                        onClick={() => onSelectStudent(s)}
                        className="hover:text-indigo-600 cursor-pointer"
                      >
                        {s.name}
                      </button>
                    </td>

                    {/* Criteria 1 */}
                    <td className="py-2.5 px-4">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
                        {(['high', 'mid', 'low'] as RubricLevel[]).map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => handleLevelChange(s.studentNo, 'ethicalSensitivity', lvl)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              s.rubric.ethicalSensitivity === lvl
                                ? lvl === 'high' ? 'bg-emerald-600 text-white shadow-xs' : lvl === 'mid' ? 'bg-amber-600 text-white shadow-xs' : 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {lvl === 'high' ? '상' : lvl === 'mid' ? '중' : '하'}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Criteria 2 */}
                    <td className="py-2.5 px-4">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
                        {(['high', 'mid', 'low'] as RubricLevel[]).map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => handleLevelChange(s.studentNo, 'moralReflection', lvl)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              s.rubric.moralReflection === lvl
                                ? lvl === 'high' ? 'bg-emerald-600 text-white shadow-xs' : lvl === 'mid' ? 'bg-amber-600 text-white shadow-xs' : 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {lvl === 'high' ? '상' : lvl === 'mid' ? '중' : '하'}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Criteria 3 */}
                    <td className="py-2.5 px-4">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
                        {(['high', 'mid', 'low'] as RubricLevel[]).map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => handleLevelChange(s.studentNo, 'actionCommunity', lvl)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              s.rubric.actionCommunity === lvl
                                ? lvl === 'high' ? 'bg-emerald-600 text-white shadow-xs' : lvl === 'mid' ? 'bg-amber-600 text-white shadow-xs' : 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {lvl === 'high' ? '상' : lvl === 'mid' ? '중' : '하'}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Overall Rank */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block font-bold px-2.5 py-1 rounded-full text-xs ${
                        s.rubric.overallRank === '도덕 가디언'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : s.rubric.overallRank === '성장 중'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {s.rubric.overallRank}
                      </span>
                    </td>

                    {/* Drilldown */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectStudent(s)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer underline"
                      >
                        열람
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
