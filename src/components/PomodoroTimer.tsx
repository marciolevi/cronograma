import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Play, Pause, Square, Clock } from 'lucide-react';

const PomodoroTimer: React.FC = () => {
  const { updateUserProgress, userProfile } = useAuth();
  const [time, setTime] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [currentType, setCurrentType] = useState<'focus' | 'break'>('focus');
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    if (currentType === 'focus') {
      // Completou um pomodoro de foco
      const newProgress = {
        ...userProfile?.studyProgress,
        userProfile: {
          ...userProfile?.studyProgress?.userProfile,
          completedPomodoros: (userProfile?.studyProgress?.userProfile?.completedPomodoros || 0) + 1,
          xp: (userProfile?.studyProgress?.userProfile?.xp || 0) + 3
        }
      };
      
      await updateUserProgress(newProgress);
      
      setCurrentType('break');
      setTime(breakTime * 60);
      alert('Foco finalizado! Hora da pausa.');
    } else {
      setCurrentType('focus');
      setTime(focusTime * 60);
      alert('Pausa finalizada! Hora de focar.');
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(currentType === 'focus' ? focusTime * 60 : breakTime * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        Timer Pomodoro
      </h3>
      
      <div className="text-center">
        <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-6">
          {formatTime(time)}
        </div>
        
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            currentType === 'focus' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {currentType === 'focus' ? '🎯 Foco' : '☕ Pausa'}
          </span>
        </div>
        
        <div className="flex gap-3 justify-center mb-6">
          <button
            onClick={startTimer}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Iniciar
          </button>
          
          <button
            onClick={pauseTimer}
            disabled={!isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pause className="w-4 h-4" />
            Pausar
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Square className="w-4 h-4" />
            Resetar
          </button>
        </div>
        
        <div className="flex gap-4 justify-center text-sm">
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1">Foco (min):</label>
            <input
              type="number"
              value={focusTime}
              onChange={(e) => setFocusTime(Number(e.target.value))}
              min="1"
              max="60"
              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-center"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 dark:text-gray-400 mb-1">Pausa (min):</label>
            <input
              type="number"
              value={breakTime}
              onChange={(e) => setBreakTime(Number(e.target.value))}
              min="1"
              max="30"
              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;