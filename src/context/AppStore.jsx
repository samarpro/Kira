import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const STORAGE_KEY = 'bb-app-store'

const defaultState = {
  profile: {
    name: 'Amina Lee',
  },
  goals: {
    workHours: 24,
    focusHours: 15,
    socialGoal: 1,
  },
  metrics: {
    workHours: 18,
    focusHours: 12,
  },
  shifts: [
    { id: 1, date: 'Jul 12', title: 'Night Shift • Emergency Dept', time: '22:00 — 06:00 (8h)' },
    { id: 2, date: 'Jul 14', title: 'Afternoon Shift • Ward 4B', time: '14:00 — 22:00 (8h)' },
    { id: 3, date: 'Jul 15', title: 'Morning Shift • Ward 4B', time: '06:00 — 14:00 (8h)' },
    { id: 4, date: 'Jul 16', title: 'Morning Shift • Ward 4B', time: '06:00 — 14:00 (8h)' },
  ],
  calendar: {
    selectedDate: new Date().toISOString(),
    events: [
      { id: 1, title: 'Work Shift', date: new Date().toISOString() },
      { id: 2, title: 'Study Focus', date: new Date().toISOString() },
    ],
  },
  wellbeing: {
    todos: [
      { id: 1, label: '10 min meditation', done: false },
      { id: 2, label: 'Evening journaling', done: false },
    ],
  },
  social: {
    matches: [],
    meetupRequests: [],
  },
  focus: {
    durationSeconds: 25 * 60,
    secondsRemaining: 25 * 60,
    isRunning: true,
  },
  ui: {
    showProfile: false,
  },
}

const mergeState = (stored) => ({
  ...defaultState,
  ...stored,
  profile: { ...defaultState.profile, ...stored?.profile },
  goals: { ...defaultState.goals, ...stored?.goals },
  metrics: { ...defaultState.metrics, ...stored?.metrics },
  calendar: { ...defaultState.calendar, ...stored?.calendar },
  wellbeing: { ...defaultState.wellbeing, ...stored?.wellbeing },
  social: { ...defaultState.social, ...stored?.social },
  focus: { ...defaultState.focus, ...stored?.focus },
  ui: { ...defaultState.ui, ...stored?.ui },
})

const initState = () => {
  if (typeof window === 'undefined') return defaultState
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return defaultState
  try {
    return mergeState(JSON.parse(stored))
  } catch {
    return defaultState
  }
}

const AppStoreContext = createContext(null)

const appReducer = (state, action) => {
  switch (action.type) {
    case 'setName':
      return { ...state, profile: { ...state.profile, name: action.payload } }
    case 'setGoals':
      return { ...state, goals: { ...state.goals, ...action.payload } }
    case 'setMetrics':
      return { ...state, metrics: { ...state.metrics, ...action.payload } }
    case 'addShift':
      return { ...state, shifts: [...state.shifts, action.payload] }
    case 'setCalendarDate':
      return { ...state, calendar: { ...state.calendar, selectedDate: action.payload } }
    case 'addCalendarEvent':
      return {
        ...state,
        calendar: {
          ...state.calendar,
          events: [...state.calendar.events, action.payload],
        },
      }
    case 'setFocusRunning':
      return { ...state, focus: { ...state.focus, isRunning: action.payload } }
    case 'setFocusSeconds':
      return { ...state, focus: { ...state.focus, secondsRemaining: action.payload } }
    case 'resetFocusTimer':
      return {
        ...state,
        focus: {
          ...state.focus,
          secondsRemaining: state.focus.durationSeconds,
          isRunning: true,
        },
      }
    case 'setShowProfile':
      return { ...state, ui: { ...state.ui, showProfile: action.payload } }
    case 'addWellbeingTodo':
      return {
        ...state,
        wellbeing: {
          ...state.wellbeing,
          todos: [...state.wellbeing.todos, action.payload],
        },
      }
    case 'toggleWellbeingTodo':
      return {
        ...state,
        wellbeing: {
          ...state.wellbeing,
          todos: state.wellbeing.todos.map((todo) =>
            todo.id === action.payload ? { ...todo, done: !todo.done } : todo,
          ),
        },
      }
    case 'hydrate':
      return mergeState(action.payload)
    default:
      return state
  }
}

export const AppStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, defaultState, initState)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const actions = useMemo(
    () => ({
      setName: (name) => dispatch({ type: 'setName', payload: name }),
      setGoals: (goals) => dispatch({ type: 'setGoals', payload: goals }),
      setMetrics: (metrics) => dispatch({ type: 'setMetrics', payload: metrics }),
      addShift: (shift) => dispatch({ type: 'addShift', payload: shift }),
      setCalendarDate: (date) => dispatch({ type: 'setCalendarDate', payload: date }),
      addCalendarEvent: (event) => dispatch({ type: 'addCalendarEvent', payload: event }),
      addWellbeingTodo: (label) =>
        dispatch({ type: 'addWellbeingTodo', payload: { id: Date.now(), label, done: false } }),
      toggleWellbeingTodo: (id) => dispatch({ type: 'toggleWellbeingTodo', payload: id }),
      setFocusRunning: (value) => dispatch({ type: 'setFocusRunning', payload: value }),
      setFocusSeconds: (value) => dispatch({ type: 'setFocusSeconds', payload: value }),
      resetFocusTimer: () => dispatch({ type: 'resetFocusTimer' }),
      setShowProfile: (value) => dispatch({ type: 'setShowProfile', payload: value }),
    }),
    [],
  )

  const value = useMemo(() => ({ state, actions }), [state, actions])

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export const useAppStore = () => {
  const context = useContext(AppStoreContext)
  if (!context) throw new Error('useAppStore must be used within AppStoreProvider')
  return context
}

export const selectors = {
  profileName: (state) => state.profile.name,
  socialGoal: (state) => state.goals.socialGoal,
  wellbeingTodos: (state) => state.wellbeing.todos,
  shifts: (state) => state.shifts,
  calendar: (state) => state.calendar,
  focus: (state) => state.focus,
  uiShowProfile: (state) => state.ui.showProfile,
  metrics: (state) => state.metrics,
  goals: (state) => state.goals,
}
