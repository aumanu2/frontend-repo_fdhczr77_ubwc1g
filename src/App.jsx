import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { ShoppingCart, Menu, LogIn, LogOut, User, Shield, Package, Send, ChevronRight } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('rk_token') || '')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!token) return
    fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => setUser(d))
      .catch(() => setUser(null))
  }, [token])

  const login = async (email, password) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    const res = await fetch(`${API_BASE}/auth/token`, { method: 'POST', body: form })
    if (!res.ok) throw new Error('Login failed')
    const data = await res.json()
    localStorage.setItem('rk_token', data.access_token)
    setToken(data.access_token)
  }
  const logout = () => { localStorage.removeItem('rk_token'); setToken(''); setUser(null) }
  return { token, user, login, logout }
}

function Logo() {
  // Simple text logo with gradient for now
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg" />
      <div className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Radha Kripa
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/myxXfbNiwnbTpGFp/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="backdrop-blur-sm/0"></div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-800 drop-shadow-sm">The Fragrance of Devotion</h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl">
          Handcrafted dhoop batti, agarbatti and perfumes inspired by pure bhakti. Elevate your space with sacred aromas.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#products" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 transition">
            Shop Bestsellers <ChevronRight className="w-4 h-4" />
          </a>
          <a href="#support" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur text-indigo-700 ring-1 ring-indigo-200 hover:ring-indigo-300 transition">
            Live Support
          </a>
        </div>
      </div>
    </section>
  )
}

function Navbar({ auth }) {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-white/70 backdrop-blur border-b border-white/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="sm:hidden" onClick={() => setOpen(!open)}><Menu className="w-6 h-6"/></button>
          <Logo />
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="#products" className="hover:text-indigo-600">Products</a>
          <a href="#about" className="hover:text-indigo-600">About</a>
          <a href="#support" className="hover:text-indigo-600">Support</a>
        </div>
        <div className="flex items-center gap-3">
          {auth.user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-700">Hi, {auth.user.name || 'User'}</span>
              <button onClick={auth.logout} className="px-3 py-2 rounded-full ring-1 ring-gray-200 hover:bg-gray-100 flex items-center gap-2 text-sm"><LogOut className="w-4 h-4"/> Logout</button>
            </>
          ) : (
            <LoginButton auth={auth} />
          )}
          <a href="#cart" className="p-2 rounded-full bg-indigo-600 text-white"><ShoppingCart className="w-5 h-5"/></a>
        </div>
      </div>
      {open && (
        <div className="sm:hidden border-t bg-white">
          <a href="#products" className="block px-4 py-3">Products</a>
          <a href="#about" className="block px-4 py-3">About</a>
          <a href="#support" className="block px-4 py-3">Support</a>
        </div>
      )}
    </nav>
  )
}

function LoginButton({ auth }) {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    try { setLoading(true); await auth.login(email, password); setShow(false) } catch (e) { alert('Login failed') } finally { setLoading(false) }
  }
  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="px-3 py-2 rounded-full ring-1 ring-gray-200 hover:bg-gray-100 flex items-center gap-2 text-sm"><LogIn className="w-4 h-4"/> Login</button>
      {show && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl p-4 border">
          <div className="text-sm font-semibold mb-2">Login</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mb-2 px-3 py-2 rounded-lg ring-1 ring-gray-200 focus:ring-indigo-300 outline-none" />
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full mb-3 px-3 py-2 rounded-lg ring-1 ring-gray-200 focus:ring-indigo-300 outline-none" />
          <button onClick={submit} disabled={loading} className="w-full py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? '...' : 'Login'}</button>
        </div>
      )}
    </div>
  )
}

