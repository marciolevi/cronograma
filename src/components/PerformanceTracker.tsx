import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Plus, Trash2, ExternalLink } from 'lucide-react';

interface PerformanceEntry {
  id: number;
  date: string;
  topic: string;
  attempted: number;
  correct: number;
}

const PerformanceTracker: React.FC = () => {
  const { userProfile, updateUserProgress } = useAuth();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    attempted: '',
    correct: ''
  });

  const progress = userProfile?.studyProgress || {};
  const performanceLog = progress.performanceLog || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { date, topic, attempted, correct } = formData;
    
    if (!date || !topic || !attempted || !correct) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const attemptedNum = parseInt(attempted);
    const correctNum = parseInt(correct);

    if (correctNum > attemptedNum || attemptedNum <= 0) {
      alert('Valores inválidos.');
      return;
    }

    const newEntry: PerformanceEntry = {
      id: Date.now(),
      date,
      topic,
      attempted: attemptedNum,
      correct: correctNum
    };

    const newPerformanceLog = [...performanceLog, newEntry];
    const newProgress = {
      ...progress,
      performanceLog: newPerformanceLog,
      userProfile: {
        ...progress.userProfile,
        xp: (progress.userProfile?.xp || 0) + 20 // XP por registro de performance
      }
    };

    await updateUserProgress(newProgress);

    // Limpar formulário
    setFormData({
      date: new Date().toISOString().split('T')[0],
      topic: '',
      attempted: '',
      correct: ''
    });

    alert('Registro salvo!');
  };

  const deleteEntry = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    const newPerformanceLog = performanceLog.filter((entry: PerformanceEntry) => entry.id !== id);
    const newProgress = {
      ...progress,
      performanceLog: newPerformanceLog
    };

    await updateUserProgress(newProgress);
  };

  const getPercentageClass = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 font-semibold';
    if (percentage >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const sortedLog = [...performanceLog].sort((a: PerformanceEntry, b: PerformanceEntry) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Registro de Desempenho
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Anote aqui seus resultados em simulados e listas de exercícios.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data:
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tema:
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="Ex: Cardiologia"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Questões:
            </label>
            <input
              type="number"
              value={formData.attempted}
              onChange={(e) => setFormData({ ...formData, attempted: e.target.value })}
              min="1"
              placeholder="Ex: 50"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Acertos:
            </label>
            <input
              type="number"
              value={formData.correct}
              onChange={(e) => setFormData({ ...formData, correct: e.target.value })}
              min="0"
              placeholder="Ex: 42"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Salvar
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <a
            href="https://app.hardworq.com.br/signin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            HardWorq
          </a>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Utilize o banco de questões gratuitas do HardWorq
          </span>
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Histórico de Registros
        </h3>

        {sortedLog.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Nenhum registro de desempenho ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Data</th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Tema</th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Questões</th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Acertos</th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">%</th>
                  <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedLog.map((entry: PerformanceEntry) => {
                  const percentage = Math.round((entry.correct / entry.attempted) * 100);
                  return (
                    <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3 text-gray-900 dark:text-white">
                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">{entry.topic}</td>
                      <td className="p-3 text-gray-900 dark:text-white">{entry.attempted}</td>
                      <td className="p-3 text-gray-900 dark:text-white">{entry.correct}</td>
                      <td className={`p-3 ${getPercentageClass(percentage)}`}>
                        {percentage}%
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTracker;