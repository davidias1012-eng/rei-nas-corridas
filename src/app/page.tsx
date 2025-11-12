'use client'

import { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Utensils, 
  Activity,
  User,
  Settings,
  Plus,
  CheckCircle,
  Timer,
  Zap,
  Award,
  BarChart3,
  Apple,
  Droplets,
  Flame
} from 'lucide-react'

interface WorkoutPlan {
  id: string
  name: string
  duration: string
  intensity: 'Baixa' | 'Moderada' | 'Alta'
  description: string
  exercises: string[]
}

interface NutritionPlan {
  id: string
  meal: string
  time: string
  foods: string[]
  calories: number
  notes: string
}

interface UserProgress {
  date: string
  distance: number
  time: string
  pace: string
  calories: number
}

const workoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Iniciante - Base Aeróbica',
    duration: '30 min',
    intensity: 'Baixa',
    description: 'Desenvolvimento da capacidade aeróbica básica',
    exercises: [
      '5 min aquecimento caminhada',
      '20 min corrida leve (conversação)',
      '5 min caminhada desaceleração'
    ]
  },
  {
    id: '2',
    name: 'Intermediário - Intervalado',
    duration: '45 min',
    intensity: 'Moderada',
    description: 'Melhora da velocidade e resistência',
    exercises: [
      '10 min aquecimento trote',
      '6x (3 min forte + 2 min recuperação)',
      '10 min desaceleração'
    ]
  },
  {
    id: '3',
    name: 'Avançado - Tempo Run',
    duration: '60 min',
    intensity: 'Alta',
    description: 'Treino de ritmo de prova',
    exercises: [
      '15 min aquecimento progressivo',
      '30 min no ritmo de prova',
      '15 min desaceleração'
    ]
  }
]

const nutritionPlans: NutritionPlan[] = [
  {
    id: '1',
    meal: 'Café da Manhã',
    time: '07:00',
    foods: ['Aveia com banana', 'Café preto', 'Castanhas'],
    calories: 450,
    notes: 'Rica em carboidratos complexos'
  },
  {
    id: '2',
    meal: 'Pré-Treino',
    time: '09:30',
    foods: ['Banana', 'Água de coco'],
    calories: 150,
    notes: 'Energia rápida para o treino'
  },
  {
    id: '3',
    meal: 'Pós-Treino',
    time: '11:00',
    foods: ['Whey protein', 'Frutas vermelhas'],
    calories: 200,
    notes: 'Recuperação muscular'
  },
  {
    id: '4',
    meal: 'Almoço',
    time: '12:30',
    foods: ['Arroz integral', 'Frango grelhado', 'Salada', 'Legumes'],
    calories: 650,
    notes: 'Refeição completa e balanceada'
  }
]

