import React, { createContext, useState, useEffect } from 'react';
import { INITIAL_REPORTS, EDUCATION_ARTICLES } from '../utils/mockData';
import { db, isFirebaseConfigured } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

export const AppContext = createContext();

const DEFAULT_USERS = [
  { 
    username: "budi", 
    password: "123", 
    name: "Budi Santoso", 
    points: 120, 
    completedQuizzes: [] 
  }
];

const DEFAULT_ANNOUNCEMENTS = [
  { id: 'ann-1', text: '🌿 Gotong Royong bersih desa dilaksanakan setiap Minggu pukul 07.00 WIB — Seluruh warga diharapkan hadir.' },
  { id: 'ann-2', text: '💧 Jadwal giliran air bersih PDAM: RT 01–03 (Senin & Kamis) | RT 04–06 (Selasa & Jumat).' },
  { id: 'ann-3', text: '🗑️ Pengangkutan sampah terjadwal tiap Selasa dan Sabtu pagi. Harap letakkan tempat sampah di depan rumah sebelum pukul 06.00.' },
  { id: 'ann-4', text: '📋 Posyandu Balita & Lansia: Kamis pertama setiap bulan di Balai Desa pukul 08.00–12.00 WIB.' }
];

export const AppProvider = ({ children }) => {
  // Announcements State
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('smartvillage_announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved announcements', e);
      }
    }
    return DEFAULT_ANNOUNCEMENTS;
  });

  // Reports State
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('smartvillage_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved reports', e);
      }
    }
    return [];
  });

  // User Registry State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('smartvillage_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return DEFAULT_USERS;
  });

  // Articles State (Dynamic educational contents & mini-quizzes)
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('smartvillage_articles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved articles', e);
      }
    }
    return EDUCATION_ARTICLES;
  });

  // App Navigation and Roles
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('warga'); // start as citizen (Warga) by default (Guest mode)
  
  // Warga report form visibility shared state
  const [showReportForm, setShowReportForm] = useState(false);

  // Auth Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'admin'
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Current Logged-in User State (Warga)
  const [currentUser, setCurrentUser] = useState(null);

  // Derived states from currentUser
  const userPoints = currentUser ? currentUser.points : 0;
  const completedQuizzes = currentUser ? currentUser.completedQuizzes : [];

  // ==================== FIREBASE REALTIME LISTENERS ====================
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    // Realtime Announcements Listener
    const unsubAnn = onSnapshot(collection(db, "announcements"), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnnouncements(list);
      }
    }, (err) => console.error("Firestore announcements listener error:", err));

    // Realtime Reports Listener
    const unsubRep = onSnapshot(collection(db, "reports"), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReports(list);
      }
    }, (err) => console.error("Firestore reports listener error:", err));

    // Realtime Users Listener
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(list);
      }
    }, (err) => console.error("Firestore users listener error:", err));

    // Realtime Articles Listener
    const unsubArticles = onSnapshot(collection(db, "articles"), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticles(list);
      }
    }, (err) => console.error("Firestore articles listener error:", err));

    return () => {
      unsubAnn();
      unsubRep();
      unsubUsers();
      unsubArticles();
    };
  }, []);

  // Sync to localStorage as fallback
  useEffect(() => {
    localStorage.setItem('smartvillage_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('smartvillage_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('smartvillage_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('smartvillage_articles', JSON.stringify(articles));
  }, [articles]);

  // Announcements CRUD functions
  const addAnnouncement = async (text) => {
    if (!text.trim()) return;
    const newAnn = {
      id: `ann-${Date.now()}`,
      text: text.trim()
    };
    setAnnouncements(prev => [...prev, newAnn]);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "announcements", newAnn.id), newAnn);
      } catch (e) {
        console.error("Failed to add announcement to Firebase:", e);
      }
    }
  };

  const updateAnnouncement = async (id, text) => {
    if (!text.trim()) return;
    setAnnouncements(prev => 
      prev.map(ann => ann.id === id ? { ...ann, text: text.trim() } : ann)
    );

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, "announcements", id), { text: text.trim() });
      } catch (e) {
        console.error("Failed to update announcement in Firebase:", e);
      }
    }
  };

  const deleteAnnouncement = async (id) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "announcements", id));
      } catch (e) {
        console.error("Failed to delete announcement from Firebase:", e);
      }
    }
  };

  // Register a new citizen account
  const registerUser = async (username, password, name) => {
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      return { success: false, message: 'Username sudah digunakan' };
    }

    const newUser = {
      username: username.toLowerCase(),
      password,
      name,
      points: 0,
      completedQuizzes: []
    };

    setUsers(prev => [...prev, newUser]);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "users", newUser.username), newUser);
      } catch (e) {
        console.error("Failed to register user to Firebase:", e);
      }
    }

    return { success: true };
  };

  // Reset citizen password
  const resetPassword = async (username, newPassword) => {
    const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (!userExists) {
      return { success: false, message: 'Username tidak ditemukan' };
    }

    setUsers(prev => 
      prev.map(u => 
        u.username.toLowerCase() === username.toLowerCase() 
          ? { ...u, password: newPassword } 
          : u
      )
    );

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, "users", username.toLowerCase()), { password: newPassword });
      } catch (e) {
        console.error("Failed to update password in Firebase:", e);
      }
    }

    return { success: true };
  };

  // Login a citizen
  const loginUser = (username, password) => {
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setUserRole('warga');
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return { success: false, message: 'Username atau Password salah' };
  };

  // Login an admin
  const loginAdmin = (pin) => {
    if (pin.toLowerCase() === 'admin') {
      setUserRole('admin');
      setActiveTab('admin_reports');
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, message: 'PIN Admin salah. Silakan coba lagi.' };
  };

  // Logout / Switch roles
  const logout = () => {
    setCurrentUser(null);
    setUserRole('warga');
    setActiveTab('dashboard');
    setIsAuthModalOpen(false);
    setShowReportForm(false);
  };

  // Submit a citizen report
  const addReport = async (newReport) => {
    const reportWithId = {
      ...newReport,
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      adminNote: "",
    };
    setReports((prev) => [reportWithId, ...prev]);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "reports", reportWithId.id), reportWithId);
      } catch (e) {
        console.error("Failed to add report to Firebase:", e);
      }
    }
  };

  // Admin updates report status and optionally awards points
  const updateReportStatus = async (id, newStatus, adminNote = "", pointsToAward = 0) => {
    let targetReport = null;

    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          targetReport = {
            ...rep,
            status: newStatus,
            adminNote: adminNote !== undefined ? adminNote : rep.adminNote,
            pointsAwarded: pointsToAward > 0 ? (rep.pointsAwarded || 0) + pointsToAward : rep.pointsAwarded
          };

          if (pointsToAward > 0 && !rep.pointsAwarded) {
            setUsers(prevUsers =>
              prevUsers.map(u => {
                if (u.name.toLowerCase() === rep.reporterName.toLowerCase() || 
                    (currentUser && u.username === currentUser.username && rep.reporterName === currentUser.name)) {
                  const updatedUser = { ...u, points: u.points + pointsToAward };
                  if (currentUser && u.username === currentUser.username) {
                    setCurrentUser(updatedUser);
                  }
                  if (isFirebaseConfigured && db) {
                    updateDoc(doc(db, "users", u.username), { points: updatedUser.points }).catch(console.error);
                  }
                  return updatedUser;
                }
                return u;
              })
            );
          }

          return targetReport;
        }
        return rep;
      })
    );

    if (isFirebaseConfigured && db && targetReport) {
      try {
        await setDoc(doc(db, "reports", id), targetReport, { merge: true });
      } catch (e) {
        console.error("Failed to update report status in Firebase:", e);
      }
    }
  };

  const deleteReport = async (id) => {
    setReports((prev) => prev.filter((rep) => rep.id !== id));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "reports", id));
      } catch (e) {
        console.error("Failed to delete report from Firebase:", e);
      }
    }
  };

  // CRUD actions for Articles & Quizzes
  const addArticle = async (newArticle) => {
    const articleWithId = {
      ...newArticle,
      id: `edu-${Math.floor(100 + Math.random() * 900)}`
    };
    setArticles((prev) => [...prev, articleWithId]);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "articles", articleWithId.id), articleWithId);
      } catch (e) {
        console.error("Failed to add article to Firebase:", e);
      }
    }
  };

  const updateArticle = async (id, updatedArticle) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updatedArticle } : art))
    );

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "articles", id), updatedArticle, { merge: true });
      } catch (e) {
        console.error("Failed to update article in Firebase:", e);
      }
    }
  };

  const deleteArticle = async (id) => {
    setArticles((prev) => prev.filter((art) => art.id !== id));

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "articles", id));
      } catch (e) {
        console.error("Failed to delete article from Firebase:", e);
      }
    }
  };

  // Award points to active user
  const addPoints = async (points) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, points: currentUser.points + points };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.username === currentUser.username ? updatedUser : u));

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, "users", currentUser.username), { points: updatedUser.points });
      } catch (e) {
        console.error("Failed to add points in Firebase:", e);
      }
    }
  };

  // Mark quiz as completed for active user
  const markQuizCompleted = async (quizId) => {
    if (!currentUser) return;
    if (!currentUser.completedQuizzes.includes(quizId)) {
      const updatedUser = { 
        ...currentUser, 
        completedQuizzes: [...currentUser.completedQuizzes, quizId] 
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.username === currentUser.username ? updatedUser : u));

      if (isFirebaseConfigured && db) {
        try {
          await updateDoc(doc(db, "users", currentUser.username), { completedQuizzes: updatedUser.completedQuizzes });
        } catch (e) {
          console.error("Failed to mark quiz completed in Firebase:", e);
        }
      }
    }
  };

  // Reset data
  const resetData = () => {
    setReports([]);
    setUsers(DEFAULT_USERS);
    setArticles(EDUCATION_ARTICLES);
    setAnnouncements(DEFAULT_ANNOUNCEMENTS);
    setCurrentUser(null);
    setUserRole('warga');
    setActiveTab('dashboard');
    setIsAuthModalOpen(false);
    setShowReportForm(false);
    localStorage.removeItem('smartvillage_reports');
    localStorage.removeItem('smartvillage_users');
    localStorage.removeItem('smartvillage_articles');
    localStorage.removeItem('smartvillage_announcements');
  };

  // Open Auth modal helper
  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        reports,
        userPoints,
        completedQuizzes,
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        users,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        showReportForm,
        setShowReportForm,
        isPrivacyModalOpen,
        setIsPrivacyModalOpen,
        registerUser,
        loginUser,
        resetPassword,
        loginAdmin,
        logout,
        addReport,
        updateReportStatus,
        deleteReport,
        addPoints,
        markQuizCompleted,
        resetData,
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
