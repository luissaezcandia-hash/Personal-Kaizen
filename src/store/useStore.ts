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

interface AppState {
  dailyProgress: number
  routines: Routine[]
  contacts: Contact[]
  courses: Course[]
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
}

// Utility to recalculate progress locally
const calcProgress = (routines: Routine[]) => {
  const totalTasks = routines.reduce((acc, r) => acc + r.tasks.length, 0)
  const completedTasks = routines.reduce((acc, r) => acc + r.tasks.filter(t => t.completed).length, 0)
  return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
}

export const useStore = create<AppState>()((set) => ({
  dailyProgress: 0,
  routines: [],
  contacts: [],
  courses: [],
  isFetching: false,

  fetchData: async () => {
    set({ isFetching: true })
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) {
      set({ isFetching: false })
      return
    }

    const [contactsRes, coursesRes, routinesRes, tasksRes] = await Promise.all([
      supabase.from('contacts').select('*'),
      supabase.from('courses').select('*'),
      supabase.from('routines').select('*'),
      supabase.from('tasks').select('*')
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

    // Mapear campos snake_case a camelCase para contacts
    const contacts = (contactsRes.data || []).map((c: any) => ({
      ...c,
      lastInteraction: c.last_interaction,
      investmentRatio: c.investment_ratio
    }))

    set({ 
      contacts, 
      courses: coursesRes.data || [], 
      routines,
      dailyProgress: calcProgress(routines),
      isFetching: false 
    })
  },

  incrementProgress: (amount) => set((state) => ({ 
    dailyProgress: Math.min(state.dailyProgress + amount, 100) 
  })),

  // CONTACTS
  moveContact: async (contactId, newPhase) => {
    // Optimistic
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
    // Remove camelCase keys
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

    // Optimistic
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
  }
}))
