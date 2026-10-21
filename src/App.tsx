/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClassroomSession } from './types';
import { sessionStore } from './services/sessionStore';
import { Navbar } from './components/Navbar';
import { ClassroomPortal } from './components/ClassroomPortal';
import { StudentView } from './components/student/StudentView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ProjectorView } from './components/teacher/ProjectorView';
import { TeacherPinModal } from './components/teacher/TeacherPinModal';

export default function App() {
  const [session, setSession] = useState<ClassroomSession>(sessionStore.getSession());
  const [currentRole, setCurrentRole] = useState<'portal' | 'teacher' | 'student' | 'projector'>(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('neo_guardian_teacher_auth') === 'true';
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      if (roleParam === 'teacher' || roleParam === 'projector') {
        return isAuth ? roleParam : 'portal';
      }
      if (roleParam === 'student') return 'student';
      // Default initial screen is the Classroom Portal landing
      return 'portal';
    }
    return 'portal';
  });

  const [currentStudentNo, setCurrentStudentNo] = useState<number>(2); // Default to 2번 김민우 for convenient demo
  const [portalPinModalRole, setPortalPinModalRole] = useState<'teacher' | 'projector' | null>(null);

  useEffect(() => {
    // Check URL parameters for studentNo
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const studentParam = params.get('student');
      if (studentParam && !isNaN(Number(studentParam))) {
        setCurrentStudentNo(Number(studentParam));
      }
    }

    const unsubscribe = sessionStore.subscribe((updatedSession) => {
      setSession({ ...updatedSession });
    });
    return () => unsubscribe();
  }, []);

  const handlePortalTeacherEntry = () => {
    const isAuth = sessionStorage.getItem('neo_guardian_teacher_auth') === 'true';
    if (isAuth) {
      setCurrentRole('teacher');
    } else {
      setPortalPinModalRole('teacher');
    }
  };

  const handlePortalProjectorEntry = () => {
    const isAuth = sessionStorage.getItem('neo_guardian_teacher_auth') === 'true';
    if (isAuth) {
      setCurrentRole('projector');
    } else {
      setPortalPinModalRole('projector');
    }
  };

  const handlePortalStudentEntry = (studentNo: number, name: string) => {
    setCurrentStudentNo(studentNo);
    setCurrentRole('student');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        session={session}
      />

      {/* Main View Router */}
      <div className="flex-1 flex flex-col">
        {currentRole === 'portal' && (
          <ClassroomPortal
            session={session}
            onEnterAsStudent={handlePortalStudentEntry}
            onEnterAsTeacher={handlePortalTeacherEntry}
            onEnterAsProjector={handlePortalProjectorEntry}
          />
        )}

        {currentRole === 'teacher' && (
          <TeacherDashboard
            session={session}
            onOpenProjector={() => setCurrentRole('projector')}
            onLockSession={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('neo_guardian_teacher_auth');
              }
              setCurrentRole('portal');
            }}
          />
        )}

        {currentRole === 'student' && (
          <StudentView
            currentStudentNo={currentStudentNo}
            session={session}
            onChangeStudent={(no) => setCurrentStudentNo(no)}
          />
        )}

        {currentRole === 'projector' && (
          <ProjectorView
            session={session}
            onExit={() => setCurrentRole('teacher')}
          />
        )}
      </div>

      {/* Portal PIN authentication modal */}
      {portalPinModalRole && (
        <TeacherPinModal
          targetRole={portalPinModalRole}
          onSuccess={() => {
            const role = portalPinModalRole;
            setPortalPinModalRole(null);
            setCurrentRole(role);
          }}
          onCancel={() => setPortalPinModalRole(null)}
        />
      )}
    </div>
  );
}
