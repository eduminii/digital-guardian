import React from 'react';
import { ClassroomSession } from '../../types';
import { Shield, Sparkles, Heart, Trophy, Star, Users } from 'lucide-react';

interface Props {
  session: ClassroomSession;
  onExit: () => void;
}

export const ProjectorView: React.FC<Props> = ({ session, onExit }) => {
  const purification = session.islandPurification;
  const completedCount = session.students.filter(s => s.progressPercent >= 90).length;

  // Collect all recent buffs
  const allBuffs = session.students
    .flatMap(s => s.q4.sentBuffs)
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 8);

  // Collect active pledges
  const activePledges = session.students
    .filter(s => s.q4.guardianPledge && s.q4.guardianPledge.trim().length > 5)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-8 flex flex-col font-sans select-none">
      {/* Top Projector Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                칠판 스크린 미러링 모드
              </span>
              <span className="text-xs text-slate-400">참여 코드: {session.roomCode}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              {session.className} 디지털 가디언즈: 네오 아일랜드 구출 대작전
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-right">
            <div className="text-xs text-slate-400">활동 완료 학습자</div>
            <div className="text-lg font-black text-emerald-400">
              {completedCount} / {session.totalStudents}명
            </div>
          </div>

          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            교사 대시보드로 복귀
          </button>
        </div>
      </header>

      {/* Main Island Purification Display */}
      <div className="my-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
              <span>전체 네오 아일랜드 정화 게이지 (학급 공동 목표)</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
              {purification}%
            </div>
          </div>

          {/* Big Purification Bar */}
          <div className="w-full bg-slate-950 h-8 rounded-full p-1.5 border border-slate-800 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-300 rounded-full transition-all duration-1000 shadow-md relative"
              style={{ width: `${purification}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>위기의 암흑 안개 (0%)</span>
            <span>중재와 공감의 숲 (50%)</span>
            <span className="text-emerald-400 font-bold">완전한 평화의 네오 아일랜드 (100%)</span>
          </div>
        </div>
      </div>

      {/* Grid: Live Pledge Feed & Live Buff Exchange Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left: Live Guardian Pledge Feed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>실시간 수호자 다짐 서약 피드</span>
            </div>
            <span className="text-xs text-slate-400">{activePledges.length}개 서약 완료</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {activePledges.map((s) => (
              <div
                key={s.studentNo}
                className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1 hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">
                    {s.studentNo}번 {s.name} 가디언
                  </span>
                  <span className="text-[10px] text-slate-500">Lv.{s.level}</span>
                </div>
                <p className="text-slate-200 text-xs font-medium leading-relaxed">
                  “{s.q4.guardianPledge}”
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Buff Cheering Relay */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>친구 응원 버프 릴레이 전광판</span>
            </div>
            <span className="text-xs text-slate-400">따뜻한 마음 교환</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {allBuffs.map((b) => (
              <div
                key={b.id}
                className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl flex items-start gap-3 hover:border-rose-500/50 transition-colors"
              >
                <div className="text-xl shrink-0 mt-0.5">{b.sticker.split(' ')[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-indigo-300">
                      {b.fromStudentName} ➔ {b.toStudentNo}번 친구
                    </span>
                    <span className="text-[10px] text-slate-500">{b.createdAt}</span>
                  </div>
                  <p className="text-slate-200 text-xs font-medium leading-snug">
                    “{b.comment}”
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
