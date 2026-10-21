import React, { useState, useEffect } from 'react';
import { ClassroomSession } from '../types';
import { TeacherPinModal } from './teacher/TeacherPinModal';
import {
  Shield,
  BookOpen,
  Monitor,
  Laptop,
  GraduationCap,
  X,
  Lock,
  Unlock,
  LogOut,
  Home
} from 'lucide-react';

interface Props {
  currentRole: 'portal' | 'teacher' | 'student' | 'projector';
  onRoleChange: (role: 'portal' | 'teacher' | 'student' | 'projector') => void;
  session: ClassroomSession;
}

export const Navbar: React.FC<Props> = ({ currentRole, onRoleChange, session }) => {
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<'teacher' | 'projector'>('teacher');
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('neo_guardian_teacher_auth') === 'true';
      setIsTeacherAuthenticated(auth);
    }
  }, [currentRole]);

  const handleRoleClick = (role: 'portal' | 'teacher' | 'student' | 'projector') => {
    if (role === 'portal' || role === 'student') {
      onRoleChange(role);
      return;
    }

    // If teacher or projector, check PIN authentication
    if (isTeacherAuthenticated) {
      onRoleChange(role);
    } else {
      setPendingRole(role);
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    setIsTeacherAuthenticated(true);
    setShowPinModal(false);
    onRoleChange(pendingRole);
  };

  const handleTeacherLock = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('neo_guardian_teacher_auth');
    }
    setIsTeacherAuthenticated(false);
    onRoleChange('portal');
  };

  return (
    <>
      <nav className="bg-slate-950 text-white px-4 py-2 border-b border-slate-800 text-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & App Title - Click to return to Portal */}
          <button
            onClick={() => handleRoleClick('portal')}
            className="flex items-center gap-2.5 cursor-pointer text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500 group-hover:bg-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-xs transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white text-xs sm:text-sm tracking-tight group-hover:text-emerald-300 transition-colors">
                디지털 가디언즈
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold ml-1.5 hidden sm:inline">
                네오 아일랜드 구출 대작전
              </span>
            </div>
          </button>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {/* Return to Landing Portal */}
            <button
              onClick={() => handleRoleClick('portal')}
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                currentRole === 'portal'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>처음으로</span>
            </button>

            {/* Student View (Publicly accessible) */}
            <button
              onClick={() => handleRoleClick('student')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentRole === 'student'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>학생 화면</span>
            </button>

            {/* Teacher Dashboard (Locked by PIN) */}
            <button
              onClick={() => handleRoleClick('teacher')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentRole === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>교사 대시보드</span>
              {!isTeacherAuthenticated ? (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" />
              ) : (
                <Unlock className="w-3 h-3 text-emerald-400 ml-0.5" />
              )}
            </button>

            {/* Projector Mirror (Locked by PIN) */}
            <button
              onClick={() => handleRoleClick('projector')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentRole === 'projector'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>칠판 미러링</span>
              {!isTeacherAuthenticated && (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" />
              )}
            </button>
          </div>

          {/* Right Tools: Lock Session & Curriculum Standard */}
          <div className="flex items-center gap-2">
            {isTeacherAuthenticated && (
              <button
                onClick={handleTeacherLock}
                title="교사 세션 즉시 잠금 (학생 화면으로 전환)"
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 hover:text-white hover:bg-rose-900 font-bold flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">교사 잠금</span>
              </button>
            )}

            <button
              onClick={() => setShowCurriculumModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">2022 개정 도덕 성취기준</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Teacher PIN Lock Modal */}
      {showPinModal && (
        <TeacherPinModal
          targetRole={pendingRole}
          onSuccess={handlePinSuccess}
          onCancel={() => setShowPinModal(false)}
        />
      )}

      {/* Curriculum Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>2022 개정 교육과정 연계 수업 개요</span>
              </div>
              <button
                onClick={() => setShowCurriculumModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-2xl">
                <span className="font-bold text-indigo-950 block mb-1">
                  📌 도덕과 성취기준 [4도03-02]
                </span>
                <p className="text-indigo-900">
                  “디지털 사회에서 발생하는 다양한 도덕적 문제(사이버 괴롭힘, 저작권 침해, 디지털 과의존 등)의 원인을 탐구하고, 타인을 존중하고 배려하며 정보통신 윤리를 실천하는 태도를 기른다.”
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-slate-900">🎯 핵심 수업 차시 흐름 (40분 기준)</div>
                <ul className="space-y-1 pl-4 list-disc text-slate-600">
                  <li><b>[도입 5분]</b> 세션 오픈, 네오 아일랜드 위기 브리핑</li>
                  <li><b>[전개 25분]</b> 4단계 퀘스트(딜레마-탐구-배터리-다짐) 및 교사 실시간 관찰·GM 피드백</li>
                  <li><b>[정리 10분]</b> 학급 전체 정화 게이지 100% 달성 및 친구 격려 버프 교환</li>
                  <li><b>[수업 후]</b> 과정중심평가 루브릭 확정 및 나이스(NEIS) 평어 엑셀 다운로드</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[11px] text-slate-500">
                💡 <b>Human-In-The-Loop (HITL) 원칙 준수:</b> 인공지능과 알고리즘이 1차 평가 등급과 평어 초안을 추천하지만, 최종적인 평가 권한과 학생별 문장 수정권은 전적으로 교사에게 있습니다.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCurriculumModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
