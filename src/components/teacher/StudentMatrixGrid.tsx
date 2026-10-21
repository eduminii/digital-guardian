import React, { useState } from 'react';
import { Student, TileStatus } from '../../types';
import {
  Star,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  ChevronRight,
  LifeBuoy
} from 'lucide-react';

interface Props {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onAwardStamp: (studentNo: number) => void;
}

export const StudentMatrixGrid: React.FC<Props> = ({
  students,
  onSelectStudent,
  onAwardStamp
}) => {
  const [filterStuckOnly, setFilterStuckOnly] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [hoveredPreview, setHoveredPreview] = useState<{
    student: Student;
    quest: 1 | 2 | 3 | 4;
    pos: { x: number; y: number };
  } | null>(null);

  const filteredStudents = students.filter(s => {
    if (filterStuckOnly && !s.isStuck && !s.needsHelp) return false;
    if (searchKeyword.trim()) {
      const q = searchKeyword.trim().toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        String(s.studentNo).includes(q)
      );
    }
    return true;
  });

  const getTileStatus = (student: Student, quest: 1 | 2 | 3 | 4): TileStatus => {
    if (quest === 1) {
      if (student.goldenStamps > 0 && student.q1.choice) return 'gm_feedback';
      if (student.q1.choice) return 'completed';
      if (student.currentQuest === 1) return 'in_progress';
      return 'pending';
    }
    if (quest === 2) {
      if (student.goldenStamps > 0 && (student.q2.emotionCards?.length || student.q2.magicSentence)) return 'gm_feedback';
      if (student.q2.emotionCards?.length && student.q2.magicSentence) return 'completed';
      if (student.currentQuest === 2) return 'in_progress';
      return 'pending';
    }
    if (quest === 3) {
      if (student.goldenStamps > 0 && student.q3.honestHabitToFix) return 'gm_feedback';
      if (student.q3.honestHabitToFix) return 'completed';
      if (student.currentQuest === 3) return 'in_progress';
      return 'pending';
    }
    if (quest === 4) {
      if (student.goldenStamps > 0 && student.q4.completedAt) return 'gm_feedback';
      if (student.q4.completedAt || (student.q4.guardianPledge && student.q4.sentBuffs.length >= 2)) return 'completed';
      if (student.currentQuest === 4 || student.q4.guardianPledge) return 'in_progress';
      return 'pending';
    }
    return 'pending';
  };

  const renderStatusBadge = (status: TileStatus, label: string) => {
    switch (status) {
      case 'gm_feedback':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-1 rounded-xl text-xs shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{label}</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded-xl text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{label}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 border border-orange-300 font-bold px-2.5 py-1 rounded-xl text-xs animate-pulse">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>작성 중</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 border border-slate-200 px-2.5 py-1 rounded-xl text-xs">
            <span>대기</span>
          </span>
        );
    }
  };

  const getHoverSummary = (student: Student, quest: 1 | 2 | 3 | 4) => {
    if (quest === 1) {
      return student.q1.choice
        ? `선택: [${student.q1.choice}] ${student.q1.choiceTitle}\n사유: ${student.q1.consequenceReason || '미작성'}`
        : '아직 미작성 상태입니다.';
    }
    if (quest === 2) {
      return student.q2.magicSentence
        ? `감정: ${(student.q2.emotionCards || []).join(', ')}\n마법의한마디: “${student.q2.magicSentence}”`
        : '아직 미작성 상태입니다.';
    }
    if (quest === 3) {
      return student.q3.honestHabitToFix
        ? `배터리: ${student.q3.batteryPercentage ?? 100}%\n고치고싶은습관: “${student.q3.honestHabitToFix}”`
        : '아직 미작성 상태입니다.';
    }
    if (quest === 4) {
      return student.q4.guardianPledge
        ? `다짐: “${student.q4.guardianPledge}”\n보낸버프: ${student.q4.sentBuffs.length}개 / 받은버프: ${student.q4.receivedBuffs.length}개`
        : '아직 미작성 상태입니다.';
    }
    return '';
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="학생 이름 또는 번호 검색..."
              className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none w-48 text-slate-800"
            />
          </div>

          <button
            onClick={() => setFilterStuckOnly(!filterStuckOnly)}
            className={`text-xs px-3 py-2 rounded-xl font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              filterStuckOnly
                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs ring-1 ring-rose-400'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>도움 필요(Stuck) 학생만 보기</span>
            {students.filter(s => s.isStuck || s.needsHelp).length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {students.filter(s => s.isStuck || s.needsHelp).length}
              </span>
            )}
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> 대기
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> 작성 중
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 완료
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> GM 피드백(★)
          </span>
        </div>
      </div>

      {/* Bird's Eye View Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">번호</th>
                <th className="py-3.5 px-4 w-32">학생 이름</th>
                <th className="py-3.5 px-4 min-w-[140px]">Q1 딜레마</th>
                <th className="py-3.5 px-4 min-w-[140px]">Q2 원인 탐구</th>
                <th className="py-3.5 px-4 min-w-[140px]">Q3 습관 점검</th>
                <th className="py-3.5 px-4 min-w-[150px]">Q4 다짐 & 격려</th>
                <th className="py-3.5 px-4 w-28 text-center">진행률</th>
                <th className="py-3.5 px-4 w-28 text-center">GM 개입</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredStudents.map((s) => {
                const q1Status = getTileStatus(s, 1);
                const q2Status = getTileStatus(s, 2);
                const q3Status = getTileStatus(s, 3);
                const q4Status = getTileStatus(s, 4);

                return (
                  <tr
                    key={s.studentNo}
                    className={`hover:bg-indigo-50/40 transition-colors ${
                      s.needsHelp || s.isStuck ? 'bg-rose-50/50' : ''
                    }`}
                  >
                    {/* Student Number */}
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {String(s.studentNo).padStart(2, '0')}
                    </td>

                    {/* Student Name & Stuck Warning */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectStudent(s)}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer text-left"
                        >
                          {s.name}
                        </button>
                        {s.needsHelp ? (
                          <span
                            title="학생이 도움을 요청했습니다!"
                            className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold animate-pulse cursor-pointer"
                            onClick={() => onSelectStudent(s)}
                          >
                            도움!
                          </span>
                        ) : s.isStuck ? (
                          <span
                            title="5분 이상 정체 상태입니다."
                            className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold cursor-pointer"
                            onClick={() => onSelectStudent(s)}
                          >
                            지연
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Q1 Tile */}
                    <td
                      className="py-3 px-4 cursor-pointer"
                      onClick={() => onSelectStudent(s)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredPreview({ student: s, quest: 1, pos: { x: rect.left, y: rect.bottom + 6 } });
                      }}
                      onMouseLeave={() => setHoveredPreview(null)}
                    >
                      {renderStatusBadge(
                        q1Status,
                        s.q1.choice ? `[${s.q1.choice}] 완료` : '완료'
                      )}
                    </td>

                    {/* Q2 Tile */}
                    <td
                      className="py-3 px-4 cursor-pointer"
                      onClick={() => onSelectStudent(s)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredPreview({ student: s, quest: 2, pos: { x: rect.left, y: rect.bottom + 6 } });
                      }}
                      onMouseLeave={() => setHoveredPreview(null)}
                    >
                      {renderStatusBadge(
                        q2Status,
                        s.q2.emotionCards?.length ? `감정 ${s.q2.emotionCards.length}개` : '완료'
                      )}
                    </td>

                    {/* Q3 Tile */}
                    <td
                      className="py-3 px-4 cursor-pointer"
                      onClick={() => onSelectStudent(s)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredPreview({ student: s, quest: 3, pos: { x: rect.left, y: rect.bottom + 6 } });
                      }}
                      onMouseLeave={() => setHoveredPreview(null)}
                    >
                      {renderStatusBadge(
                        q3Status,
                        s.q3.honestHabitToFix ? `${s.q3.batteryPercentage ?? 100}%` : '완료'
                      )}
                    </td>

                    {/* Q4 Tile */}
                    <td
                      className="py-3 px-4 cursor-pointer"
                      onClick={() => onSelectStudent(s)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredPreview({ student: s, quest: 4, pos: { x: rect.left, y: rect.bottom + 6 } });
                      }}
                      onMouseLeave={() => setHoveredPreview(null)}
                    >
                      {renderStatusBadge(
                        q4Status,
                        s.q4.sentBuffs.length ? `버프 ${s.q4.sentBuffs.length}회` : '완료'
                      )}
                    </td>

                    {/* Overall Progress */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              s.progressPercent >= 90 ? 'bg-emerald-500' : s.progressPercent >= 50 ? 'bg-indigo-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${s.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 text-[11px]">
                          {s.progressPercent}%
                        </span>
                      </div>
                    </td>

                    {/* GM Action */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onAwardStamp(s.studentNo)}
                          title="골든 스탬프 참 잘했어요 즉시 부여"
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 transition-colors cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        </button>
                        <button
                          onClick={() => onSelectStudent(s)}
                          title="상세 기록 열람"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Hover Preview Card */}
      {hoveredPreview && (
        <div
          className="fixed z-50 bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700 text-xs max-w-xs pointer-events-none transition-opacity animate-fade-in"
          style={{
            top: Math.min(window.innerHeight - 180, hoveredPreview.pos.y),
            left: Math.min(window.innerWidth - 280, hoveredPreview.pos.x)
          }}
        >
          <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold mb-1 border-b border-slate-800 pb-1">
            <span>{hoveredPreview.student.name} (Q{hoveredPreview.quest})</span>
            <span>클릭 시 전체 열람</span>
          </div>
          <p className="whitespace-pre-line text-slate-200 text-[11px] leading-relaxed">
            {getHoverSummary(hoveredPreview.student, hoveredPreview.quest)}
          </p>
        </div>
      )}
    </div>
  );
};
