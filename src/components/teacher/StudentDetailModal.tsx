import React from 'react';
import { Student, RubricLevel } from '../../types';
import { sessionStore } from '../../services/sessionStore';
import {
  X,
  Star,
  Shield,
  MessageCircle,
  Search,
  BatteryCharging,
  Heart,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface Props {
  student: Student;
  onClose: () => void;
  onAwardStamp: (studentNo: number) => void;
}

export const StudentDetailModal: React.FC<Props> = ({
  student,
  onClose,
  onAwardStamp
}) => {
  const handleRubricChange = (
    criteria: 'ethicalSensitivity' | 'moralReflection' | 'actionCommunity',
    level: RubricLevel
  ) => {
    sessionStore.updateRubric(student.studentNo, criteria, level);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">
              {student.studentNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{student.name}</h3>
                <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  Lv.{student.level} • EXP {student.exp}pt
                </span>
                {student.needsHelp && (
                  <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/40 animate-pulse">
                    🚨 도움 요청 중
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                진행도: {student.progressPercent}% | 현재 위치: Quest {student.currentQuest}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* GM Action: Golden Stamp button */}
            <button
              onClick={() => onAwardStamp(student.studentNo)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              <span>골든 스탬프 (+1)</span>
              <span className="bg-slate-950/20 px-1.5 py-0.5 rounded-md text-[10px]">
                보유 {student.goldenStamps || 0}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {/* Help message if stuck */}
          {student.needsHelp && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-rose-900">학생 도움 요청 메시지</div>
                <div className="text-sm text-rose-800 mt-0.5">
                  {student.helpMessage || '선생님, 퀘스트 해결에 도움이 필요해요!'}
                </div>
              </div>
            </div>
          )}

          {/* Q1 Artifact */}
          <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  Q1 위기의 단톡방
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {student.q1.choiceTitle ? `선택 [${student.q1.choice}] ${student.q1.choiceTitle}` : '미작성'}
                </span>
              </div>
              {student.q1.completedAt && (
                <span className="text-[11px] text-slate-400">{student.q1.completedAt} 완료</span>
              )}
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                행동 결과 예측 및 이유:
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {student.q1.consequenceReason || '아직 답변이 작성되지 않았습니다.'}
              </p>
            </div>
          </div>

          {/* Q2 Artifact */}
          <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  Q2 탐정 돋보기
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  피해자 감정 공감 & 마법의 한마디
                </span>
              </div>
              {student.q2.completedAt && (
                <span className="text-[11px] text-slate-400">{student.q2.completedAt} 완료</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(student.q2.emotionCards || []).length > 0 ? (
                student.q2.emotionCards.map((em, idx) => (
                  <span key={idx} className="bg-teal-50 border border-teal-200 text-teal-800 text-xs px-2.5 py-1 rounded-full font-medium">
                    {em}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">선택된 감정 카드 없음</span>
              )}
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                마법의 한마디 (대안 멘트):
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {student.q2.magicSentence ? `“${student.q2.magicSentence}”` : '미작성'}
              </p>
            </div>
          </div>

          {/* Q3 Artifact */}
          <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  Q3 배터리 자가진단
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  디지털 배터리: {student.q3.batteryPercentage ?? 100}%
                </span>
              </div>
              {student.q3.completedAt && (
                <span className="text-[11px] text-slate-400">{student.q3.completedAt} 완료</span>
              )}
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200 bg-amber-50/50">
              <span className="text-xs font-bold text-amber-900 block mb-1">
                ⭐ 가장 고치고 싶은 나의 디지털 습관 (솔직 고백):
              </span>
              <p className="text-slate-900 font-semibold leading-relaxed">
                {student.q3.honestHabitToFix || '아직 고백란이 작성되지 않았습니다.'}
              </p>
            </div>
          </div>

          {/* Q4 Artifact */}
          <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  Q4 수호자 다짐 & 버프
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  실천 다짐 및 상호작용
                </span>
              </div>
              {student.q4.completedAt && (
                <span className="text-[11px] text-slate-400">{student.q4.completedAt} 완료</span>
              )}
            </div>
            <div className="bg-white p-3 rounded-xl border border-purple-200 bg-purple-50/40">
              <span className="text-xs font-bold text-purple-900 block mb-1">
                수호자 서약 문장:
              </span>
              <p className="text-slate-900 font-semibold leading-relaxed">
                {student.q4.guardianPledge || '미서약'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1.5">
                  보낸 버프 ({student.q4.sentBuffs.length}개)
                </span>
                {student.q4.sentBuffs.map(b => (
                  <div key={b.id} className="text-slate-600 mb-1">
                    • {b.toStudentNo}번에게 [{b.sticker}] “{b.comment}”
                  </div>
                ))}
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1.5">
                  받은 버프 ({student.q4.receivedBuffs.length}개)
                </span>
                {student.q4.receivedBuffs.map(b => (
                  <div key={b.id} className="text-slate-600 mb-1">
                    • {b.fromStudentName}님에게 [{b.sticker}] “{b.comment}”
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick HITL Rubric Rating */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>과정중심평가 즉시 채점 (HITL 교사 수정 가능)</span>
              </h4>
              <span className="text-xs bg-slate-100 font-bold px-2.5 py-1 rounded-full text-slate-700">
                종합: {student.rubric.overallRank}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'ethicalSensitivity' as const, label: '윤리적 민감성' },
                { key: 'moralReflection' as const, label: '도덕적 성찰' },
                { key: 'actionCommunity' as const, label: '실천 및 공동체성' }
              ].map(({ key, label }) => {
                const current = student.rubric[key];
                return (
                  <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 mb-1.5">{label}</div>
                    <div className="grid grid-cols-3 gap-1">
                      {(['high', 'mid', 'low'] as RubricLevel[]).map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => handleRubricChange(key, lvl)}
                          className={`py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            current === lvl
                              ? lvl === 'high' ? 'bg-emerald-600 text-white' : lvl === 'mid' ? 'bg-amber-600 text-white' : 'bg-slate-600 text-white'
                              : 'bg-white text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {lvl === 'high' ? '상' : lvl === 'mid' ? '중' : '하'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
