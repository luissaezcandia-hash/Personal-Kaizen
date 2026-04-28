import { supabase } from '@/lib/supabase'

const dateStr = (offsetDays: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toLocaleDateString('en-CA')
}

const getCurrentQuarter = (): string => {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${q}-${now.getFullYear()}`
}

export async function seedDemoData(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const uid = user.id
  const quarter = getCurrentQuarter()

  // Limpiar datos existentes (el usuario confirmó antes de llamar esta función)
  await Promise.all([
    supabase.from('daily_logs').delete().eq('user_id', uid),
    supabase.from('agenda_events').delete().eq('user_id', uid),
    supabase.from('objectives').delete().eq('user_id', uid),
    supabase.from('courses').delete().eq('user_id', uid),
    supabase.from('contacts').delete().eq('user_id', uid),
  ])

  // ── DAILY LOGS: 7 días de racha ──────────────────────────────────────────
  await supabase.from('daily_logs').insert([
    {
      user_id: uid,
      log_date: dateStr(0),
      focus: 'Plus Gráfica',
      reflection: 'Cerré 2 propuestas comerciales. Mañana atacar el rediseño de la web y el deck de ventas.',
      progress_percentage: 75,
    },
    { user_id: uid, log_date: dateStr(-1), focus: 'Tesis', reflection: 'Completé la sección de metodología. Entrevista con asesor pendiente.', progress_percentage: 60 },
    { user_id: uid, log_date: dateStr(-2), focus: 'Plus Gráfica', progress_percentage: 80 },
    { user_id: uid, log_date: dateStr(-3), focus: 'Plus Gráfica', progress_percentage: 45 },
    { user_id: uid, log_date: dateStr(-4), focus: 'Tesis', progress_percentage: 70 },
    { user_id: uid, log_date: dateStr(-5), focus: 'Plus Gráfica', progress_percentage: 55 },
    { user_id: uid, log_date: dateStr(-6), focus: 'Plus Gráfica', progress_percentage: 65 },
  ])

  // ── AGENDA EVENTS: hoy + mañana ──────────────────────────────────────────
  await supabase.from('agenda_events').insert([
    // Hoy
    { user_id: uid, title: 'Ritual matutino', event_date: dateStr(0), start_time: '06:30', end_time: '07:15', type: 'ritual' },
    { user_id: uid, title: 'Deep Work: Propuesta comercial Acme', event_date: dateStr(0), start_time: '09:00', end_time: '11:00', type: 'work', notes: 'Llevar deck actualizado. Revisar KPIs del cliente.' },
    { user_id: uid, title: 'Almuerzo — Networking con Carlos', event_date: dateStr(0), start_time: '13:00', end_time: '14:00', type: 'social', notes: 'Posible alianza para proyecto de marca.' },
    { user_id: uid, title: 'Sesión de fuerza — Empuje', event_date: dateStr(0), start_time: '16:00', end_time: '17:00', type: 'health' },
    { user_id: uid, title: 'Revisión semanal OKRs', event_date: dateStr(0), start_time: '18:30', end_time: '19:00', type: 'work' },
    { user_id: uid, title: 'Lectura: Skin in the Game', event_date: dateStr(0), start_time: '21:00', end_time: '21:30', type: 'ritual' },
    // Mañana
    { user_id: uid, title: 'Gym: Cardio HIIT', event_date: dateStr(1), start_time: '07:00', end_time: '07:45', type: 'health' },
    { user_id: uid, title: 'Junta Plus Gráfica — Entregables Q2', event_date: dateStr(1), start_time: '10:00', end_time: '11:30', type: 'work', notes: 'Traer reporte de avance + roadmap.' },
    { user_id: uid, title: 'Call cliente potencial — Tech Startup', event_date: dateStr(1), start_time: '14:00', end_time: '14:30', type: 'social' },
    { user_id: uid, title: 'Avance Tesis — Capítulo 4', event_date: dateStr(1), start_time: '16:00', end_time: '18:00', type: 'work' },
    { user_id: uid, title: 'Meditación + Diario', event_date: dateStr(1), start_time: '21:00', end_time: '21:20', type: 'ritual' },
  ])

  // ── OBJECTIVES + KEY RESULTS ─────────────────────────────────────────────
  const { data: objectives } = await supabase
    .from('objectives')
    .insert([
      { user_id: uid, title: 'Escalar Plus Gráfica a 6 figuras mensuales', quarter, category: 'business' },
      { user_id: uid, title: 'Terminar y defender la Tesis', quarter, category: 'learning' },
      { user_id: uid, title: 'Construir base física de élite', quarter, category: 'health' },
    ])
    .select()

  if (objectives && objectives.length === 3) {
    const [biz, thesis, fit] = objectives
    await supabase.from('key_results').insert([
      // Negocio
      { user_id: uid, objective_id: biz.id, title: 'Cerrar 5 clientes nuevos', current_value: 2, target_value: 5, unit: 'clientes' },
      { user_id: uid, objective_id: biz.id, title: 'Publicar 8 casos de éxito', current_value: 1, target_value: 8, unit: 'posts' },
      { user_id: uid, objective_id: biz.id, title: 'Facturación mensual $50k MXN', current_value: 32000, target_value: 50000, unit: 'MXN' },
      // Tesis
      { user_id: uid, objective_id: thesis.id, title: 'Completar 5 capítulos', current_value: 3, target_value: 5, unit: 'capítulos' },
      { user_id: uid, objective_id: thesis.id, title: 'Entrevistas de campo', current_value: 7, target_value: 10, unit: 'entrevistas' },
      { user_id: uid, objective_id: thesis.id, title: 'Sesiones de revisión con asesor', current_value: 1, target_value: 3, unit: 'sesiones' },
      // Fitness
      { user_id: uid, objective_id: fit.id, title: 'Sesiones de entrenamiento', current_value: 18, target_value: 48, unit: 'sesiones' },
      { user_id: uid, objective_id: fit.id, title: 'Protocolo de 90 días', current_value: 30, target_value: 90, unit: 'días' },
    ])
  }

  // ── COURSES ──────────────────────────────────────────────────────────────
  await supabase.from('courses').insert([
    { user_id: uid, title: 'Marketing Digital para Agencias', progress: 65 },
    { user_id: uid, title: 'Tesis: Investigación Cualitativa', progress: 40 },
    { user_id: uid, title: 'TypeScript & React Avanzado', progress: 80 },
    { user_id: uid, title: 'Finanzas para Emprendedores', progress: 25 },
  ])

  // ── CONTACTS ─────────────────────────────────────────────────────────────
  await supabase.from('contacts').insert([
    {
      user_id: uid, name: 'Carlos Mendoza', phase: 'A',
      last_interaction: dateStr(-2), investment_ratio: 8,
      instagram: '@carlosmendoza',
      notes: 'Aliado estratégico Plus Gráfica. Conectar mensualmente. Alta reciprocidad.',
    },
    {
      user_id: uid, name: 'Ana Reyes', phase: 'A',
      last_interaction: dateStr(-5), investment_ratio: 9,
      whatsapp: '+52 55 1234 5678',
      notes: 'Cliente potencial con presupuesto confirmado. Seguimiento esta semana.',
    },
    {
      user_id: uid, name: 'Jorge Ramírez', phase: 'B',
      last_interaction: dateStr(-14), investment_ratio: 6,
      notes: 'Contacto de networking universitario. Mantener presencia.',
    },
    {
      user_id: uid, name: 'Laura Vega', phase: 'B',
      last_interaction: dateStr(-20), investment_ratio: 5,
      instagram: '@lauravega.mx',
      notes: 'Diseñadora freelance. Posible colaboración en proyectos.',
    },
    {
      user_id: uid, name: 'Roberto Flores', phase: 'C',
      last_interaction: dateStr(-45), investment_ratio: 3,
      notes: '45 días sin contacto. Evaluar si vale la pena reactivar.',
    },
  ])
}
