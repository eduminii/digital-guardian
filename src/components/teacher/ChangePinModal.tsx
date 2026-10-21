import React, { useState } from 'react';
import { KeyRound, X, Check, AlertCircle } from 'lucide-react';
import { setTeacherPin, verifyTeacherPin } from './TeacherPinModal';

interface Props {
  onClose: () => void;
}

export const ChangePinModal: React.FC<Props> = ({ onClose }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!verifyTeacherPin(currentPin)) {
      setErrorMsg('현재 설정된 보안 PIN이 일치하지 않습니다.');
      return;
    }

    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setErrorMsg('새 PIN은 4자리 숫자여야 합니다.');
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMsg('새 PIN과 확인 번호가 일치하지 않습니다.');
      return;
    }

    const ok = setTeacherPin(newPin);
    if (ok) {
      setSuccessNotice(true);
      setErrorMsg(null);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span>교사 보안 PIN 변경</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successNotice ? (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-center space-y-2">
            <Check className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="font-bold text-sm">보안 PIN이 성공적으로 변경되었습니다!</div>
            <div className="text-xs text-emerald-700">다음 로그인부터 새 PIN이 적용됩니다.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                현재 PIN 번호
              </label>
              <input
                type="password"
                maxLength={4}
                value={currentPin}
                onChange={(e) => { setCurrentPin(e.target.value); setErrorMsg(null); }}
                placeholder="현재 4자리 PIN"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                새로운 4자리 PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => { setNewPin(e.target.value); setErrorMsg(null); }}
                placeholder="숫자 4자리"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                새로운 PIN 확인
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => { setConfirmPin(e.target.value); setErrorMsg(null); }}
                placeholder="새 PIN 한 번 더 입력"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-none"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                PIN 저장하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
