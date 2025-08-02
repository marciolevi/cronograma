import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Search, Filter, ChevronDown, ChevronRight, Brain } from 'lucide-react';
import { originalScheduleData } from '../data/scheduleData';

interface Topic {
  theme: string;
  area: string;
}

interface Day {
  date: Date;
  themes: Topic[];
  isRest: boolean;
}

interface Week {
  week: number;
  title: string;
  days: Day[];
}

const WeekSchedule: React.FC = () => {
  const { userProfile, updateUserProgress } = useAuth();
  const [schedule, setSchedule] = useState<Week[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));

  const progress = userProfile?.studyProgress || {};
  const completedTopics = progress.completedTopics || {};
  const customThemes = progress.customThemes || [];
  const scheduleConfig = progress.scheduleConfig || {
    startDate: '2025-07-28',
    examDate: '2025-10-19',
    maxTopicsPerDay: 4
  };

  useEffect(() => {
    generateSchedule();
  }, [userProfile]);

  const generateSchedule = () => {
    const allTopics = [...originalScheduleData, ...customThemes];
    const studyDays = getStudyDays(scheduleConfig.startDate, scheduleConfig.examDate);
    const distributedDays = distributeTopics(allTopics, studyDays, scheduleConfig.maxTopicsPerDay);
    const newSchedule = buildSchedule(distributedDays);
    setSchedule(newSchedule);
  };

  const getStudyDays = (startDateStr: string, endDateStr: string): Date[] => {
    const studyDays: Date[] = [];
    let currentDate = new Date(`${startDateStr}T12:00:00Z`);
    const endDate = new Date(`${endDateStr}T12:00:00Z`);
    
    while (currentDate <= endDate) {
      if (currentDate.getUTCDay() !== 0) { // Pula domingos
        studyDays.push(new Date(currentDate));
      }
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    
    return studyDays;
  };

  const distributeTopics = (topics: Topic[], studyDays: Date[], maxTopicsPerDay: number) => {
    let topicIndex = 0;
    const distributedDays: Day[] = [];
    
    for (let dayIndex = 0; dayIndex < studyDays.length; dayIndex++) {
      const weekIndex = Math.floor(dayIndex / 6);
      const topicsForThisDay = Math.min(weekIndex + 1, maxTopicsPerDay);
      const assignedTopics: Topic[] = [];
      
      if (topicIndex < topics.length) {
        for (let i = 0; i < topicsForThisDay && topicIndex < topics.length; i++) {
          assignedTopics.push(topics[topicIndex]);
          topicIndex++;
        }
      }
      
      distributedDays.push({
        date: studyDays[dayIndex],
        themes: assignedTopics,
        isRest: false
      });
    }
    
    return distributedDays.filter(d => d.themes.length > 0);
  };

  const buildSchedule = (distributedDays: Day[]): Week[] => {
    if (!distributedDays || distributedDays.length === 0) return [];
    
    const weeks: Week[] = [];
    let weekChunk: Day[] = [];
    
    distributedDays.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    for (const day of distributedDays) {
      if (weekChunk.length > 0 && day.date.getUTCDay() === 1) {
        weeks.push(buildWeek(weekChunk, weeks.length));
        weekChunk = [];
      }
      weekChunk.push(day);
    }
    
    if (weekChunk.length > 0) {
      weeks.push(buildWeek(weekChunk, weeks.length));
    }
    
    return weeks;
  };

  const buildWeek = (weekDays: Day[], weekIndex: number): Week => {
    const dayMap = new Map(weekDays.map(d => [d.date.getUTCDay(), d]));
    let firstDayOfWeek = new Date(weekDays[0].date);
    let dayOfWeek = firstDayOfWeek.getUTCDay();
    
    if (dayOfWeek === 0) dayOfWeek = 7;
    firstDayOfWeek.setUTCDate(firstDayOfWeek.getUTCDate() - (dayOfWeek - 1));

    const fullWeekDays: Day[] = [];
    
    for (let i = 1; i <= 7; i++) {
      const currentDay = new Date(firstDayOfWeek);
      currentDay.setUTCDate(firstDayOfWeek.getUTCDate() + i - 1);
      const dayData = dayMap.get(currentDay.getUTCDay());
      
      if (currentDay.getUTCDay() === 0) { // Domingo
        fullWeekDays.push({
          date: currentDay,
          themes: [{ theme: 'DESCANSO', area: 'rest' }],
          isRest: true
        });
      } else {
        fullWeekDays.push({
          date: currentDay,
          themes: dayData ? dayData.themes : [],
          isRest: false
        });
      }
    }

    const weekStartDate = fullWeekDays[0].date;
    const weekEndDate = fullWeekDays[5].date;
    
    return {
      week: weekIndex + 1,
      title: `Semana ${weekIndex + 1}: ${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`,
      days: fullWeekDays
    };
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getAreaName = (area: string): string => {
    const names: Record<string, string> = {
      preventiva: "PREV",
      pediatria: "PED",
      ginecologia: "GIN",
      obstetricia: "OBS",
      clinica: "CLM",
      cirurgia: "CIR",
      psiquiatria: "PSI",
      revisao: "REV",
      rest: "Off"
    };
    return names[area] || "Geral";
  };

  const handleTopicComplete = async (topic: string, completed: boolean) => {
    const newCompletedTopics = { ...completedTopics };
    const newLastReviewDates = { ...progress.lastReviewDates };
    
    if (completed) {
      newCompletedTopics[topic] = true;
      newLastReviewDates[topic] = new Date().toISOString();
    } else {
      delete newCompletedTopics[topic];
      delete newLastReviewDates[topic];
    }

    const newProgress = {
      ...progress,
      completedTopics: newCompletedTopics,
      lastReviewDates: newLastReviewDates
    };

    await updateUserProgress(newProgress);
  };

  const generateFlashcard = async (theme: string) => {
    // Implementar geração de flashcard com IA
    alert(`Gerando flashcard para: ${theme}`);
  };

  const toggleWeek = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const filteredSchedule = schedule.filter(week => {
    if (searchTerm) {
      return week.days.some(day => 
        day.themes.some(theme => 
          theme.theme.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (areaFilter !== 'all') {
      return week.days.some(day => 
        day.themes.some(theme => theme.area === areaFilter)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Cronograma de Estudos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Buscar tema:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do tema..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Filtrar por área:
            </label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todas as áreas</option>
              <option value="preventiva">Preventiva</option>
              <option value="pediatria">Pediatria</option>
              <option value="ginecologia">Ginecologia</option>
              <option value="obstetricia">Obstetrícia</option>
              <option value="clinica">Clínica</option>
              <option value="cirurgia">Cirurgia</option>
              <option value="psiquiatria">Psiquiatria</option>
              <option value="revisao">Revisão</option>
            </select>
          </div>
        </div>
      </div>

      {filteredSchedule.map((week) => (
        <div key={week.week} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 cursor-pointer hover:from-green-700 hover:to-green-800 transition-colors"
            onClick={() => toggleWeek(week.week)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{week.title}</h3>
              {expandedWeeks.has(week.week) ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </div>
          </div>
          
          {expandedWeeks.has(week.week) && (
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-3 border-b border-gray-200 dark:border-gray-600 font-semibold text-gray-900 dark:text-white">
                        Dia
                      </th>
                      <th className="text-left p-3 border-b border-gray-200 dark:border-gray-600 font-semibold text-gray-900 dark:text-white">
                        Temas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {week.days.map((day, dayIndex) => (
                      <tr key={dayIndex} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${day.isRest ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}>
                        <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {dayNames[day.date.getUTCDay()]}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(day.date)}
                          </div>
                        </td>
                        <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                          {day.isRest ? (
                            <div className="text-center italic text-gray-600 dark:text-gray-400">
                              {day.themes[0].theme}
                            </div>
                          ) : day.themes.length === 0 ? (
                            <div className="text-center italic text-gray-500 dark:text-gray-400">
                              Dia livre
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {day.themes.map((theme, themeIndex) => (
                                <div key={themeIndex} className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                  <input
                                    type="checkbox"
                                    checked={!!completedTopics[theme.theme]}
                                    onChange={(e) => handleTopicComplete(theme.theme, e.target.checked)}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                  />
                                  <div className="flex-1">
                                    <div className={`font-medium ${completedTopics[theme.theme] ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                      {theme.theme}
                                    </div>
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full text-white bg-${theme.area === 'preventiva' ? 'green' : theme.area === 'pediatria' ? 'blue' : theme.area === 'ginecologia' ? 'purple' : theme.area === 'obstetricia' ? 'indigo' : theme.area === 'clinica' ? 'red' : theme.area === 'cirurgia' ? 'orange' : theme.area === 'psiquiatria' ? 'gray' : 'gray'}-600`}>
                                      {getAreaName(theme.area)}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => generateFlashcard(theme.theme)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                                  >
                                    <Brain className="w-3 h-3" />
                                    IA
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WeekSchedule;