export default function RunnaApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null)
  const [workoutTimer, setWorkoutTimer] = useState(0)
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([])

  // Timer para treino
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isWorkoutActive])

  // Carregar dados do localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('runna-progress')
    const savedCompletedWorkouts = localStorage.getItem('runna-completed')
    
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
    if (savedCompletedWorkouts) {
      setCompletedWorkouts(JSON.parse(savedCompletedWorkouts))
    }
  }, [])

  // Salvar progresso
  const saveProgress = (progress: UserProgress) => {
    const newProgress = [...userProgress, progress]
    setUserProgress(newProgress)
    localStorage.setItem('runna-progress', JSON.stringify(newProgress))
  }

  // Completar treino
  const completeWorkout = (workoutId: string) => {
    const newCompleted = [...completedWorkouts, workoutId]
    setCompletedWorkouts(newCompleted)
    localStorage.setItem('runna-completed', JSON.stringify(newCompleted))
    
    // Adicionar ao progresso
    const progress: UserProgress = {
      date: new Date().toLocaleDateString(),
      distance: 5, // Exemplo
      time: formatTime(workoutTimer),
      pace: '5:30',
      calories: 300
    }
    saveProgress(progress)
    
    setIsWorkoutActive(false)
    setWorkoutTimer(0)
    setSelectedWorkout(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startWorkout = (workout: WorkoutPlan) => {
    setSelectedWorkout(workout)
    setWorkoutTimer(0)
    setIsWorkoutActive(true)
  }

  const toggleWorkout = () => {
    setIsWorkoutActive(!isWorkoutActive)
  }

  const resetWorkout = () => {
    setIsWorkoutActive(false)
    setWorkoutTimer(0)
    setSelectedWorkout(null)
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Treinos</p>
              <p className="text-2xl font-bold">{completedWorkouts.length}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Distância</p>
              <p className="text-2xl font-bold">{userProgress.reduce((acc, p) => acc + p.distance, 0)}km</p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Calorias</p>
              <p className="text-2xl font-bold">{userProgress.reduce((acc, p) => acc + p.calories, 0)}</p>
            </div>
            <Flame className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pace Médio</p>
              <p className="text-2xl font-bold">5:45</p>
            </div>
            <Timer className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Treino Ativo */}
      {selectedWorkout && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{selectedWorkout.name}</h3>
              <p className="text-indigo-100">Treino em andamento</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{formatTime(workoutTimer)}</p>
              <p className="text-indigo-100">Tempo decorrido</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={toggleWorkout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
            >
              {isWorkoutActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isWorkoutActive ? 'Pausar' : 'Continuar'}
            </button>
            
            <button
              onClick={() => completeWorkout(selectedWorkout.id)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Finalizar
            </button>
            
            <button
              onClick={resetWorkout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Progresso Recente */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-500" />
          Progresso Recente
        </h3>
        
        {userProgress.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhum treino registrado ainda. Comece seu primeiro treino!
          </p>
        ) : (
          <div className="space-y-3">
            {userProgress.slice(-3).reverse().map((progress, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <p className="font-semibold">{progress.distance}km em {progress.time}</p>
                  <p className="text-sm text-gray-500">Pace: {progress.pace}/km</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-orange-500">{progress.calories} cal</p>
                  <p className="text-sm text-gray-500">{progress.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderWorkouts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-7 h-7 text-yellow-500" />
          Planos de Treino
        </h2>
      </div>

      <div className="grid gap-6">
        {workoutPlans.map((workout) => (
          <div key={workout.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{workout.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    workout.intensity === 'Baixa' ? 'bg-green-100 text-green-700' :
                    workout.intensity === 'Moderada' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {workout.intensity}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3">{workout.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {workout.duration}
                  </span>
                  {completedWorkouts.includes(workout.id) && (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      Concluído
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Estrutura do Treino:</h4>
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span>{exercise}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => startWorkout(workout)}
              disabled={selectedWorkout !== null}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {selectedWorkout ? 'Treino em Andamento' : 'Iniciar Treino'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNutrition = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Apple className="w-7 h-7 text-red-500" />
          Plano Nutricional
        </h2>
      </div>

      {/* Resumo Nutricional */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-2xl text-white">
        <h3 className="text-xl font-bold mb-4">Resumo Diário</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{nutritionPlans.reduce((acc, plan) => acc + plan.calories, 0)}</p>
            <p className="text-green-100 text-sm">Calorias Totais</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">65%</p>
            <p className="text-green-100 text-sm">Carboidratos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">20%</p>
            <p className="text-green-100 text-sm">Proteínas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">15%</p>
            <p className="text-green-100 text-sm">Gorduras</p>
          </div>
        </div>
      </div>

      {/* Refeições */}
      <div className="grid gap-4">
        {nutritionPlans.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{plan.meal}</h3>
                <p className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {plan.time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-500">{plan.calories}</p>
                <p className="text-sm text-gray-500">calorias</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Alimentos:</h4>
              <div className="flex flex-wrap gap-2">
                {plan.foods.map((food, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {food}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Dica:</strong> {plan.notes}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hidratação */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Droplets className="w-6 h-6 text-blue-500" />
          Hidratação
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Mantenha-se hidratado durante todo o dia. Recomendação: 35ml por kg de peso corporal.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div className="bg-blue-500 h-3 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <span className="text-sm font-semibold">2.1L / 2.8L</span>
        </div>
      </div>
    </div>
  )

  const renderProgress = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-purple-500" />
          Progresso & Estatísticas
        </h2>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">Evolução Semanal</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Distância Total</span>
              <span className="font-bold text-blue-500">25.5km</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tempo Total</span>
              <span className="font-bold text-green-500">2h 15min</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pace Médio</span>
              <span className="font-bold text-purple-500">5:18/km</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Calorias</span>
              <span className="font-bold text-orange-500">1,850 cal</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">Conquistas</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="font-semibold">Primeira Corrida</p>
                <p className="text-sm text-gray-500">Completou seu primeiro treino</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Award className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-semibold">Consistência</p>
                <p className="text-sm text-gray-500">3 treinos na semana</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <Award className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-semibold">Distância</p>
                <p className="text-sm text-gray-500">Correu 10km em uma sessão</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Treinos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold mb-4">Histórico de Treinos</h3>
        {userProgress.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhum treino registrado ainda. Comece agora!
          </p>
        ) : (
          <div className="space-y-3">
            {userProgress.reverse().map((progress, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {progress.distance}
                  </div>
                  <div>
                    <p className="font-semibold">{progress.distance}km em {progress.time}</p>
                    <p className="text-sm text-gray-500">Pace: {progress.pace}/km • {progress.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500">{progress.calories} cal</p>
                  <p className="text-sm text-gray-500">queimadas</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Runna</h1>
                <p className="text-xs text-gray-500">Seu app de corrida</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'workouts', name: 'Treinos', icon: Zap },
              { id: 'nutrition', name: 'Nutrição', icon: Apple },
              { id: 'progress', name: 'Progresso', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'workouts' && renderWorkouts()}
        {activeTab === 'nutrition' && renderNutrition()}
        {activeTab === 'progress' && renderProgress()}
      </main>
    </div>
  )
}