import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, X, AlertCircle, ShieldCheck, Check } from 'lucide-react';

interface Props {
  targetRole: 'teacher' | 'projector';
  onSuccess: () => void;
  onCancel: () => void;
}

const STORAGE_PIN_KEY = 'neo_teacher_custom_pin';
const STORAGE_AUTH_KEY = 'neo_guardian_teacher_auth';

export function hasTeacherPin(): boolean {
  if (typeof window === 'undefined') return false;
  const pin = localStorage.getItem(STORAGE_PIN_KEY);
  return Boolean(pin && pin.length === 4);
}

export function getTeacherPin(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_PIN_KEY);
}

export function setTeacherPin(newPin: string): boolean {
  if (!newPin || newPin.length !== 4 || isNaN(Number(newPin))) return false;
  localStorage.setItem(STORAGE_PIN_KEY, newPin);
  return true;
}

export function verifyTeacherPin(inputPin: string): boolean {
  const current = getTeacherPin();
  if (!current) return false;
  return inputPin === current;
}

export function clearTeacherPinForReset(): void {
  localStorage.removeItem(STORAGE_PIN_KEY);
  sessionStorage.removeItem(STORAGE_AUTH_KEY);
}

export const TeacherPinModal: React.FC<Props> = ({ targetRole, onSuccess, onCancel }) => {
  const isSetupMode = !hasTeacherPin();

  // Setup mode states
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const [firstPin, setFirstPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Normal verify mode states
  const [verifyPin, setVerifyPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [lockCountdown, setLockCountdown] = useState(0);

  // Countdown timer if locked due to brute force protection
  useEffect(() => {
    if (lockCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockCountdown]);

  // Support physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lockCountdown > 0) return;
      if (e.key >= '0' && e.key <= '9') {
        handleDigitInput(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleEnterSubmit();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleDigitInput = (digit: string) => {
    setErrorMsg(null);
    if (isSetupMode) {
      if (setupStep === 1) {
        if (firstPin.length < 4) {
          const next = firstPin + digit;
          setFirstPin(next);
          if (next.length === 4) {
            // Auto advance to confirmation step
            setTimeout(() => setSetupStep(2), 200);
          }
        }
      } else {
        if (confirmPin.length < 4) {
          const next = confirmPin + digit;
          setConfirmPin(next);
          if (next.length === 4) {
            // Validate confirmation
            if (next === firstPin) {
              setTeacherPin(next);
              sessionStorage.setItem(STORAGE_AUTH_KEY, 'true');
              onSuccess();
            } else {
              setErrorMsg('비밀번호가 일치하지 않습니다. 다시 설정해주세요.');
              setTimeout(() => {
                setSetupStep(1);
                setFirstPin('');
                setConfirmPin('');
              }, 900);
            }
          }
        }
      }
    } else {
      if (verifyPin.length < 4) {
        const next = verifyPin + digit;
        setVerifyPin(next);
        if (next.length === 4) {
          submitVerifyPin(next);
        }
      }
    }
  };

  const handleDelete = () => {
    setErrorMsg(null);
    if (isSetupMode) {
      if (setupStep === 1) {
        setFirstPin(prev => prev.slice(0, -1));
      } else {
        setConfirmPin(prev => prev.slice(0, -1));
      }
    } else {
      setVerifyPin(prev => prev.slice(0, -1));
    }
  };

  const submitVerifyPin = (pinToTest: string) => {
    if (verifyTeacherPin(pinToTest)) {
      sessionStorage.setItem(STORAGE_AUTH_KEY, 'true');
      onSuccess();
    } else {
      const nextFail = failCount + 1;
      setFailCount(nextFail);
      setVerifyPin('');
      if (nextFail >= 5) {
        setLockCountdown(30);
        setErrorMsg('연속 5회 불일치: 30초 동안 입력이 제한됩니다.');
      } else {
        setErrorMsg(`비밀번호가 올바르지 않습니다. (오류 ${nextFail}/5)`);
      }
    }
  };

  const handleEnterSubmit = () => {
    if (isSetupMode) {
      if (setupStep === 1 && firstPin.length === 4) {
        setSetupStep(2);
      } else if (setupStep === 2 && confirmPin.length === 4) {
        if (confirmPin === firstPin) {
          setTeacherPin(confirmPin);
          sessionStorage.setItem(STORAGE_AUTH_KEY, 'true');
          onSuccess();
        } else {
          setErrorMsg('비밀번호가 일치하지 않습니다.');
        }
      }
    } else {
      if (verifyPin.length === 4) {
        submitVerifyPin(verifyPin);
      }
    }
  };

  const currentDisplayLength = isSetupMode
    ? setupStep === 1 ? firstPin.length : confirmPin.length
    : verifyPin.length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border-2 border-slate-700 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs sm:text-sm">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>{isSetupMode ? '최초 1회 교사 보안 PIN 설정' : '교사 전용 보안 인증'}</span>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lore / Guidance */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center mx-auto text-amber-400 shadow-md">
            {isSetupMode ? <ShieldCheck className="w-6 h-6 text-emerald-400" /> : <KeyRound className="w-6 h-6 text-amber-400" />}
          </div>

          {isSetupMode ? (
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white pt-1">
                {setupStep === 1 ? '선생님만의 보안 PIN(4자리) 등록' : '비밀번호 확인 입력'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                {setupStep === 1
                  ? '학생 평가 및 생활기록부 보호를 위해 선생님만 기억할 4자리 숫자를 입력하세요.'
                  : '방금 입력하신 4자리 숫자를 한 번 더 입력해주세요.'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-full mt-2">
                <span>※ 학생들에게 노출되지 않도록 직접 설정합니다</span>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white pt-1">
                {targetRole === 'teacher' ? '교사 대시보드 보안 잠금' : '칠판 미러링 모드 잠금'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                학생 평가·생활기록부 열람을 위해<br />
                선생님이 등록하신 4자리 보안 PIN을 입력해주세요.
              </p>
            </div>
          )}
        </div>

        {/* PIN Digits Display (Masked dots) */}
        <div className="flex justify-center gap-3 my-2">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = currentDisplayLength > idx;
            return (
              <div
                key={idx}
                className={`w-11 h-13 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                  isFilled
                    ? 'border-indigo-500 bg-indigo-950/80 text-amber-300 shadow-sm shadow-indigo-500/20 scale-105'
                    : 'border-slate-700 bg-slate-800/60 text-slate-500'
                }`}
              >
                {isFilled ? '●' : ''}
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="text-xs text-rose-300 bg-rose-950/70 border border-rose-800 p-2.5 rounded-xl flex items-center gap-1.5 justify-center">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {lockCountdown > 0 && (
          <div className="text-xs text-amber-400 text-center font-bold">
            보안 대기 중: {lockCountdown}초 후 재시도 가능
          </div>
        )}

        {/* On-screen Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              type="button"
              key={digit}
              disabled={lockCountdown > 0}
              onClick={() => handleDigitInput(digit)}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-bold text-base border border-slate-700 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            disabled={lockCountdown > 0}
            onClick={() => {
              setErrorMsg(null);
              if (isSetupMode) {
                if (setupStep === 1) setFirstPin('');
                else setConfirmPin('');
              } else {
                setVerifyPin('');
              }
            }}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs border border-slate-700 cursor-pointer disabled:opacity-40"
          >
            초기화
          </button>
          <button
            type="button"
            disabled={lockCountdown > 0}
            onClick={() => handleDigitInput('0')}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-bold text-base border border-slate-700 cursor-pointer disabled:opacity-40"
          >
            0
          </button>
          <button
            type="button"
            disabled={lockCountdown > 0}
            onClick={handleDelete}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs border border-slate-700 cursor-pointer disabled:opacity-40"
          >
            ← 지움
          </button>
        </div>

        {/* Action Bottom */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            학생 화면으로
          </button>
          {isSetupMode && setupStep === 2 && (
            <button
              type="button"
              onClick={() => {
                setSetupStep(1);
                setConfirmPin('');
                setErrorMsg(null);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
            >
              다시 입력
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