function Products({ auth }) {
  const [items, setItems] = useState([])
  const categories = useMemo(() => ([
    { key: 'dhoop', label: 'Dhoop Batti' },
    { key: 'agarbatti', label: 'Agarbatti' },
    { key: 'perfume', label: 'Perfumes' },
    { key: 'batti', label: 'Batti' },
  ]), [])
  const [active, setActive] = useState('')

  useEffect(() => {
    const url = new URL(`${API_BASE}/products`)
    if (active) url.searchParams.set('category', active)
    fetch(url.toString()).then(r=>r.json()).then(setItems)
  }, [active])

  return (
    <section id="products" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
      <div className="mt-4 flex gap-3 flex-wrap">
        <button onClick={()=>setActive('')} className={`px-4 py-2 rounded-full ring-1 ${active===''? 'bg-indigo-600 text-white ring-indigo-600':'ring-gray-200 text-gray-700 hover:bg-gray-100'}`}>All</button>
        {categories.map(c => (
          <button key={c.key} onClick={()=>setActive(c.key)} className={`px-4 py-2 rounded-full ring-1 ${active===c.key? 'bg-indigo-600 text-white ring-indigo-600':'ring-gray-200 text-gray-700 hover:bg-gray-100'}`}>{c.label}</button>
        ))}
        {auth.user?.role === 'admin' && <AdminNewProduct token={auth.token} onCreated={()=>setActive(a=>a)} />}
      </div>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => <ProductCard key={p._id} p={p} />)}
      </div>
    </section>
  )
}

function AdminNewProduct({ token, onCreated }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'dhoop', images: '' })
  const submit = async () => {
    const payload = { ...form, price: parseFloat(form.price||'0'), images: form.images? form.images.split(',').map(s=>s.trim()):[] }
    const res = await fetch(`${API_BASE}/admin/products`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
    if (res.ok) { setOpen(false); onCreated?.() } else { alert('Failed to create') }
  }
  return (
    <div>
      <button onClick={()=>setOpen(true)} className="px-4 py-2 rounded-full bg-green-600 text-white">+ Add Product</button>
      {open && (
        <div className="mt-4 p-4 border rounded-xl bg-white max-w-xl">
          <div className="grid sm:grid-cols-2 gap-3">
            {['title','description','price','category','images'].map(k => (
              <input key={k} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={k} className="px-3 py-2 rounded-lg ring-1 ring-gray-200 focus:ring-indigo-300 outline-none" />
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={submit} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Save</button>
            <button onClick={()=>setOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ p }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition border">
      <div className="aspect-square bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
        {p.images?.[0] ? (
          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl">🕯️</div>
        )}
      </div>
      <div className="p-4">
        <div className="font-semibold text-gray-900">{p.title}</div>
        <div className="text-sm text-gray-600 line-clamp-2 mt-1">{p.description}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold">₹{p.price}</div>
          <button className="px-3 py-2 rounded-full bg-indigo-600 text-white text-sm">Add to cart</button>
        </div>
      </div>
    </div>
  )
}

function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Rooted in Tradition</h2>
          <p className="mt-4 text-gray-700">Every stick and cone is crafted with care, using natural ingredients and age old recipes. Our perfumes are blended to bring peace and positivity.</p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow">
          <Spline scene="https://prod.spline.design/myxXfbNiwnbTpGFp/scene.splinecode" style={{ width: '100%', height: 320 }} />
        </div>
      </div>
    </section>
  )
}

function Support() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [sent, setSent] = useState(false)
  const send = async () => {
    const res = await fetch(`${API_BASE}/support`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ name, email, content }) })
    setSent(res.ok)
    if (!res.ok) alert('Failed to send')
  }
  return (
    <section id="support" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-gray-900">Live Support</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border bg-white shadow-sm">
          <div className="grid gap-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="px-3 py-2 rounded-lg ring-1 ring-gray-200 focus:ring-indigo-300 outline-none" />
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email (optional)" className="px-3 py-2 rounded-lg ring-1 ring-gray-200 focus:ring-indigo-300 outline-none" />
            <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="How can we help?" rows={4} className="px-3 py-2 rounded-lg ring-1 ring-gray-200 focus:ring-indigo-300 outline-none" />
            <button onClick={send} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Send</button>
            {sent && <div className="text-green-600 text-sm">Thanks! Our team will reach out soon.</div>}
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow">
          <Spline scene="https://prod.spline.design/myxXfbNiwnbTpGFp/scene.splinecode" style={{ width: '100%', height: 360 }} />
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const auth = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 text-gray-900">
      <Navbar auth={auth} />
      <main className="pt-16">
        <Hero />
        <Products auth={auth} />
        <About />
        <Support />
        <footer className="border-t bg-white/70 backdrop-blur mt-12">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between text-sm text-gray-600">
            <Logo />
            <div>© {new Date().getFullYear()} Radha Kripa. All rights reserved.</div>
          </div>
        </footer>
      </main>
    </div>
  )
}
