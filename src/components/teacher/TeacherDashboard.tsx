import React, { useState } from 'react';
import { ClassroomSession, Student } from '../../types';
import { sessionStore } from '../../services/sessionStore';
import { StudentMatrixGrid } from './StudentMatrixGrid';
import { StudentDetailModal } from './StudentDetailModal';
import { TeacherBroadcastModal } from './TeacherBroadcastModal';
import { RubricAssessmentView } from './RubricAssessmentView';
import { NeisCommentsView } from './NeisCommentsView';
import { exportClassroomExcel } from '../../utils/exportExcel';
import {
  Activity,
  FileCheck2,
  FileText,
  Bell,
  Monitor,
  Download,
  RotateCcw,
  Sparkles,
  Users,
  ShieldAlert,
  Star,
  Lock,
  KeyRound
} from 'lucide-react';
import { ChangePinModal } from './ChangePinModal';
import { fireGoldenStampConfetti } from '../../utils/soundEffects';

interface Props {
  session: ClassroomSession;
  onOpenProjector: () => void;
  onLockSession?: () => void;
}

export const TeacherDashboard: React.FC<Props> = ({ session, onOpenProjector, onLockSession }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'rubric' | 'neis'>('matrix');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);

  const handleAwardStamp = (studentNo: number) => {
    sessionStore.awardGoldenStamp(studentNo);
    fireGoldenStampConfetti();
    // Update local selected student if open
    if (selectedStudent && selectedStudent.studentNo === studentNo) {
      const updated = sessionStore.getStudent(studentNo);
      if (updated) setSelectedStudent({ ...updated });
    }
  };

  const handleExport = () => {
    exportClassroomExcel(session.students, session.className);
  };

  const handleResetData = () => {
    if (window.confirm('정말 기본 24명 학생 시뮬레이션 데이터로 재설정하시겠습니까?')) {
      sessionStore.resetToDefault();
    }
  };

  const purification = session.islandPurification;
  const stuckCount = session.students.filter(s => s.isStuck || s.needsHelp).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="bg-slate-900 text-white px-5 py-4 shadow-lg border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Class Identity & Purification Meter */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md border border-indigo-400/30">
              4-2
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  [{session.className}] 실시간 수업 현황판
                </h1>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{session.students.length}명 접속 중</span>
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  참여코드: <span className="font-mono text-amber-300 font-bold">{session.roomCode}</span>
                </span>
              </div>

              {/* Island Purification Bar in header */}
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-xs text-slate-300 font-medium">
                  전체 아일랜드 정화율:
                </span>
                <div className="w-32 sm:w-48 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-700"
                    style={{ width: `${purification}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {purification}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Stuck alert pill */}
            {stuckCount > 0 && (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 animate-pulse hidden lg:flex">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>도움 필요 {stuckCount}명</span>
              </span>
            )}

            {/* Broadcast Button */}
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Bell className="w-4 h-4" />
              <span>돌발 방송</span>
            </button>

            {/* Projector Mirror Button */}
            <button
              onClick={onOpenProjector}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">칠판 미러링</span>
            </button>

            {/* Excel Export Button */}
            <button
              onClick={handleExport}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>엑셀 다운로드</span>
            </button>

            {/* Reset / Reload Demo Data */}
            <button
              onClick={handleResetData}
              title="24명 기본 데이터로 초기화"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Change PIN Button */}
            <button
              onClick={() => setShowChangePinModal(true)}
              title="교사 보안 PIN 변경"
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">PIN 변경</span>
            </button>

            {/* Quick Session Lock */}
            {onLockSession && (
              <button
                onClick={onLockSession}
                title="교사 세션 잠금 및 학생 화면으로 전환"
                className="px-2.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden md:inline">세션 잠금</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-slate-200 px-5 shadow-xs sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-3 py-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>실시간 대시보드 (Bird's Eye View)</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'rubric'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>과정중심평가 루브릭 (상·중·하)</span>
          </button>

          <button
            onClick={() => setActiveTab('neis')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'neis'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>나이스(NEIS) 평어 자동 완성</span>
          </button>
        </div>
      </div>

      {/* Main Content View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {activeTab === 'matrix' && (
          <StudentMatrixGrid
            students={session.students}
            onSelectStudent={(st) => setSelectedStudent(st)}
            onAwardStamp={handleAwardStamp}
          />
        )}

        {activeTab === 'rubric' && (
          <RubricAssessmentView
            students={session.students}
            onSelectStudent={(st) => setSelectedStudent(st)}
          />
        )}

        {activeTab === 'neis' && (
          <NeisCommentsView
            students={session.students}
            onSelectStudent={(st) => setSelectedStudent(st)}
          />
        )}
      </main>

      {/* Student Details Inspection Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onAwardStamp={handleAwardStamp}
        />
      )}

      {/* Teacher Broadcast / Timer Modal */}
      {showBroadcastModal && (
        <TeacherBroadcastModal
          onClose={() => setShowBroadcastModal(false)}
          onBroadcast={(msg, type, seconds) => {
            sessionStore.broadcastMessage(msg, type, seconds);
          }}
        />
      )}

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <ChangePinModal onClose={() => setShowChangePinModal(false)} />
      )}
    </div>
  );
};
