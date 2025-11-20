import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.1),transparent_45%)] pointer-events-none" />
      <div className="relative">
        <header className="border-b border-slate-800/80 backdrop-blur sticky top-0 z-10 bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-indigo-600" />
              <h1 className="font-bold">Clinical Referral Lab</h1>
            </div>
            <div className="text-sm opacity-80">Role-based access demo</div>
          </div>
        </header>
        <main>
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
