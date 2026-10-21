import React, { useState } from 'react';
import { Student } from '../../types';
import { Q3_BATTERY_QUESTIONS } from '../../data/initialData';
import { Battery, BatteryCharging, Zap, ArrowRight, Award, ShieldAlert } from 'lucide-react';

interface Props {
  student: Student;
  onComplete: (scores: number[], batteryPercentage: number, habit: string) => void;
  onPrev: () => void;
}

export const Quest3Battery: React.FC<Props> = ({ student, onComplete, onPrev }) => {
  // 5 questions: 0 = 전혀 없음, 10 = 가끔, 20 = 자주
  const [scores, setScores] = useState<number[]>(
    student.q3.habitScores?.length === 5 ? student.q3.habitScores : [0, 0, 0, 0, 0]
  );
  const [honestHabit, setHonestHabit] = useState<string>(
    student.q3.honestHabitToFix || ''
  );

  const setQuestionScore = (idx: number, val: number) => {
    const next = [...scores];
    next[idx] = val;
    setScores(next);
  };

  // Battery percentage: 100 - sum(deductions). Range: 0 ~ 100%
  const totalDeductions = scores.reduce((a, b) => a + b, 0);
  const batteryPercent = Math.max(0, 100 - totalDeductions);

  const getBatteryColor = (percent: number) => {
    if (percent >= 80) return 'from-emerald-500 to-green-600';
    if (percent >= 50) return 'from-amber-500 to-yellow-600';
    return 'from-rose-500 to-red-600';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honestHabit.trim().length < 4) return;
    onComplete(scores, batteryPercent, honestHabit.trim());
  };

  const sampleHabits = [
    '밤 10시 넘어서 이불 속에서 유튜브 쇼츠 계속 보는 것',
    '게임할 때 지면 화나서 단톡방에 괜히 짜증 섞인 글 올리는 것',
    '친구가 보낸 카톡을 일부러 읽고 늦게 답장하는 것',
    '숙제할 때 다른 사람 블로그 글을 그대로 베껴 쓰는 것'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-amber-700/50">
        <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-1">
          <BatteryCharging className="w-5 h-5 text-amber-400" />
          <span>Quest 3: 나의 디지털 생활 배터리 점검</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          솔직함이 힘이다! 내 디지털 배터리 진단
        </h2>
        <p className="text-amber-100 text-sm leading-relaxed">
          배터리가 닳았다고 부끄러워할 필요는 없어요. 나의 평소 습관을 정직하게 마주보고 솔직하게 고백할 때, 수호자의 진짜 성장이 시작됩니다!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Real-time Battery Visualization Card */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 text-center sticky top-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              내 디지털 청정 배터리
            </span>

            {/* Giant Battery Graphic */}
            <div className="relative w-36 h-64 mx-auto border-4 border-slate-800 rounded-3xl p-2 bg-slate-900 flex flex-col justify-end shadow-xl">
              {/* Battery Terminal Pin */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-slate-700 rounded-t-md border-t-2 border-x-2 border-slate-800" />

              {/* Liquid Charge Level */}
              <div
                className={`w-full rounded-2xl transition-all duration-700 bg-gradient-to-t ${getBatteryColor(batteryPercent)} relative overflow-hidden`}
                style={{ height: `${batteryPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>

              {/* Centered Percentage Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-extrabold drop-shadow-md">
                <span className="text-4xl">{batteryPercent}%</span>
                <span className="text-xs text-white/90 font-medium mt-1">
                  {batteryPercent >= 80 ? '🌟 모범 가디언' : batteryPercent >= 50 ? '⚡ 주의 요망' : '🔋 긴급 충전 필요'}
                </span>
              </div>
            </div>

            {/* EXP Bonus Tag */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900">솔직 고백 보너스 +50 EXP</div>
                <div className="text-[11px] text-amber-700">고치고 싶은 습관을 적으면 즉시 지급!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 5 Self-diagnosis questions + Honest confession */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  STEP 1
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  5가지 나의 디지털 습관 점검표
                </h3>
              </div>

              <div className="space-y-4">
                {Q3_BATTERY_QUESTIONS.map((q, idx) => {
                  const currentVal = scores[idx] ?? 0;
                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <span className="text-sm font-semibold text-slate-900 leading-snug">
                          {idx + 1}. {q.question}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {q.hint}
                        </span>
                      </div>

                      {/* 3 scale buttons: 전혀 없음 (0점), 가끔 (10점 감점), 자주 (20점 감점) */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 0, label: '전혀 없음 (0)', color: 'border-emerald-400 bg-emerald-50 text-emerald-800' },
                          { val: 10, label: '가끔 있음 (-10%)', color: 'border-amber-400 bg-amber-50 text-amber-800' },
                          { val: 20, label: '자주 있음 (-20%)', color: 'border-rose-400 bg-rose-50 text-rose-800' }
                        ].map(opt => {
                          const isSelected = currentVal === opt.val;
                          return (
                            <button
                              type="button"
                              key={opt.val}
                              onClick={() => setQuestionScore(idx, opt.val)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? `${opt.color} shadow-sm font-extrabold ring-2 ring-offset-1`
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Honest Confession */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    STEP 2
                  </span>
                  <label className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    가장 고치고 싶은 나의 디지털 습관을 솔직하게 적어주세요.
                  </label>
                </div>
                <span className="text-xs text-amber-600 font-semibold">
                  솔직할수록 높은 보너스!
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                선생님만 확인할 수 있으니 꾸밈없이 정직하게 적어보세요. (최소 4자 이상)
              </p>

              <textarea
                value={honestHabit}
                onChange={(e) => setHonestHabit(e.target.value)}
                placeholder="예: 밤 10시 넘어서 침대에서 유튜브 쇼츠를 계속 보는 것"
                rows={3}
                className="w-full text-sm p-4 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none resize-none text-slate-800 placeholder:text-slate-400"
              />

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">예시 참고:</span>
                {sampleHabits.map((h, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setHonestHabit(h)}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
                  >
                    {h.length > 20 ? h.substring(0, 20) + '…' : h}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onPrev}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ← 이전 퀘스트로
              </button>

              <button
                type="submit"
                disabled={honestHabit.trim().length < 4}
                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  honestHabit.trim().length >= 4
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-amber-200'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Q3 완료 & 수호자 다짐으로</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
