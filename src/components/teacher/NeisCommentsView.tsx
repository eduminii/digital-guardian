import React, { useState } from 'react';
import { Student } from '../../types';
import { sessionStore } from '../../services/sessionStore';
import { generateNeisComment } from '../../data/initialData';
import {
  FileText,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Edit3,
  Download
} from 'lucide-react';

interface Props {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const NeisCommentsView: React.FC<Props> = ({ students, onSelectStudent }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copyAllSuccess, setCopyAllSuccess] = useState(false);
  const [editingStudentNo, setEditingStudentNo] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const handleCopySingle = (studentNo: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(studentNo);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const formatted = students
      .map(s => `[${s.studentNo}번 ${s.name}]\n${s.neisComment || generateNeisComment(s)}`)
      .join('\n\n');
    navigator.clipboard.writeText(formatted);
    setCopyAllSuccess(true);
    setTimeout(() => setCopyAllSuccess(false), 2500);
  };

  const handleStartEdit = (s: Student) => {
    setEditingStudentNo(s.studentNo);
    setEditText(s.neisComment || generateNeisComment(s));
  };

  const handleSaveEdit = (studentNo: number) => {
    sessionStore.updateNeisComment(studentNo, editText);
    setEditingStudentNo(null);
  };

  const handleRegenerate = (studentNo: number) => {
    const s = students.find(st => st.studentNo === studentNo);
    if (!s) return;
    const freshlyGenerated = generateNeisComment(s);
    sessionStore.updateNeisComment(studentNo, freshlyGenerated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold mb-1">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>나이스(NEIS) 학교생활기록부 교과세특 및 창체 평어 자동 완성</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              학생 실제 성찰 키워드 기반 생활기록부 문장 생성기
            </h2>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed max-w-3xl">
              학생들이 입력한 딜레마 가치 선택, 고치고 싶은 습관, 수호자 다짐 문장을 2022 개정 도덕과 [4도03-02] 성취기준 표준 문형에 자연스럽게 융합했습니다. 최종 편집권은 항상 교사에게 있습니다 (HITL).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              {copyAllSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>전체 24명 복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-950" />
                  <span>학급 전체 나이스 평어 일괄 복사</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {students.map((s) => {
          const isEditing = editingStudentNo === s.studentNo;
          const comment = s.neisComment || generateNeisComment(s);

          return (
            <div
              key={s.studentNo}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {s.studentNo}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    s.rubric.overallRank === '도덕 가디언'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.rubric.overallRank === '성장 중'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.rubric.overallRank}
                  </span>
                  {s.q3.honestHabitToFix && (
                    <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 hidden sm:inline">
                      성찰 키워드 연계됨
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRegenerate(s.studentNo)}
                    title="초기 템플릿 문장으로 다시 생성"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">초기화</span>
                  </button>

                  {isEditing ? (
                    <button
                      onClick={() => handleSaveEdit(s.studentNo)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      저장 완료
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(s)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>수정</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopySingle(s.studentNo, comment)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedId === s.studentNo ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">복사됨!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Comment Content / Editor */}
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none leading-relaxed text-slate-800 font-medium"
                  />
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      onClick={() => setEditingStudentNo(null)}
                      className="px-3 py-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSaveEdit(s.studentNo)}
                      className="px-3 py-1 rounded-lg bg-teal-600 text-white font-bold cursor-pointer"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-150">
                  {comment}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
