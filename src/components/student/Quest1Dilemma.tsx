import React, { useState } from 'react';
import { Student } from '../../types';
import { Q1_SCENARIOS, DilemmaScenario } from '../../data/initialData';
import { sessionStore } from '../../services/sessionStore';
import {
  Shield,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
  Heart,
  Users,
  Flame,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface Props {
  student: Student;
  onComplete: (
    choice: 'A' | 'B' | 'C' | 'D' | 'E',
    title: string,
    reason: string,
    delta: number,
    scenarioId?: string
  ) => void;
}

export const Quest1Dilemma: React.FC<Props> = ({ student, onComplete }) => {
  // Scenario state
  const initialScenario =
    Q1_SCENARIOS.find(s => s.id === student.q1.scenarioId) || Q1_SCENARIOS[0];
  const [currentScenario, setCurrentScenario] = useState<DilemmaScenario>(initialScenario);

  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | 'C' | 'D' | 'E' | ''>(
    student.q1.choice || ''
  );
  const [reason, setReason] = useState(student.q1.consequenceReason || '');
  const [previewDelta, setPreviewDelta] = useState<number>(student.q1.friendshipDelta || 0);

  const handleSelectScenario = (sc: DilemmaScenario) => {
    setCurrentScenario(sc);
    setSelectedChoice('');
    setPreviewDelta(0);
    setReason('');
    sessionStore.setStudentScenario(student.studentNo, sc.id);
  };

  const handleSelectChoice = (id: string, delta: number) => {
    setSelectedChoice(id as 'A' | 'B' | 'C' | 'D' | 'E');
    setPreviewDelta(delta);
  };

  const currentFriendship = Math.max(0, Math.min(100, 55 + previewDelta));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChoice) return;
    if (reason.trim().length < 5) return;

    const choiceObj = currentScenario.choices.find(c => c.id === selectedChoice);
    if (!choiceObj) return;

    onComplete(
      selectedChoice,
      `[${currentScenario.badge}] ${choiceObj.title}`,
      reason.trim(),
      choiceObj.friendshipDelta,
      currentScenario.id
    );
  };

  // Realistic reason suggestion tags based on scenario
  const getScenarioHints = () => {
    switch (currentScenario.id) {
      case 'soccer_kick':
        return [
          '민재가 혼자 상처받지 않고 내일 교실에 올 수 있을 것이다.',
          '단톡방 불링은 안 멈추지만 민재와 나 사이는 끈끈해질 것이다.',
          '준호 패거리와 싸움이 커지겠지만 한 사람을 왕따시키는 건 막을 수 있다.'
        ];
      case 'photo_mock':
        return [
          '하은이 굴욕 사진이 틱톡 등 다른 SNS로 2차 유포되는 것을 막을 수 있다.',
          '친구들의 웃음거리가 되는 상처를 덜어줄 수 있을 것이다.',
          '단톡방 분위기는 어색해지겠지만 선을 넘은 장난을 멈출 수 있다.'
        ];
      case 'game_scam':
        return [
          '도현이의 전화번호와 아파트 등 개인정보 유출 피해를 막을 수 있다.',
          '아이들 사이의 오해를 내일 학교에서 공식적으로 풀 수 있게 된다.',
          '사이버 범죄 수준의 협박과 금전 갈취를 사전에 차단할 수 있다.'
        ];
      case 'secret_room':
        return [
          '비겁한 첩자 색출 싸움을 멈추고 뒷담방의 잘못을 반성하게 된다.',
          '예은이가 더 이상 고립되지 않고 교실에서 마음을 추스를 수 있다.',
          '친구들의 원망을 듣더라도 비밀 파벌 갈등의 악순환을 끊을 수 있다.'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Realistic Scenarios Selector Carousel */}
      <div className="bg-slate-900 rounded-3xl p-4 shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>탐구할 현실 갈등 사건을 선택하세요 (총 4개 시나리오)</span>
          </div>
          <span className="text-[11px] text-slate-400">초등 4학년 실생활 100% 밀착</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {Q1_SCENARIOS.map((sc) => {
            const isCurrent = currentScenario.id === sc.id;
            return (
              <button
                type="button"
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer relative overflow-hidden ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-950/80 shadow-md ring-2 ring-indigo-400/30'
                    : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white mb-0.5 flex items-center justify-between">
                  <span>{sc.badge}</span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div className="text-[11px] font-semibold text-slate-300 truncate">
                  {sc.title.split(': ')[1] || sc.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {sc.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario header banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-lg border border-indigo-700/40">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Quest 1: 위기의 단톡방 딜레마</span>
          <span className="text-slate-400">•</span>
          <span className="text-amber-300 font-bold">{currentScenario.subtitle}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white mb-1.5">
          {currentScenario.title}
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {currentScenario.context}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Realistic Smartphone Messenger */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-900 rounded-3xl p-3 border-4 border-slate-700 shadow-2xl flex-1 flex flex-col">
            <div className="bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{currentScenario.groupName}</span>
              </div>
              <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full shrink-0">실시간</span>
            </div>

            <div className="bg-[#b2c7d9] p-3 rounded-b-2xl flex-1 space-y-2.5 overflow-y-auto max-h-[380px]">
              {currentScenario.chatLogs.map((chat, idx) => {
                if (chat.isSystem) {
                  return (
                    <div key={idx} className="flex justify-center my-1.5">
                      <span className="bg-black/35 text-white text-[11px] px-3 py-1 rounded-full shadow-xs">
                        {chat.message}
                      </span>
                    </div>
                  );
                }
                const isVictim = chat.sender === currentScenario.victimName;
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm ${
                      isVictim ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-slate-600'
                    }`}>
                      {chat.sender[0]}
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-700 font-semibold ml-0.5 mb-0.5 flex items-center gap-1">
                        <span>{chat.sender}</span>
                        {isVictim && (
                          <span className="bg-amber-200/90 text-amber-900 text-[9px] px-1.5 py-0.2 rounded-md font-bold">
                            피해 학생
                          </span>
                        )}
                      </div>
                      <div className="flex items-end gap-1.5">
                        <div className={`px-3 py-2 rounded-2xl text-xs max-w-[210px] shadow-xs leading-snug ${
                          isVictim
                            ? 'bg-amber-50 text-amber-950 border border-amber-300 font-medium'
                            : 'bg-white text-slate-800'
                        }`}>
                          {chat.message}
                        </div>
                        <span className="text-[10px] text-slate-500">{chat.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mind & Friendship Gauge Live Feedback */}
            <div className="bg-slate-800 p-3 rounded-2xl mt-2 space-y-2 border border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Heart className={`w-4 h-4 ${previewDelta > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                  {currentScenario.victimName}의 마음 & 우리 반 평화 지수
                </span>
                <span className={`font-bold ${
                  previewDelta > 0 ? 'text-emerald-400' : previewDelta < 0 ? 'text-rose-400' : 'text-slate-300'
                }`}>
                  {currentFriendship}% {previewDelta > 0 ? `(+${previewDelta}%)` : previewDelta < 0 ? `(${previewDelta}%)` : ''}
                </span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    currentFriendship >= 70 ? 'bg-emerald-500' : currentFriendship >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${currentFriendship}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Realistic Dilemma Formulation */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    STEP 1
                  </span>
                  <label className="text-base font-bold text-slate-900">
                    내가 이 단톡방에 있다면 실제로 어떻게 할까요?
                  </label>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                💡 <b>착한 아이 정답을 찾으려 하지 마세요!</b> 실제 4학년 교실에서 내가 겪을 수 있는 현실적인 고민과 행동을 솔직하게 골라보세요.
              </p>

              <div className="space-y-3">
                {currentScenario.choices.map((c) => {
                  const isSelected = selectedChoice === c.id;
                  const isPositive = c.friendshipDelta > 0;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => handleSelectChoice(c.id, c.friendshipDelta)}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? isPositive
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                            : 'border-rose-400 bg-rose-50/70 shadow-sm'
                          : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? isPositive ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {c.id}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900 flex flex-wrap items-center justify-between gap-1">
                          <span>{c.title}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            c.friendshipDelta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            평화 지수 {c.friendshipDelta > 0 ? `+${c.friendshipDelta}%` : `${c.friendshipDelta}%`}
                          </span>
                        </div>

                        {/* Real Dilemma Nuance Tag */}
                        <div className="mt-1.5 flex items-start gap-1 text-[11px] bg-slate-200/60 text-slate-700 px-2.5 py-1 rounded-lg">
                          <span className="font-bold text-slate-900 shrink-0">🤔 현실 고민:</span>
                          <span className="leading-snug">{c.realDilemma}</span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-snug">
                          {c.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Reason & Realistic Consequence */}
            <div className="pt-2 border-t border-slate-150">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    STEP 2
                  </span>
                  <label className="text-sm font-bold text-slate-900">
                    내가 그렇게 행동했을 때 생길 일 (좋은 점 또는 감수해야 할 위험)
                  </label>
                </div>
                <span className="text-xs text-slate-400">
                  {reason.trim().length}자 / 최소 5자
                </span>
              </div>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="예: 친구들에게 왜 분위기 깨냐고 한소리 들을 수도 있겠지만, 하은이의 굴욕 사진이 틱톡으로 퍼지는 것은 막을 수 있을 것이다."
                rows={3}
                className="w-full text-sm p-3.5 rounded-2xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none text-slate-800 placeholder:text-slate-400"
              />

              {/* Realistic Inspiration Tags */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">생각 도우미:</span>
                {getScenarioHints().map((hint, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setReason(hint)}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
                  >
                    {hint.length > 25 ? hint.substring(0, 25) + '…' : hint}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>나의 솔직한 판단이 네오 아일랜드 정화의 첫걸음입니다.</span>
              </div>

              <button
                type="submit"
                disabled={!selectedChoice || reason.trim().length < 5}
                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  selectedChoice && reason.trim().length >= 5
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-200'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Q1 완료 & 사건 탐정으로</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
