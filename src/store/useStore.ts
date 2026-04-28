import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface Task {
  id: string
  title: string
  completed: boolean
}

interface Routine {
  id: string
  name: string
  tasks: Task[]
}

interface Contact {
  id: string
  name: string
  phase: 'A' | 'B' | 'C'
  lastInteraction: string
  investmentRatio: number
  instagram?: string
  whatsapp?: string
  birthday?: string
  notes?: string
}

interface Course {
  id: string
  title: string
  progress: number
}

export interface AgendaEvent {
  id: string
  title: string
  eventDate: string
  startTime: string
  endTime: string
  type: 'work' | 'social' | 'health' | 'ritual'
  notes?: string
}

export interface DailyLog {
  id: string
  logDate: string
  focus?: string
  reflection?: string
  progressPercentage: number
}

export interface KeyResult {
  id: string
  objectiveId: string
  title: string
  currentValue: number
  targetValue: number
  unit: string
}

export interface Objective {
  id: string
  title: string
  quarter: string
  category: 'business' | 'health' | 'learning' | 'personal'
  keyResults: KeyResult[]
  progress: number
}

interface AppState {
  dailyProgress: number
  routines: Routine[]
  contacts: Contact[]
  courses: Course[]
  events: AgendaEvent[]
  streak: number
  todayLog: DailyLog | null
  dailyLogs: DailyLog[]
  objectives: Objective[]
  isFetching: boolean
  fetchData: () => Promise<void>
  incrementProgress: (amount: number) => void
  toggleTask: (routineId: string, taskId: string) => Promise<void>
  moveContact: (contactId: string, newPhase: 'A' | 'B' | 'C') => Promise<void>
  addContact: (contact: Omit<Contact, 'id'>) => Promise<void>
  updateContact: (id: string, contact: Partial<Omit<Contact, 'id'>>) => Promise<void>
  deleteContact: (id: string) => Promise<void>
  addTask: (routineId: string, title: string) => Promise<void>
  updateTask: (routineId: string, taskId: string, title: string) => Promise<void>
  deleteTask: (routineId: string, taskId: string) => Promise<void>
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>
  updateCourse: (id: string, progress: number, title?: string) => Promise<void>
  deleteCourse: (id: string) => Promise<void>
  // Agenda
  addEvent: (event: Omit<AgendaEvent, 'id'>) => Promise<void>
  updateEvent: (id: string, event: Partial<Omit<AgendaEvent, 'id'>>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  // Daily Logs
  logDayStart: (focus: string) => Promise<void>
  saveReflection: (reflection: string) => Promise<void>
  // OKR
  addObjective: (obj: Omit<Objective, 'id' | 'keyResults' | 'progress'>) => Promise<void>
  deleteObjective: (id: string) => Promise<void>
  addKeyResult: (kr: Omit<KeyResult, 'id'>) => Promise<void>
  updateKeyResult: (id: string, objectiveId: string, currentValue: number) => Promise<void>
  deleteKeyResult: (id: string, objectiveId: string) => Promise<void>
}

const calcProgress = (routines: Routine[]) => {
  const totalTasks = routines.reduce((acc, r) => acc + r.tasks.length, 0)
  const completedTasks = routines.reduce((acc, r) => acc + r.tasks.filter(t => t.completed).length, 0)
  return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
}

const calcStreak = (logs: DailyLog[]): number => {
  if (logs.length === 0) return 0
  const dateSet = new Set(logs.map(l => l.logDate))
  let streak = 0
  const today = new Date()
  for (let i = 0; i <= 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toLocaleDateString('en-CA')
    if (dateSet.has(dateStr)) {
      streak++
    } else if (i === 0) {
      continue // hoy no registrado aún, OK
    } else {
      break
    }
  }
  return streak
}

const calcObjProgress = (keyResults: KeyResult[]): number => {
  if (keyResults.length === 0) return 0
  const avg = keyResults.reduce((acc, kr) => acc + Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100)), 0) / keyResults.length
  return Math.round(avg)
}

