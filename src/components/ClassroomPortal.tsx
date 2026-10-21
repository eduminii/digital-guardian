import React, { useState } from 'react';
import { ClassroomSession, Student } from '../types';
import { sessionStore } from '../services/sessionStore';
import {
  Shield,
  Laptop,
  GraduationCap,
  Monitor,
  Sparkles,
  ArrowRight,
  Lock,
  Users,
  Compass,
  CheckCircle2,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { hasTeacherPin } from './teacher/TeacherPinModal';

interface Props {
  session: ClassroomSession;
  onEnterAsStudent: (studentNo: number, name: string) => void;
  onEnterAsTeacher: () => void;
  onEnterAsProjector: () => void;
}

export const ClassroomPortal: React.FC<Props> = ({
  session,
  onEnterAsStudent,
  onEnterAsTeacher,
  onEnterAsProjector
}) => {
  const [roomCodeInput, setRoomCodeInput] = useState(session.roomCode);
  const [studentNoInput, setStudentNoInput] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedNo = parseInt(studentNoInput.trim(), 10);
    if (isNaN(parsedNo) || parsedNo < 1 || parsedNo > 60) {
      setFormError('출석 번호(1~60)를 올바르게 입력해주세요.');
      return;
    }
    const trimmedName = studentName.trim();
    if (!trimmedName) {
      setFormError('학생 이름을 입력해주세요.');
      return;
    }
    setFormError(null);
    sessionStore.joinOrCreateStudent(parsedNo, trimmedName);
    onEnterAsStudent(parsedNo, trimmedName);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center relative z-10 w-full space-y-8">
        {/* Hero Title & Lore Briefing */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-950/80 border border-indigo-700/60 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-bold shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>2022 개정 교육과정 초등 4학년 도덕과 [4도03-02] 정보통신윤리</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            디지털 가디언즈: <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">네오 아일랜드 구출 대작전</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            🚨 <b>긴급 브리핑:</b> 평화롭던 네오 아일랜드에 단톡방 사이버 불링, 엽기 사진 유포, 개인정보 박제 협박의 어둠이 드리웠습니다! 4단계 퀘스트를 완수하고 섬의 평화를 되찾을 <b>4학년 2반 가디언즈</b>를 소환합니다!
          </p>
        </div>

        {/* 2 Entry Cards: Student vs Teacher */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left: Student Entry Card */}
          <div className="md:col-span-7 bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>학생 수호자 출동</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        무로그인 5초 입장
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">내 출석 번호와 이름을 직접 입력하고 바로 탐험을 시작하세요.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                {/* Room Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    수업 참여 코드
                  </label>
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    className="w-full text-sm font-mono tracking-wider px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-amber-300 font-bold focus:border-emerald-500 outline-none"
                    placeholder="NEO-402"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Student Number Input */}
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      출석 번호 <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={studentNoInput}
                      onChange={(e) => {
                        setStudentNoInput(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="예: 7"
                      className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-emerald-500 outline-none placeholder:text-slate-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">숫자 입력 (1~60번)</span>
                  </div>

                  {/* Student Name Input */}
                  <div className="sm:col-span-7">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      학생 이름 <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="본인 이름 (예: 이서준)"
                      className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-emerald-500 outline-none placeholder:text-slate-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">본인 실명 입력</span>
                  </div>
                </div>

                {/* Existing record hint if matching studentNo */}
                {studentNoInput.trim() !== '' && !isNaN(Number(studentNoInput)) && (
                  (() => {
                    const existing = session.students.find(s => s.studentNo === Number(studentNoInput));
                    if (existing && existing.name) {
                      return (
                        <div className="text-[11px] text-teal-300 bg-teal-950/60 border border-teal-800/60 px-3 py-2 rounded-xl flex items-center gap-1.5">
                          <span>💡 <b>{studentNoInput}번</b> 기존 탐험 기록이 있습니다. 입장하면 진행 상태가 유지됩니다.</span>
                        </div>
                      );
                    }
                    return null;
                  })()
                )}

                {/* Form Error Notice */}
                {formError && (
                  <div className="text-xs text-rose-300 bg-rose-950/70 border border-rose-800 p-2.5 rounded-xl flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Enter Button */}
                <button
                  type="submit"
                  disabled={!studentName.trim() || !studentNoInput.trim()}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    studentName.trim() && studentNoInput.trim()
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 shadow-emerald-500/25 active:scale-98'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Shield className="w-4 h-4 fill-slate-950" />
                  <span>수호자 출동! 네오 아일랜드 구출하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Teacher Entry Card */}
          <div className="md:col-span-5 bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between backdrop-blur-md space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>교사 수업 통제실</span>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-slate-400">실시간 대시보드 & 과정중심평가</span>
                    {!hasTeacherPin() ? (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-md font-bold">
                        PIN 설정 필요
                      </span>
                    ) : (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded-md font-bold">
                        보안 잠금 활성화
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 bg-indigo-950/50 border border-indigo-800/60 p-4 rounded-2xl text-xs text-slate-300">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>주요 교사용 기능</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li>• 24명 학생 4단계 퀘스트 실시간 매트릭스 그리드</li>
                  <li>• 지연(Stuck) 감지 및 원클릭 골든 스탬프·돌발 방송</li>
                  <li>• 2022 개정 도덕 [4도03-02] 루브릭 자동 채점 (HITL)</li>
                  <li>• 나이스(NEIS) 평어 자동 생성 및 엑셀(XLSX) 다운로드</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={onEnterAsTeacher}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>
                  {!hasTeacherPin()
                    ? '교사 보안 PIN 최초 설정 후 입장'
                    : '교사 보안 PIN 입력 후 대시보드 입장'}
                </span>
              </button>

              <button
                onClick={onEnterAsProjector}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>교실 칠판 스크린 미러링 열기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          초등 도덕과 정보통신윤리 탐구형 게임 및 과정중심평가 솔루션 • Google AI Studio Build
        </div>
      </main>
    </div>
  );
};
