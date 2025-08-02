import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PomodoroTimer from './PomodoroTimer';
import MedicalChatbot from './MedicalChatbot';
import WeekSchedule from './WeekSchedule';
import PerformanceTracker from './PerformanceTracker';
import { originalScheduleData, achievements, studentLevels } from '../data/scheduleData';
import { 
  BarChart3, 
  Trophy, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  Moon, 
  Sun,
  Brain,
  Target,
  Clock,
  BookOpen,
  User,
  TrendingUp,
  Flame,
  Award
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, userProfile, logout, updateUserProgress } = useAuth();
  const [activeSection, setActiveSection] = useState('stats');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado do progresso (sincronizado com Firebase)
  const [progress, setProgress] = useState(userProfile?.studyProgress || {
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
  });

  // Dados do progresso
  const completedTopics = progress?.completedTopics || {};
  const allTopics = [...originalScheduleData, ...(progress?.customThemes || [])];
  const totalTopics = allTopics.filter(t => t.area !== 'rest' && t.area !== 'revisao').length;
  const completedCount = Object.keys(completedTopics).length;
  const completionPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Cálculo de dias restantes
  const examDate = new Date(progress?.scheduleConfig?.examDate || '2025-10-19');
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Revisões pendentes
  const reviewsPending = Object.keys(completedTopics).filter(topic => {
    const lastReview = progress?.lastReviewDates?.[topic];
    if (!lastReview) return false;
    
    const daysSinceReview = Math.floor((today.getTime() - new Date(lastReview).getTime()) / (1000 * 60 * 60 * 24));
    const difficulty = progress?.topicDifficulties?.[topic] || 'medium';
    const reviewInterval = { easy: 15, medium: 7, hard: 3 }[difficulty] || 7;
    
    return daysSinceReview >= reviewInterval;
  }).length;

  // Nível atual do usuário
  const currentLevel = getUserLevel();
  const levelData = studentLevels[currentLevel];
  const nextLevel = currentLevel < studentLevels.length - 1 ? studentLevels[currentLevel + 1] : null;
  const xpProgress = nextLevel ? 
    Math.round(((progress?.userProfile?.xp || 0) - levelData.xpRequired) / (nextLevel.xpRequired - levelData.xpRequired) * 100) : 
    100;

  function getUserLevel() {
    const xp = progress?.userProfile?.xp || 0;
    for (let i = studentLevels.length - 1; i >= 0; i--) {
      if (xp >= studentLevels[i].xpRequired) {
        return i;
      }
    }
    return 0;
  }

  // Sincronização automática com Firebase
  useEffect(() => {
    if (userProfile?.studyProgress) {
      setProgress(userProfile.studyProgress);
    }
  }, [userProfile]);

  // Salvar progresso no Firebase
  const saveProgress = async (newProgress: any) => {
    setProgress(newProgress);
    try {
      await updateUserProgress(newProgress);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    { id: 'achievements', label: 'Conquistas', icon: Trophy },
    { id: 'progress', label: 'Progresso', icon: Target },
    { id: 'pomodoro', label: 'Pomodoro', icon: Clock },
    { id: 'performance', label: 'Desempenho', icon: TrendingUp },
    { id: 'weeks', label: 'Cronograma', icon: Calendar },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 ${color} hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className="text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revalida 2025</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div className="level-avatar text-lg">{levelData.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.displayName || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {levelData.title} • {progress?.userProfile?.xp || 0} XP
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {progress?.userProfile?.studyStreak || 0}
                </span>
              </div>
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-green-500"
                />
              )}
            </div>
            <div className="md:hidden">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.displayName || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Level {progress?.userProfile?.level || 0} • {progress?.userProfile?.xp || 0} XP
                </p>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform`}>
          <nav className="p-6 mt-16 lg:mt-0">
            <ul className="space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === 'stats' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Bem-vindo de volta, {user?.displayName?.split(' ')[0]}! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Aqui está um resumo do seu progresso nos estudos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Temas Concluídos"
                  value={`${completedCount}/${totalTopics}`}
                  icon={<BookOpen className="w-8 h-8" />}
                  color="border-green-500"
                />
                <StatCard
                  title="Dias Restantes"
                  value={daysLeft}
                  icon={<Target className="w-8 h-8" />}
                  color="border-orange-500"
                />
                <StatCard
                  title="Revisões Pendentes"
                  value={reviewsPending}
                  icon={<Clock className="w-8 h-8" />}
                  color="border-blue-500"
                />
                <StatCard
                  title="Progresso Geral"
                  value={`${completionPercentage}%`}
                  icon={<Trophy className="w-8 h-8" />}
                  color="border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Progresso de Estudos
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Temas Concluídos</span>
                        <span className="font-medium">{completedCount}/{totalTopics}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {progress?.userProfile?.studyStreak || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Dias consecutivos
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {progress?.userProfile?.completedPomodoros || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Pomodoros completos
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Sistema de Níveis
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{levelData.avatar}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {levelData.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {levelData.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">XP Atual</span>
                      <span className="font-medium">
                        {progress?.userProfile?.xp || 0} / {nextLevel?.xpRequired || 'MAX'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${xpProgress}%` }}
                      ></div>
                    </div>
                    {nextLevel && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {nextLevel.xpRequired - (progress?.userProfile?.xp || 0)} XP para próximo nível
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Dados Sincronizados na Nuvem ☁️
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status da Sincronização:</p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium">Sincronizado</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Último acesso:</p>
                    <p className="font-medium">Agora</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅ Seu progresso está sendo salvo automaticamente na nuvem. 
                    Você pode acessar de qualquer dispositivo!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-8 h-8" />
                Suas Conquistas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(achievements).map(([key, achievement]) => {
                  const isUnlocked = progress?.userProfile?.unlockedAchievements?.[key];
                  return (
                    <div
                      key={key}
                      className={`p-6 rounded-xl shadow-lg border-2 transition-all ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-600'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`text-3xl ${isUnlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {isUnlocked ? '🏆' : '🔒'}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                            {achievement.title}
                          </h3>
                          <p className={`text-sm ${isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      
                      {isUnlocked && (
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Desbloqueado em {new Date(isUnlocked).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          achievement.category === 'area' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          achievement.category === 'produtividade' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          achievement.category === 'consistencia' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          achievement.category === 'metas' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {achievement.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'performance' && <PerformanceTracker />}
          
          {activeSection === 'pomodoro' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Timer Pomodoro</h2>
              <PomodoroTimer />
            </div>
          )}
          
          {activeSection === 'weeks' && <WeekSchedule />}

          {activeSection === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Perfil do Usuário
                  </h3>
                  <div className="space-y-2">
                    <p><strong>Nome:</strong> {user?.displayName}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Conta criada:</strong> {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
                  </div>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cronograma de Estudos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data de Início
                      </label>
                      <input
                        type="date"
                        value={progress?.scheduleConfig?.startDate || '2025-07-28'}
                        onChange={(e) => {
                          const newProgress = {
                            ...progress,
                            scheduleConfig: {
                              ...progress?.scheduleConfig,
                              startDate: e.target.value
                            }
                          };
                          saveProgress(newProgress);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data da Prova
                      </label>
                      <input
                        type="date"
                        value={progress?.scheduleConfig?.examDate || '2025-10-19'}
                        onChange={(e) => {
                          const newProgress = {
                            ...progress,
                            scheduleConfig: {
                              ...progress?.scheduleConfig,
                              examDate: e.target.value
                            }
                          };
                          saveProgress(newProgress);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Temas por Dia
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={progress?.scheduleConfig?.maxTopicsPerDay || 4}
                        onChange={(e) => {
                          const newProgress = {
                            ...progress,
                            scheduleConfig: {
                              ...progress?.scheduleConfig,
                              maxTopicsPerDay: parseInt(e.target.value)
                            }
                          };
                          saveProgress(newProgress);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Outras seções podem ser adicionadas aqui */}
          {!['stats', 'achievements', 'performance', 'pomodoro', 'weeks', 'settings'].includes(activeSection) && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Esta seção está sendo desenvolvida...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <MedicalChatbot />
    </div>
  );
};

export default Dashboard;