export const useStore = create<AppState>()((set, get) => ({
  dailyProgress: 0,
  routines: [],
  contacts: [],
  courses: [],
  events: [],
  streak: 0,
  todayLog: null,
  dailyLogs: [],
  objectives: [],
  isFetching: false,

  fetchData: async () => {
    set({ isFetching: true })
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) {
      set({ isFetching: false })
      return
    }

    const [contactsRes, coursesRes, routinesRes, tasksRes, eventsRes, logsRes, objectivesRes, keyResultsRes] = await Promise.all([
      supabase.from('contacts').select('*'),
      supabase.from('courses').select('*'),
      supabase.from('routines').select('*'),
      supabase.from('tasks').select('*'),
      supabase.from('agenda_events').select('*'),
      supabase.from('daily_logs').select('*').order('log_date', { ascending: false }),
      supabase.from('objectives').select('*'),
      supabase.from('key_results').select('*'),
    ])

    const tasks = tasksRes.data || []
    const routines = (routinesRes.data || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      tasks: tasks.filter((t: any) => t.routine_id === r.id).map((t: any) => ({
        id: t.id,
        title: t.title,
        completed: t.completed
      }))
    }))

    const contacts = (contactsRes.data || []).map((c: any) => ({
      ...c,
      lastInteraction: c.last_interaction,
      investmentRatio: c.investment_ratio
    }))

    const events = (eventsRes.data || []).map((e: any) => ({
      ...e,
      eventDate: e.event_date,
      startTime: e.start_time,
      endTime: e.end_time
    }))

    const dailyLogs = (logsRes.data || []).map((l: any) => ({
      id: l.id,
      logDate: l.log_date,
      focus: l.focus,
      reflection: l.reflection,
      progressPercentage: l.progress_percentage
    }))

    const today = new Date().toLocaleDateString('en-CA')
    const todayLog = dailyLogs.find(l => l.logDate === today) || null

    const krData = keyResultsRes.data || []
    const objectives = (objectivesRes.data || []).map((o: any) => {
      const keyResults = krData
        .filter((kr: any) => kr.objective_id === o.id)
        .map((kr: any) => ({
          id: kr.id,
          objectiveId: kr.objective_id,
          title: kr.title,
          currentValue: kr.current_value,
          targetValue: kr.target_value,
          unit: kr.unit
        }))
      return {
        id: o.id,
        title: o.title,
        quarter: o.quarter,
        category: o.category,
        keyResults,
        progress: calcObjProgress(keyResults)
      }
    })

    set({
      contacts,
      courses: coursesRes.data || [],
      routines,
      events,
      dailyLogs,
      todayLog,
      streak: calcStreak(dailyLogs),
      objectives,
      dailyProgress: calcProgress(routines),
      isFetching: false
    })
  },

  incrementProgress: (amount) => set((state) => ({
    dailyProgress: Math.min(state.dailyProgress + amount, 100)
  })),

  // CONTACTS
  moveContact: async (contactId, newPhase) => {
    set((state) => ({
      contacts: state.contacts.map(c => c.id === contactId ? { ...c, phase: newPhase } : c)
    }))
    await supabase.from('contacts').update({ phase: newPhase }).eq('id', contactId)
  },

  addContact: async (contact) => {
    const { data: user } = await supabase.auth.getUser()
    const payload = {
      ...contact,
      user_id: user.user?.id,
      last_interaction: contact.lastInteraction,
      investment_ratio: contact.investmentRatio,
    }
    delete (payload as any).lastInteraction
    delete (payload as any).investmentRatio

    const { data } = await supabase.from('contacts').insert(payload).select().single()
    if (data) {
      const newContact = { ...data, lastInteraction: data.last_interaction, investmentRatio: data.investment_ratio }
      set((state) => ({ contacts: [...state.contacts, newContact] }))
    }
  },

  updateContact: async (id, updatedContact) => {
    const payload: any = { ...updatedContact }
    if (payload.lastInteraction) { payload.last_interaction = payload.lastInteraction; delete payload.lastInteraction }
    if (payload.investmentRatio !== undefined) { payload.investment_ratio = payload.investmentRatio; delete payload.investmentRatio }

    set((state) => ({
      contacts: state.contacts.map(c => c.id === id ? { ...c, ...updatedContact } : c)
    }))
    await supabase.from('contacts').update(payload).eq('id', id)
  },

  deleteContact: async (id) => {
    set((state) => ({ contacts: state.contacts.filter(c => c.id !== id) }))
    await supabase.from('contacts').delete().eq('id', id)
  },

  // ROUTINES & TASKS
  addTask: async (routineId, title) => {
    const { data: user } = await supabase.auth.getUser()
    const { data } = await supabase.from('tasks').insert({
      user_id: user.user?.id,
      routine_id: routineId,
      title,
      completed: false
    }).select().single()

    if (data) {
      set((state) => {
        const updatedRoutines = state.routines.map(r =>
          r.id === routineId ? { ...r, tasks: [...r.tasks, data] } : r
        )
        return { routines: updatedRoutines, dailyProgress: calcProgress(updatedRoutines) }
      })
    }
  },

  updateTask: async (routineId, taskId, title) => {
    set((state) => {
      const updatedRoutines = state.routines.map(r =>
        r.id === routineId ? { ...r, tasks: r.tasks.map(t => t.id === taskId ? { ...t, title } : t) } : r
      )
      return { routines: updatedRoutines }
    })
    await supabase.from('tasks').update({ title }).eq('id', taskId)
  },

  toggleTask: async (routineId, taskId) => {
    let newStatus = false
    set((state) => {
      const updatedRoutines = state.routines.map(r => {
        if (r.id === routineId) {
          return {
            ...r,
            tasks: r.tasks.map(t => {
              if (t.id === taskId) {
                newStatus = !t.completed
                return { ...t, completed: newStatus }
              }
              return t
            })
          }
        }
        return r
      })
      return { routines: updatedRoutines, dailyProgress: calcProgress(updatedRoutines) }
    })
    await supabase.from('tasks').update({ completed: newStatus }).eq('id', taskId)
  },

  deleteTask: async (routineId, taskId) => {
    set((state) => {
      const updatedRoutines = state.routines.map(r =>
        r.id === routineId ? { ...r, tasks: r.tasks.filter(t => t.id !== taskId) } : r
      )
      return { routines: updatedRoutines, dailyProgress: calcProgress(updatedRoutines) }
    })
    await supabase.from('tasks').delete().eq('id', taskId)
  },

  // COURSES
  addCourse: async (course) => {
    const { data: user } = await supabase.auth.getUser()
    const { data } = await supabase.from('courses').insert({
      ...course,
      user_id: user.user?.id
    }).select().single()

    if (data) {
      set((state) => ({ courses: [...state.courses, data] }))
    }
  },

  updateCourse: async (id, progress, title) => {
    const payload: any = { progress }
    if (title) payload.title = title

    set((state) => ({
      courses: state.courses.map(c => c.id === id ? { ...c, progress, ...(title ? { title } : {}) } : c)
    }))
    await supabase.from('courses').update(payload).eq('id', id)
  },

  deleteCourse: async (id) => {
    set((state) => ({ courses: state.courses.filter(c => c.id !== id) }))
    await supabase.from('courses').delete().eq('id', id)
  },

  // AGENDA
  addEvent: async (event) => {
    const { data: user } = await supabase.auth.getUser()
    const payload = {
      ...event,
      user_id: user.user?.id,
      event_date: event.eventDate,
      start_time: event.startTime,
      end_time: event.endTime,
    }
    delete (payload as any).eventDate
    delete (payload as any).startTime
    delete (payload as any).endTime

    const { data } = await supabase.from('agenda_events').insert(payload).select().single()
    if (data) {
      const newEvent = {
        ...data,
        eventDate: data.event_date,
        startTime: data.start_time,
        endTime: data.end_time
      }
      set((state) => ({ events: [...state.events, newEvent] }))
    }
  },

  updateEvent: async (id, updatedEvent) => {
    const payload: any = { ...updatedEvent }
    if (payload.eventDate) { payload.event_date = payload.eventDate; delete payload.eventDate }
    if (payload.startTime) { payload.start_time = payload.startTime; delete payload.startTime }
    if (payload.endTime) { payload.end_time = payload.endTime; delete payload.endTime }

    set((state) => ({
      events: state.events.map(e => e.id === id ? { ...e, ...updatedEvent } : e)
    }))
    await supabase.from('agenda_events').update(payload).eq('id', id)
  },

  deleteEvent: async (id) => {
    set((state) => ({ events: state.events.filter(e => e.id !== id) }))
    await supabase.from('agenda_events').delete().eq('id', id)
  },

  // DAILY LOGS
  logDayStart: async (focus) => {
    const { data: user } = await supabase.auth.getUser()
    const today = new Date().toLocaleDateString('en-CA')
    const { data } = await supabase.from('daily_logs').upsert({
      user_id: user.user?.id,
      log_date: today,
      focus,
      progress_percentage: get().dailyProgress
    }, { onConflict: 'user_id,log_date' }).select().single()

    if (data) {
      const log: DailyLog = { id: data.id, logDate: data.log_date, focus: data.focus, reflection: data.reflection, progressPercentage: data.progress_percentage }
      set((state) => {
        const updatedLogs = state.dailyLogs.some(l => l.logDate === today)
          ? state.dailyLogs.map(l => l.logDate === today ? log : l)
          : [...state.dailyLogs, log]
        return { todayLog: log, dailyLogs: updatedLogs, streak: calcStreak(updatedLogs) }
      })
    }
  },

  saveReflection: async (reflection) => {
    const { data: user } = await supabase.auth.getUser()
    const today = new Date().toLocaleDateString('en-CA')
    const progress = get().dailyProgress
    const { data } = await supabase.from('daily_logs').upsert({
      user_id: user.user?.id,
      log_date: today,
      reflection,
      progress_percentage: progress
    }, { onConflict: 'user_id,log_date' }).select().single()

    if (data) {
      const log: DailyLog = { id: data.id, logDate: data.log_date, focus: data.focus, reflection: data.reflection, progressPercentage: data.progress_percentage }
      set((state) => {
        const updatedLogs = state.dailyLogs.some(l => l.logDate === today)
          ? state.dailyLogs.map(l => l.logDate === today ? log : l)
          : [...state.dailyLogs, log]
        return { todayLog: log, dailyLogs: updatedLogs, streak: calcStreak(updatedLogs) }
      })
    }
  },

  // OKR
  addObjective: async (obj) => {
    const { data: user } = await supabase.auth.getUser()
    const { data } = await supabase.from('objectives').insert({
      ...obj,
      user_id: user.user?.id
    }).select().single()

    if (data) {
      const newObj: Objective = { ...data, keyResults: [], progress: 0 }
      set((state) => ({ objectives: [...state.objectives, newObj] }))
    }
  },

  deleteObjective: async (id) => {
    set((state) => ({ objectives: state.objectives.filter(o => o.id !== id) }))
    await supabase.from('objectives').delete().eq('id', id)
  },

  addKeyResult: async (kr) => {
    const { data: user } = await supabase.auth.getUser()
    const { data } = await supabase.from('key_results').insert({
      user_id: user.user?.id,
      objective_id: kr.objectiveId,
      title: kr.title,
      current_value: kr.currentValue,
      target_value: kr.targetValue,
      unit: kr.unit
    }).select().single()

    if (data) {
      const newKr: KeyResult = {
        id: data.id,
        objectiveId: data.objective_id,
        title: data.title,
        currentValue: data.current_value,
        targetValue: data.target_value,
        unit: data.unit
      }
      set((state) => ({
        objectives: state.objectives.map(o => {
          if (o.id !== kr.objectiveId) return o
          const updatedKrs = [...o.keyResults, newKr]
          return { ...o, keyResults: updatedKrs, progress: calcObjProgress(updatedKrs) }
        })
      }))
    }
  },

  updateKeyResult: async (id, objectiveId, currentValue) => {
    set((state) => ({
      objectives: state.objectives.map(o => {
        if (o.id !== objectiveId) return o
        const updatedKrs = o.keyResults.map(kr => kr.id === id ? { ...kr, currentValue } : kr)
        return { ...o, keyResults: updatedKrs, progress: calcObjProgress(updatedKrs) }
      })
    }))
    await supabase.from('key_results').update({ current_value: currentValue }).eq('id', id)
  },

  deleteKeyResult: async (id, objectiveId) => {
    set((state) => ({
      objectives: state.objectives.map(o => {
        if (o.id !== objectiveId) return o
        const updatedKrs = o.keyResults.filter(kr => kr.id !== id)
        return { ...o, keyResults: updatedKrs, progress: calcObjProgress(updatedKrs) }
      })
    }))
    await supabase.from('key_results').delete().eq('id', id)
  },
}))
