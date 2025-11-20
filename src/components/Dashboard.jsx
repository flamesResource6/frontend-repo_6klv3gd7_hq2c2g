import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard() {
  const [token, setToken] = useState('')
  const [me, setMe] = useState(null)
  const [patients, setPatients] = useState([])
  const [tests, setTests] = useState([])
  const [form, setForm] = useState({ first_name: '', last_name: '' })
  const [login, setLogin] = useState({ email: 'admin@lab.local', password: 'admin123' })

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) {
      setToken(t)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setMe)
    fetch(`${API_URL}/patients`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setPatients)
    fetch(`${API_URL}/tests`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setTests)
  }, [token])

  const doSeed = async () => {
    await fetch(`${API_URL}/auth/seed-admin`, { method: 'POST' })
    alert('Admin seeded. Use email: admin@lab.local, password: admin123')
  }

  const doLogin = async (e) => {
    e.preventDefault()
    const body = new URLSearchParams()
    body.append('username', login.email)
    body.append('password', login.password)
    const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', body })
    const data = await res.json()
    if (data.access_token) {
      localStorage.setItem('token', data.access_token)
      setToken(data.access_token)
    } else {
      alert('Login failed')
    }
  }

  const addPatient = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setPatients([data, ...patients])
    setForm({ first_name: '', last_name: '' })
  }

  return (
    <div className="max-w-6xl mx-auto py-10 text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Referral Lab Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={doSeed} className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500">Seed Admin</button>
          {token ? (
            <span className="text-sm opacity-80">Logged in as {me?.email}</span>
          ) : (
            <form onSubmit={doLogin} className="flex gap-2">
              <input value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} placeholder="email" className="px-2 py-2 rounded bg-slate-800 border border-slate-700"/>
              <input type="password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} placeholder="password" className="px-2 py-2 rounded bg-slate-800 border border-slate-700"/>
              <button className="px-3 py-2 rounded bg-green-600 hover:bg-green-500">Login</button>
            </form>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Add Patient</h2>
          <form onSubmit={addPatient} className="flex gap-2">
            <input value={form.first_name} onChange={e=>setForm({...form, first_name: e.target.value})} placeholder="First name" className="px-3 py-2 rounded bg-slate-900 border border-slate-700 flex-1"/>
            <input value={form.last_name} onChange={e=>setForm({...form, last_name: e.target.value})} placeholder="Last name" className="px-3 py-2 rounded bg-slate-900 border border-slate-700 flex-1"/>
            <button disabled={!token} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50">Save</button>
          </form>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Test Catalog</h2>
          <ul className="space-y-2 max-h-60 overflow-auto">
            {tests.map(t => (
              <li key={t.id} className="flex justify-between bg-slate-900/60 border border-slate-700 rounded p-2">
                <span>{t.code} — {t.name}</span>
                <span className="opacity-70">{t.sample_type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-slate-800/60 border border-slate-700 rounded-xl p-5">
        <h2 className="font-semibold mb-4">Recent Patients</h2>
        <ul className="space-y-2">
          {patients.map(p => (
            <li key={p.id} className="bg-slate-900/60 border border-slate-700 rounded p-3">
              {p.first_name} {p.last_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
