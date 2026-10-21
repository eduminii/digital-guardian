import React, { useState, useEffect, useRef } from 'react';
import { Student, ClassroomSession, QuestStep } from '../../types';
import { sessionStore } from '../../services/sessionStore';
import { Quest1Dilemma } from './Quest1Dilemma';
import { Quest2Detective } from './Quest2Detective';
import { Quest3Battery } from './Quest3Battery';
import { Quest4Pledge } from './Quest4Pledge';
import {
  Shield,
  BatteryCharging,
  Star,
  LifeBuoy,
  Bell,
  Sparkles,
  Trophy,
  CheckCircle2,
  X,
  Volume2
} from 'lucide-react';
import { fireGoldenStampConfetti, playBroadcastAlertSound } from '../../utils/soundEffects';

interface Props {
  currentStudentNo: number;
  session: ClassroomSession;
  onChangeStudent: (no: number) => void;
}

export const StudentView: React.FC<Props> = ({
  currentStudentNo,
  session,
  onChangeStudent
}) => {
  const student = session.students.find(s => s.studentNo === currentStudentNo) || session.students[0];
  const [activeTab, setActiveTab] = useState<QuestStep>(student?.currentQuest || 1);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpInput, setHelpInput] = useState('');
  const [lastGoldenStamps, setLastGoldenStamps] = useState(student?.goldenStamps || 0);
  const [stampAlert, setStampAlert] = useState<string | null>(null);

  // Broadcast alert toast
  const lastBroadcastIdRef = useRef<string | null>(null);
  const [activeBroadcast, setActiveBroadcast] = useState<ClassroomSession['broadcasts'][0] | null>(null);

  useEffect(() => {
    if (student) {
      if (student.goldenStamps > lastGoldenStamps) {
        fireGoldenStampConfetti();
        setStampAlert(`선생님께서 ‘참 잘했어요’ 골든 스탬프(★)를 보내주셨습니다! (+80 EXP)`);
        setLastGoldenStamps(student.goldenStamps);
      }
    }
  }, [student?.goldenStamps, lastGoldenStamps]);

  useEffect(() => {
    const latestBroadcast = session.broadcasts[0];
    if (latestBroadcast && latestBroadcast.id !== lastBroadcastIdRef.current) {
      lastBroadcastIdRef.current = latestBroadcast.id;
      setActiveBroadcast(latestBroadcast);
      playBroadcastAlertSound();
    }
  }, [session.broadcasts]);

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500">
        학생 정보를 찾을 수 없습니다. 번호를 다시 확인해주세요.
      </div>
    );
  }

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStore.toggleHelpRequest(student.studentNo, helpInput);
    setShowHelpModal(false);
    setHelpInput('');
  };

  const currentBattery = student.q3?.batteryPercentage ?? 100;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Guardian Status Bar */}
      <header className="bg-slate-900 text-white px-4 py-3 shadow-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Identity & Level */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-md border border-white/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
                  Lv.{student.level} 가디언
                </span>
                <span className="font-extrabold text-white text-base">
                  {student.studentNo}번 {student.name}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>{session.className}</span>
                <span>•</span>
                <span>EXP {student.exp}pt</span>
              </div>
            </div>
          </div>

          {/* Quick Stats: Battery, Golden Stamp, Help Button */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Battery status */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <BatteryCharging className={`w-4 h-4 ${
                currentBattery >= 80 ? 'text-emerald-400' : currentBattery >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`} />
              <div className="text-xs">
                <span className="text-slate-400 mr-1 hidden sm:inline">배터리</span>
                <span className="font-bold text-white">{currentBattery}%</span>
              </div>
            </div>

            {/* Golden Stamps */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-spin-slow" />
              <div className="text-xs">
                <span className="text-slate-400 mr-1 hidden sm:inline">스탬프</span>
                <span className="font-bold text-amber-300">{student.goldenStamps || 0}개</span>
              </div>
            </div>

            {/* Help request toggle */}
            <button
              onClick={() => setShowHelpModal(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                student.needsHelp
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-900/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <LifeBuoy className="w-4 h-4 text-rose-400" />
              <span>{student.needsHelp ? '도움 요청 중' : '도움 요청'}</span>
            </button>

            {/* Switch student dropdown (only visible when teacher is authenticated for testing) */}
            {typeof window !== 'undefined' && sessionStorage.getItem('neo_guardian_teacher_auth') === 'true' && (
              <select
                value={student.studentNo}
                onChange={(e) => onChangeStudent(Number(e.target.value))}
                aria-label="교사용 학생 화면 미리보기 전환"
                title="교사 테스트용 학생 전환"
                className="bg-indigo-950 border border-indigo-700 text-indigo-200 text-xs rounded-xl px-2.5 py-1.5 outline-none cursor-pointer hidden md:block"
              >
                {session.students.map(s => (
                  <option key={s.studentNo} value={s.studentNo}>
                    [교사 테스트] {s.studentNo}번 {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      {/* Teacher Broadcast Alert Toast */}
      {activeBroadcast && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 shadow-lg border-b border-amber-600 animate-slide-down">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs md:text-sm font-bold">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 shrink-0 animate-bounce" />
              <span>[선생님 돌발 공지] {activeBroadcast.message}</span>
            </div>
            <button
              onClick={() => setActiveBroadcast(null)}
              className="text-white/80 hover:text-white p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Golden stamp celebration toast */}
      {stampAlert && (
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 px-4 py-2 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs md:text-sm font-extrabold">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{stampAlert}</span>
            </div>
            <button onClick={() => setStampAlert(null)} className="cursor-pointer text-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quest Stepper Navigation Bar */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          <div className="grid grid-cols-4 gap-2">
            {[
              { step: 1, title: 'Q1 위기의 단톡방', tag: '딜레마 선택', isDone: Boolean(student.q1.choice) },
              { step: 2, title: 'Q2 사건 탐정 돋보기', tag: '원인 탐구', isDone: Boolean(student.q2.emotionCards?.length) },
              { step: 3, title: 'Q3 배터리 자가진단', tag: '습관 점검', isDone: Boolean(student.q3.honestHabitToFix) },
              { step: 4, title: 'Q4 수호자 다짐&버프', tag: '실천 서약', isDone: Boolean(student.q4.completedAt) }
            ].map((tab) => {
              const isActive = activeTab === tab.step;
              return (
                <button
                  key={tab.step}
                  onClick={() => setActiveTab(tab.step as QuestStep)}
                  className={`p-2.5 rounded-2xl text-left transition-all border cursor-pointer relative ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[11px] font-bold ${isActive ? 'text-indigo-800' : 'text-slate-600'}`}>
                      {tab.title}
                    </span>
                    {tab.isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {tab.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Quest Content Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        {activeTab === 1 && (
          <Quest1Dilemma
            student={student}
            onComplete={(choice, title, reason, delta, scenarioId) => {
              sessionStore.updateStudentQ1(student.studentNo, choice, title, reason, delta, scenarioId);
              setActiveTab(2);
            }}
          />
        )}

        {activeTab === 2 && (
          <Quest2Detective
            student={student}
            onComplete={(emotions, magicSentence) => {
              sessionStore.updateStudentQ2(student.studentNo, emotions, magicSentence);
              setActiveTab(3);
            }}
            onPrev={() => setActiveTab(1)}
          />
        )}

        {activeTab === 3 && (
          <Quest3Battery
            student={student}
            onComplete={(scores, batteryPercent, habit) => {
              sessionStore.updateStudentQ3(student.studentNo, scores, batteryPercent, habit);
              setActiveTab(4);
            }}
            onPrev={() => setActiveTab(2)}
          />
        )}

        {activeTab === 4 && (
          <Quest4Pledge
            student={student}
            session={session}
            onUpdatePledge={(pledge) => {
              sessionStore.updateStudentQ4(student.studentNo, pledge);
            }}
            onSendBuff={(toStudentNo, sticker, comment) => {
              return sessionStore.sendBuff(student.studentNo, toStudentNo, sticker, comment);
            }}
            onPrev={() => setActiveTab(3)}
          />
        )}
      </main>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                <LifeBuoy className="w-5 h-5" />
                <span>선생님께 도움 요청하기</span>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              퀘스트를 풀다가 막히거나 도움이 필요하면 선생님 대시보드에 알림을 보낼 수 있습니다.
            </p>
            <form onSubmit={handleHelpSubmit} className="space-y-3">
              <textarea
                value={helpInput}
                onChange={(e) => setHelpInput(e.target.value)}
                placeholder="선생님, 이 퀘스트의 어떤 부분이 어려운지 적어보세요."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-rose-500 outline-none resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer"
                >
                  도움 요청 보내기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
