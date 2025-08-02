// Dados originais do cronograma
export const originalScheduleData = [
  { theme: "Atenção Básica", area: "preventiva" },
  { theme: "Ética Médica (Aspectos gerais, sigilo)", area: "preventiva" },
  { theme: "Revisão Leve: Confiança no processo", area: "revisao" },
  { theme: "Descanso e Organização", area: "revisao" },
  { theme: "DESCANSO TOTAL", area: "revisao" },
  // Adicione mais temas conforme necessário
];

export const motivationalQuotes = [
  "Cada página estudada é um passo mais perto do seu sonho de médico! 💉",
  "Você é mais forte do que qualquer desafio do Revalida! 🚀",
  "Foco e determinação: você vai conquistar o Enamed! 🩺",
  "A jornada é longa, mas sua dedicação é imbatível! 🌟",
  "Estude com paixão, você está moldando o futuro da saúde! ❤️"
];

export const studentLevels = [
  { title: "Estudante Iniciante", avatar: "👶", xpRequired: 0, description: "Começando sua jornada médica" },
  { title: "Interno Virtual", avatar: "👨‍⚕️", xpRequired: 100, description: "Primeiros passos na prática clínica" },
  { title: "R1 Clínico", avatar: "👩‍⚕️", xpRequired: 200, description: "Residência médica - 1º ano" },
  { title: "R2 Cirúrgico", avatar: "🧑‍⚕️", xpRequired: 350, description: "Residência médica - 2º ano" },
  { title: "R3 Especialista", avatar: "👨‍🔬", xpRequired: 550, description: "Residência médica - 3º ano" },
  { title: "Especialista Júnior", avatar: "👩‍🔬", xpRequired: 800, description: "Formação especializada completa" },
  { title: "Especialista Pleno", avatar: "👨‍🎓", xpRequired: 1100, description: "Experiência clínica consolidada" },
  { title: "Mestre em Medicina", avatar: "👩‍🎓", xpRequired: 1500, description: "Domínio da especialidade" },
  { title: "Professor Doutor", avatar: "👨‍🏫", xpRequired: 2000, description: "Compartilhando conhecimento" },
  { title: "Chefe de Serviço", avatar: "👩‍🏫", xpRequired: 2600, description: "Liderança na área médica" },
  { title: "Lenda Médica", avatar: "🦸", xpRequired: 3300, description: "Excelência e reconhecimento" }
];

export const XP_VALUES = {
  completeTopic: 15,
  dailyStreak: 5,
  pomodoroComplete: 3,
  performanceEntry: 20,
  achievementUnlocked: 50
};

export const achievements = {
  clinicoRaiz: { 
    title: "Clínico Raiz", 
    description: "Finalizou todos os temas de Clínica Médica.", 
    icon: "fas fa-stethoscope", 
    category: "area" 
  },
  goWarrior: { 
    title: "GO Warrior", 
    description: "Finalizou Ginecologia e Obstetrícia.", 
    icon: "fas fa-baby-carriage", 
    category: "area" 
  },
  miniCirurgiao: { 
    title: "Mini-Cirurgião", 
    description: "Completou os temas de Cirurgia Geral.", 
    icon: "fas fa-scalpel", 
    category: "area" 
  },
  pediatraMirim: { 
    title: "Pediatra Mirim", 
    description: "Concluiu todos os temas de Pediatria.", 
    icon: "fas fa-child", 
    category: "area" 
  },
  mestrePreventiva: { 
    title: "Mestre da Preventiva", 
    description: "Terminou os temas de Saúde Coletiva.", 
    icon: "fas fa-users", 
    category: "area" 
  },
  psiquiatraHonorario: { 
    title: "Psiquiatra Honorário", 
    description: "Finalizou os temas de Psiquiatria.", 
    icon: "fas fa-brain", 
    category: "area" 
  },
  leaoSimulado: { 
    title: "Leão de Simulado", 
    description: "Fez 5 registros de simulado/questões.", 
    icon: "fas fa-award", 
    category: "produtividade" 
  },
  focoTotal: { 
    title: "Foco Total", 
    description: "Usou o Pomodoro por 10 ciclos completos.", 
    icon: "fas fa-clock", 
    category: "produtividade" 
  },
  modoTurbo: { 
    title: "Modo Turbo", 
    description: "Estudou todos os dias úteis da semana.", 
    icon: "fas fa-bolt", 
    category: "produtividade" 
  },
  chatbotExplorer: { 
    title: "Explorador IA", 
    description: "Fez 10 perguntas para a IA médica.", 
    icon: "fas fa-robot", 
    category: "produtividade" 
  },
  streak1: { 
    title: "Primeiro Passo", 
    description: "1º dia consecutivo de estudo.", 
    icon: "fas fa-shoe-prints", 
    category: "consistencia" 
  },
  streak5: { 
    title: "5 Dias no Ritmo", 
    description: "Cinco dias seguidos estudando.", 
    icon: "fas fa-fire", 
    category: "consistencia" 
  },
  streak14: { 
    title: "Study Beast", 
    description: "14 dias seguidos sem falhar.", 
    icon: "fas fa-meteor", 
    category: "consistencia" 
  },
  streak30: { 
    title: "Insano do Revalida", 
    description: "30 dias de estudo consecutivos.", 
    icon: "fas fa-crown", 
    category: "consistencia" 
  },
  semanaPerfeita: { 
    title: "Semana Perfeita", 
    description: "Cumpriu 100% da meta da semana atual.", 
    icon: "fas fa-check-double", 
    category: "metas" 
  },
  comecouNaSegunda: { 
    title: "Começou na Segunda", 
    description: "Iniciou a jornada numa segunda-feira.", 
    icon: "fas fa-calendar-day", 
    category: "secretas" 
  },
  vaiComTudo: { 
    title: "Vai com Tudo!", 
    description: "Estudou e fez simulado no mesmo dia.", 
    icon: "fas fa-bomb", 
    category: "secretas" 
  }
};