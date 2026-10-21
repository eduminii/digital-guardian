import React, { useState } from 'react';
import { Student } from '../../types';
import { Q2_EMOTION_CARDS, Q1_SCENARIOS } from '../../data/initialData';
import { josaIga, josaEunNeun, josaEulReul, josaCalling } from '../../utils/koreanJosa';
import { Search, Sparkles, HeartHandshake, ArrowRight, Check, Wand2 } from 'lucide-react';

interface Props {
  student: Student;
  onComplete: (emotions: string[], magicSentence: string) => void;
  onPrev: () => void;
}

export const Quest2Detective: React.FC<Props> = ({ student, onComplete, onPrev }) => {
  const currentScenario =
    Q1_SCENARIOS.find(s => s.id === student.q1.scenarioId) || Q1_SCENARIOS[0];
  const victimName = currentScenario.victimName || '피해 친구';

  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(
    student.q2.emotionCards || []
  );
  const [magicSentence, setMagicSentence] = useState<string>(
    student.q2.magicSentence || ''
  );

  const toggleEmotion = (label: string) => {
    setSelectedEmotions(prev =>
      prev.includes(label) ? prev.filter(e => e !== label) : [...prev, label]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmotions.length === 0 || magicSentence.trim().length < 5) return;
    onComplete(selectedEmotions, magicSentence.trim());
  };

  const getSampleSuggestions = () => {
    switch (currentScenario.id) {
      case 'soccer_kick':
        return [
          `“${josaCalling(victimName)} 오늘 경기 수고 많았어. 단톡방 말들 너무 마음에 담아두지 마.”`,
          '“누구나 실수할 수 있어. 승패보다 우리 반 친구 사이가 훨씬 소중해!”',
          `“${josaCalling(victimName)} 기운 내! 내일 아침에 같이 학교 가자.”`
        ];
      case 'photo_mock':
        return [
          `“${josaCalling(victimName)} 많이 속상했지? 내가 태민이한테 사진 다 지우라고 말해뒀어.”`,
          '“남의 흑역사를 장난으로 삼는 건 잘못된 거야. 넌 아무 잘못 없어!”',
          `“${josaCalling(victimName)} 울지 마. 내일 우리 같이 맛있는 거 먹자.”`
        ];
      case 'game_scam':
        return [
          `“${josaCalling(victimName)} 박제한다고 협박하는 거 너무 무서웠지? 우리가 도와줄게.”`,
          '“스킨 문제는 내일 학교에서 천천히 해결하면 돼. 절대 겁먹지 마!”',
          '“개인정보 유출은 범죄니까 선생님과 부모님께 알리고 해결하자.”'
        ];
      case 'secret_room':
        return [
          `“${josaCalling(victimName)} 비밀방에서 너 욕한 거 진짜 미안해... 우리가 비겁했어.”`,
          '“뒤에서 수군거리는 건 진짜 나쁜 짓이었어. 진심으로 반성하고 사과할게.”',
          `“${josaCalling(victimName)} 화장실에서 울지 말고 나와. 우리 얼굴 보고 이야기하자.”`
        ];
      default:
        return [
          `“${josaCalling(victimName)} 네 잘못이 아니야. 힘내!”`,
          '“우리가 곁에 있으니까 기죽지 마.”'
        ];
    }
  };

  const sampleSuggestions = getSampleSuggestions();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-cyan-950 text-white rounded-3xl p-5 shadow-lg border border-teal-700/50">
        <div className="flex items-center gap-2 text-teal-300 text-sm font-semibold mb-1">
          <Search className="w-5 h-5 text-amber-300" />
          <span>Quest 2: 사건 탐정 돋보기</span>
          <span className="text-teal-400">•</span>
          <span className="text-amber-300 font-bold">{currentScenario.badge}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          {victimName}의 마음을 비추는 공감 돋보기
        </h2>
        <p className="text-teal-100 text-sm leading-relaxed">
          {currentScenario.title}에서 상처받은 {josaEunNeun(victimName)} 지금 어떤 마음일까요? {victimName}의 마음에 깊이 공감해보고, 닫힌 마음의 문을 여는 ‘마법의 한마디’를 찾아주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-6">
        {/* Step 1: Empathy emotion cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full">
                탐정 단서 1
              </span>
              <label className="text-base font-bold text-slate-900">
                {josaIga(victimName)} 느꼈을 감정 카드를 골라주세요 (1개 이상)
              </label>
            </div>
            <span className="text-xs text-teal-600 font-semibold">
              {selectedEmotions.length}개 선택됨
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Q2_EMOTION_CARDS.map((card) => {
              const isSelected = selectedEmotions.includes(card.label);
              return (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => toggleEmotion(card.label)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50 shadow-sm'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900">{card.label}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      isSelected ? 'bg-teal-600 text-white' : 'border border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Magic Sentence (Alternative response) */}
        <div className="pt-4 border-t border-slate-150">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                탐정 단서 2
              </span>
              <label className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-amber-500" />
                상황을 올바르게 바꿀 수 있는 ‘마법의 한마디’
              </label>
            </div>
            <span className="text-xs text-slate-400">
              {magicSentence.trim().length}자 / 최소 5자
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            상처받은 {josaEulReul(victimName)} 위로하고 갈등을 풀 수 있는 따뜻한 한마디를 적어주세요.
          </p>

          <textarea
            value={magicSentence}
            onChange={(e) => setMagicSentence(e.target.value)}
            placeholder={`예: “${sampleSuggestions[0] || `${josaCalling(victimName)} 힘내...`}”`}
            rows={3}
            className="w-full text-sm p-4 rounded-2xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none resize-none text-slate-800 placeholder:text-slate-400"
          />

          {/* Quick inspiration tags */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">아이디어 힌트:</span>
            {sampleSuggestions.map((s, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setMagicSentence(s)}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
              >
                {s.length > 22 ? s.substring(0, 22) + '…' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
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
            disabled={selectedEmotions.length === 0 || magicSentence.trim().length < 5}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
              selectedEmotions.length > 0 && magicSentence.trim().length >= 5
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-teal-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Q2 완료 & 배터리 진단으로</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
