import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProgress: (progress: any) => Promise<void>;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
  studyProgress: {
    completedTopics: Record<string, boolean>;
    topicDifficulties: Record<string, string>;
    lastReviewDates: Record<string, string>;
    customThemes: any[];
    performanceLog: any[];
    userProfile: {
      xp: number;
      level: number;
      unlockedAchievements: Record<string, string>;
      lastStudyDate: string | null;
      studyStreak: number;
      completedPomodoros: number;
    };
    scheduleConfig: {
      startDate: string;
      examDate: string;
      maxTopicsPerDay: number;
    };
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Atualizar último login
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          lastLoginAt: new Date().toISOString()
        }, { merge: true });

        // Listen to real-time updates do perfil do usuário
        const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data() as UserProfile);
          }
        });

        return () => unsubscribeProfile();
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createUserProfile = async (user: User, additionalData: any = {}) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const { displayName, email, photoURL } = user;
      const defaultProgress = {
        completedTopics: {},
        topicDifficulties: {},
        lastReviewDates: {},
        customThemes: [],
        performanceLog: [],
        userProfile: {
          xp: 0,
          level: 0,
          unlockedAchievements: {},
          lastStudyDate: null,
          studyStreak: 0,
          completedPomodoros: 0,
        },
        scheduleConfig: {
          startDate: '2025-07-28',
          examDate: '2025-10-19',
          maxTopicsPerDay: 4
        }
      };

      try {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName,
          email,
          photoURL,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          studyProgress: defaultProgress,
          ...additionalData
        });
      } catch (error) {
        console.error('Erro ao criar perfil:', error);
      }
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    await createUserProfile(user);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    await createUserProfile(user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProgress = async (progress: any) => {
    if (!user) return;
    
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      studyProgress: progress,
      lastLoginAt: new Date().toISOString()
    }, { merge: true });
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};