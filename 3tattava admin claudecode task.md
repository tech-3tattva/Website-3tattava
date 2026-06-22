# 3TATTAVA — Admin Panel: Complete Fix + Rebuild
## Claude Code Task File | Copy-paste ready for VS Code terminal

---

## CONTEXT

**Project:** 3TATTAVA — India's first Performance Ayurveda brand
**Stack:** Next.js 14 (App Router), Node.js/Express backend on EC2, MongoDB Atlas
**Brand colors:** `#1A1A1A` black, `#C8963E` gold, `#2D4A3E` green, `#F5F0EB` off-white
**Products launching:** RockResin (20g jar, ₹1,299) + Shahjeet Sticks (30 sticks, ₹999)

**Current problem:** Two admin pages exist:
- `/admin` → shows "No admin token provided" error
- `/admin/login` → shows login form but credentials unknown

**What you must build:**
1. Fix admin authentication end-to-end
2. Seed admin credentials into the database
3. Rebuild the admin panel UI (premium dark theme, motion)
4. Full product + inventory management (create, update stock, view orders)

---

## BEFORE YOU START — READ THE CODEBASE

Run these commands first to understand the structure:

```bash
# See the full project structure
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" | grep -v node_modules | grep -v .next | head -60

# Find all admin-related files
find . -path "*/admin*" -not -path "*/node_modules/*" -not -path "*/.next/*"

# Find auth-related backend routes
grep -r "admin" --include="*.js" --include="*.ts" -l | grep -v node_modules | grep -v .next

# Check environment variables
cat .env.local 2>/dev/null || cat .env 2>/dev/null || echo "No .env found — check .env.example"

# Check package.json for dependencies
cat package.json
```

---

## PHASE 1 — DIAGNOSE AND FIX AUTHENTICATION

### Step 1.1 — Find existing admin auth code

```bash
# Find the admin API route
find . -path "*/api/admin*" -not -path "*/node_modules/*"

# Find auth middleware
grep -r "adminToken\|admin_token\|ADMIN_TOKEN\|jwt\|bcrypt" --include="*.ts" --include="*.js" -l | grep -v node_modules | grep -v .next

# Check what the login form posts to
grep -r "admin/login\|/api/admin/auth\|adminLogin" --include="*.tsx" --include="*.ts" -l | grep -v node_modules
```

### Step 1.2 — Understand the token error

The error "No admin token provided" means the `/admin` page checks for a JWT token in:
- `localStorage.getItem('adminToken')` OR
- `cookies.get('adminToken')` OR
- `Authorization: Bearer <token>` header

Find exactly where this check happens:
```bash
grep -r "No admin token provided\|adminToken\|admin_token" --include="*.tsx" --include="*.ts" --include="*.js" -l | grep -v node_modules | grep -v .next
```

### Step 1.3 — Create admin credentials

**Find the backend admin user model/route, then create credentials.**

Check if there's an existing admin seeder:
```bash
find . -name "seed*" -o -name "admin*" | grep -v node_modules | grep -v .next
```

**If using MongoDB Atlas + Express backend (EC2), create this seeder script:**

Create `scripts/createAdmin.js` in the backend project:

```javascript
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1) })

// Check if Admin model exists, create if not
let Admin
try {
  Admin = mongoose.model('Admin')
} catch {
  const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: 'Admin' },
    role: { type: String, default: 'superadmin' },
    createdAt: { type: Date, default: Date.now }
  })
  Admin = mongoose.model('Admin', adminSchema)
}

async function createAdmin() {
  try {
    // Delete existing admin first
    await Admin.deleteOne({ email: 'admin@3tattava.com' })
    
    const hashedPassword = await bcrypt.hash('3Tattava@Admin2025!', 12)
    
    const admin = await Admin.create({
      email: 'admin@3tattava.com',
      password: hashedPassword,
      name: 'Dr. Kashish — 3TATTAVA Admin',
      role: 'superadmin'
    })
    
    console.log('✅ Admin created successfully:')
    console.log('   Email:', admin.email)
    console.log('   Password: 3Tattava@Admin2025!')
    console.log('   ID:', admin._id)
    
    mongoose.connection.close()
  } catch (err) {
    console.error('❌ Error creating admin:', err)
    mongoose.connection.close()
  }
}

createAdmin()
```

Run it:
```bash
node scripts/createAdmin.js
```

**Save these credentials — they are the admin login:**
```
Email:    admin@3tattava.com
Password: 3Tattava@Admin2025!
```

### Step 1.4 — Fix the login API route

Find the existing login route. If it doesn't exist or is broken, create/replace it.

**For Next.js API route** at `app/api/admin/login/route.ts` (or `pages/api/admin/login.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tattava_admin_secret_2025_change_in_prod'
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || ''

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(MONGODB_URI)
}

// Admin Schema (inline to avoid import issues)
const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
})
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    await connectDB()

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() })
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      token,
      admin: { name: admin.name, email: admin.email, role: admin.role }
    })

    // Set httpOnly cookie as well
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### Step 1.5 — Fix the admin auth middleware/guard

Find the file that shows "No admin token provided" and fix it. The pattern should be:

```typescript
// In the admin page or middleware
const token = localStorage.getItem('adminToken') || 
              document.cookie.split('; ').find(r => r.startsWith('adminToken='))?.split('=')[1]

if (!token) {
  router.push('/admin/login')
  return
}

// Verify token with backend
const res = await fetch('/api/admin/verify', {
  headers: { Authorization: `Bearer ${token}` }
})
if (!res.ok) {
  localStorage.removeItem('adminToken')
  router.push('/admin/login')
}
```

Also create the verify endpoint at `app/api/admin/verify/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tattava_admin_secret_2025_change_in_prod'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || 
                  req.cookies.get('adminToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    return NextResponse.json({ valid: true, admin: decoded })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
```

### Step 1.6 — Add JWT_SECRET to environment

Add to `.env.local`:
```
JWT_SECRET=3tattava_super_secret_jwt_key_2025_production
ADMIN_EMAIL=admin@3tattava.com
```

---

## PHASE 2 — REBUILD ADMIN LOGIN PAGE UI

Replace the existing `app/admin/login/page.tsx` completely:

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // Store token
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminName', data.admin.name)
      
      router.push('/admin')
    } catch {
      setError('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600;700&family=Jost:wght@300;400;500&display=swap');

        .admin-login-page {
          min-height: 100vh;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Jost', sans-serif;
        }
        .admin-login-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 60% 50% at 70% 40%, rgba(200,150,62,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 20% 70%, rgba(45,74,62,0.08) 0%, transparent 50%);
        }
        .admin-login-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(200,150,62,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,150,62,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .admin-login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          padding: 56px 48px;
          background: rgba(26,26,26,0.9);
          border: 1px solid rgba(200,150,62,0.15);
          backdrop-filter: blur(20px);
          animation: cardEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-login-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 700;
          color: #F5F0EB;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .admin-login-sub {
          font-size: 10px;
          letter-spacing: 0.3em;
          color: #C8963E;
          text-transform: uppercase;
          margin-bottom: 48px;
        }
        .admin-login-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 600;
          color: #F5F0EB;
          margin: 0 0 8px 0;
        }
        .admin-login-desc {
          font-size: 13px;
          color: rgba(245,240,235,0.4);
          margin: 0 0 36px 0;
          font-weight: 300;
        }
        .admin-field {
          margin-bottom: 20px;
        }
        .admin-label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,240,235,0.5);
          margin-bottom: 8px;
        }
        .admin-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(200,150,62,0.2);
          color: #F5F0EB;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 300;
          padding: 14px 16px;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease;
          box-sizing: border-box;
        }
        .admin-input:focus {
          border-color: rgba(200,150,62,0.6);
          background: rgba(200,150,62,0.04);
        }
        .admin-input::placeholder { color: rgba(245,240,235,0.2); }
        .admin-error {
          background: rgba(220,50,50,0.1);
          border: 1px solid rgba(220,50,50,0.3);
          color: #ff6b6b;
          font-size: 13px;
          padding: 12px 14px;
          margin-bottom: 20px;
          font-weight: 300;
        }
        .admin-btn {
          width: 100%;
          background: #C8963E;
          color: #1A1A1A;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 16px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }
        .admin-btn:hover:not(:disabled) {
          background: #b5852f;
          transform: translateY(-1px);
        }
        .admin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .admin-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(26,26,26,0.3);
          border-top-color: #1A1A1A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-divider {
          height: 1px;
          background: rgba(200,150,62,0.1);
          margin: 36px 0 20px;
        }
        .admin-footer-text {
          font-size: 11px;
          color: rgba(245,240,235,0.2);
          text-align: center;
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="admin-login-page">
        <div className="admin-login-bg" />
        <div className="admin-login-grid" />

        <div className="admin-login-card">
          <div className="admin-login-logo">3TATTAVA</div>
          <div className="admin-login-sub">Operations Center</div>

          <h1 className="admin-login-title">Admin Access</h1>
          <p className="admin-login-desc">Sign in to manage products, orders, and inventory.</p>

          <form onSubmit={handleLogin}>
            {error && <div className="admin-error">{error}</div>}

            <div className="admin-field">
              <label className="admin-label">Email Address</label>
              <input
                type="email"
                className="admin-input"
                placeholder="admin@3tattava.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="admin-btn" disabled={loading}>
              <span className="admin-btn-inner">
                {loading && <span className="spinner" />}
                {loading ? 'Signing In...' : 'Sign In to Dashboard'}
              </span>
            </button>
          </form>

          <div className="admin-divider" />
          <p className="admin-footer-text">3TATTAVA · SankalpaSiddhi Ayupharma Pvt Ltd · Secure Admin</p>
        </div>
      </div>
    </>
  )
}
```

---

## PHASE 3 — REBUILD ADMIN DASHBOARD

Replace `app/admin/page.tsx` completely:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminProducts from '@/components/admin/AdminProducts'
import AdminOrders from '@/components/admin/AdminOrders'
import AdminInventory from '@/components/admin/AdminInventory'

type Tab = 'overview' | 'products' | 'inventory' | 'orders'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [adminName, setAdminName] = useState('Admin')
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, lowStock: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const name = localStorage.getItem('adminName')
    if (!token) { router.push('/admin/login'); return }
    if (name) setAdminName(name)

    // Verify token
    fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (!res.ok) {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
      } else {
        loadStats(token)
      }
    }).catch(() => {
      router.push('/admin/login')
    })
  }, [])

  const loadStats = async (token: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {}
    finally { setLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminName')
    router.push('/admin/login')
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : ''

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600;700&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .admin-shell {
          min-height: 100vh;
          background: #0f0f0f;
          color: #F5F0EB;
          font-family: 'Jost', sans-serif;
          display: flex;
        }
        /* ── SIDEBAR ── */
        .admin-sidebar {
          width: 240px;
          min-height: 100vh;
          background: #141414;
          border-right: 1px solid rgba(200,150,62,0.1);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 32px 0;
        }
        .admin-logo {
          padding: 0 28px 32px;
          border-bottom: 1px solid rgba(200,150,62,0.08);
        }
        .admin-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          color: #F5F0EB;
          letter-spacing: 0.05em;
        }
        .admin-logo-sub {
          font-size: 10px;
          letter-spacing: 0.25em;
          color: #C8963E;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .admin-nav {
          flex: 1;
          padding: 24px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 400;
          color: rgba(245,240,235,0.45);
          transition: all 0.2s ease;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          letter-spacing: 0.02em;
        }
        .admin-nav-item:hover {
          color: rgba(245,240,235,0.85);
          background: rgba(200,150,62,0.06);
        }
        .admin-nav-item.active {
          color: #F5F0EB;
          background: rgba(200,150,62,0.1);
          border-left: 2px solid #C8963E;
        }
        .admin-nav-icon { font-size: 16px; }
        .admin-sidebar-footer {
          padding: 20px 12px;
          border-top: 1px solid rgba(200,150,62,0.08);
        }
        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 16px;
          background: transparent;
          border: 1px solid rgba(200,150,62,0.15);
          color: rgba(245,240,235,0.4);
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 4px;
        }
        .admin-logout-btn:hover {
          border-color: rgba(200,150,62,0.4);
          color: rgba(245,240,235,0.8);
        }
        /* ── MAIN AREA ── */
        .admin-main {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }
        .admin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .admin-page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 700;
          color: #F5F0EB;
        }
        .admin-page-sub {
          font-size: 13px;
          color: rgba(245,240,235,0.35);
          margin-top: 4px;
          font-weight: 300;
        }
        .admin-greeting {
          font-size: 13px;
          color: rgba(245,240,235,0.4);
          text-align: right;
        }
        .admin-greeting strong {
          color: #C8963E;
          font-weight: 500;
        }
        /* ── STAT CARDS ── */
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: #1a1a1a;
          border: 1px solid rgba(200,150,62,0.1);
          padding: 24px;
          position: relative;
          overflow: hidden;
          animation: statEnter 0.5s ease forwards;
          opacity: 0;
        }
        .stat-card:nth-child(1) { animation-delay: 0.05s; }
        .stat-card:nth-child(2) { animation-delay: 0.1s; }
        .stat-card:nth-child(3) { animation-delay: 0.15s; }
        .stat-card:nth-child(4) { animation-delay: 0.2s; }
        @keyframes statEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(200,150,62,0.4), transparent);
        }
        .stat-label {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(245,240,235,0.35);
          margin-bottom: 12px;
        }
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          font-weight: 700;
          color: #F5F0EB;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-value.gold { color: #C8963E; }
        .stat-change {
          font-size: 12px;
          color: rgba(245,240,235,0.3);
          font-weight: 300;
        }
      `}</style>

      <div className="admin-shell">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <div className="admin-logo-text">3TATTAVA</div>
            <div className="admin-logo-sub">Operations Center</div>
          </div>

          <nav className="admin-nav">
            {[
              { id: 'overview', label: 'Overview', icon: '◈' },
              { id: 'products', label: 'Products', icon: '◉' },
              { id: 'inventory', label: 'Inventory', icon: '▣' },
              { id: 'orders', label: 'Orders', icon: '◎' },
            ].map((item) => (
              <button
                key={item.id}
                className={`admin-nav-item${activeTab === item.id ? ' active' : ''}`}
                onClick={() => setActiveTab(item.id as Tab)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button className="admin-logout-btn" onClick={handleLogout}>
              <span>↩</span> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <h1 className="admin-page-title">
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'products' && 'Products'}
                {activeTab === 'inventory' && 'Inventory'}
                {activeTab === 'orders' && 'Orders'}
              </h1>
              <p className="admin-page-sub">
                {activeTab === 'overview' && 'Live business snapshot'}
                {activeTab === 'products' && 'Manage your product catalogue'}
                {activeTab === 'inventory' && 'Track and update stock levels'}
                {activeTab === 'orders' && 'View and manage customer orders'}
              </p>
            </div>
            <div className="admin-greeting">
              Welcome back, <strong>{adminName.split('—')[0].trim()}</strong>
              <br />
              <span style={{ fontSize: 11 }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          {/* Overview Stats */}
          {activeTab === 'overview' && (
            <>
              <div className="admin-stats">
                <div className="stat-card">
                  <p className="stat-label">Total Orders</p>
                  <p className="stat-value">{loading ? '—' : stats.orders}</p>
                  <p className="stat-change">All time</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Revenue</p>
                  <p className="stat-value gold">₹{loading ? '—' : stats.revenue.toLocaleString('en-IN')}</p>
                  <p className="stat-change">All time</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Products</p>
                  <p className="stat-value">{loading ? '—' : stats.products}</p>
                  <p className="stat-change">Active SKUs</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Low Stock</p>
                  <p className="stat-value" style={{ color: stats.lowStock > 0 ? '#ff6b6b' : '#4CAF50' }}>
                    {loading ? '—' : stats.lowStock}
                  </p>
                  <p className="stat-change">Items below 10 units</p>
                </div>
              </div>
              <AdminProducts token={token} readOnly />
            </>
          )}

          {activeTab === 'products' && <AdminProducts token={token} />}
          {activeTab === 'inventory' && <AdminInventory token={token} />}
          {activeTab === 'orders' && <AdminOrders token={token} />}
        </main>
      </div>
    </>
  )
}
```

---

## PHASE 4 — PRODUCT MANAGEMENT COMPONENT

Create `components/admin/AdminProducts.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'

interface Product {
  _id?: string
  name: string
  sku: string
  price: number
  mrp: number
  description: string
  category: string
  stock: number
  images: string[]
  active: boolean
  weight: string
  tags: string[]
}

const BLANK_PRODUCT: Product = {
  name: '',
  sku: '',
  price: 0,
  mrp: 0,
  description: '',
  category: 'shilajit-resin',
  stock: 0,
  images: [],
  active: true,
  weight: '',
  tags: [],
}

export default function AdminProducts({ token, readOnly = false }: { token: string; readOnly?: boolean }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Product>(BLANK_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch {}
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    try {
      const url = editing?._id ? `/api/admin/products/${editing._id}` : '/api/admin/products'
      const method = editing?._id ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setMsg(editing?._id ? '✅ Product updated' : '✅ Product created')
        setShowForm(false)
        setEditing(null)
        setForm(BLANK_PRODUCT)
        loadProducts()
      } else {
        const d = await res.json()
        setMsg(`❌ ${d.error || 'Save failed'}`)
      }
    } catch {
      setMsg('❌ Connection error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    loadProducts()
  }

  const startEdit = (p: Product) => {
    setEditing(p)
    setForm(p)
    setShowForm(true)
  }

  const startNew = () => {
    setEditing(null)
    setForm(BLANK_PRODUCT)
    setShowForm(true)
  }

  return (
    <>
      <style>{`
        .ap-wrap { }
        .ap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .ap-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: #F5F0EB;
        }
        .ap-btn {
          background: #C8963E;
          color: #1A1A1A;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 11px 24px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ap-btn:hover { background: #b5852f; }
        .ap-btn.ghost {
          background: transparent;
          border: 1px solid rgba(200,150,62,0.3);
          color: rgba(245,240,235,0.7);
        }
        .ap-btn.ghost:hover {
          border-color: rgba(200,150,62,0.7);
          color: #F5F0EB;
          background: transparent;
        }
        .ap-btn.danger {
          background: transparent;
          border: 1px solid rgba(220,50,50,0.3);
          color: rgba(255,107,107,0.7);
          font-size: 11px;
          padding: 8px 16px;
        }
        .ap-btn.danger:hover {
          border-color: rgba(220,50,50,0.7);
          color: #ff6b6b;
          background: transparent;
        }
        .ap-table {
          width: 100%;
          border-collapse: collapse;
        }
        .ap-table th {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(245,240,235,0.3);
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(200,150,62,0.1);
          font-weight: 400;
        }
        .ap-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 14px;
          color: rgba(245,240,235,0.75);
          font-weight: 300;
        }
        .ap-table tr:hover td {
          background: rgba(200,150,62,0.03);
        }
        .ap-product-name {
          color: #F5F0EB;
          font-weight: 400;
          font-size: 15px;
        }
        .ap-stock-badge {
          display: inline-block;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 500;
          border-radius: 2px;
        }
        .ap-stock-ok { background: rgba(76,175,80,0.12); color: #81c784; }
        .ap-stock-low { background: rgba(255,152,0,0.12); color: #ffb74d; }
        .ap-stock-out { background: rgba(220,50,50,0.12); color: #ff6b6b; }
        .ap-active-dot {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          margin-right: 6px;
        }
        .dot-on { background: #81c784; }
        .dot-off { background: #ff6b6b; }
        /* Form */
        .ap-form-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .ap-form-card {
          background: #1a1a1a;
          border: 1px solid rgba(200,150,62,0.2);
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 40px;
        }
        .ap-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: #F5F0EB;
          margin-bottom: 32px;
        }
        .ap-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .ap-form-full { grid-column: 1 / -1; }
        .ap-form-field { display: flex; flex-direction: column; gap: 6px; }
        .ap-form-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,240,235,0.4);
        }
        .ap-form-input, .ap-form-textarea, .ap-form-select {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(200,150,62,0.18);
          color: #F5F0EB;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          font-weight: 300;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .ap-form-input:focus, .ap-form-textarea:focus, .ap-form-select:focus {
          border-color: rgba(200,150,62,0.5);
        }
        .ap-form-textarea { resize: vertical; min-height: 90px; }
        .ap-form-select option { background: #1a1a1a; }
        .ap-form-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
          justify-content: flex-end;
        }
        .ap-msg {
          padding: 12px 14px;
          margin-bottom: 16px;
          font-size: 13px;
          border-radius: 2px;
        }
        .ap-msg.success { background: rgba(76,175,80,0.1); color: #81c784; border: 1px solid rgba(76,175,80,0.2); }
        .ap-msg.error { background: rgba(220,50,50,0.1); color: #ff6b6b; border: 1px solid rgba(220,50,50,0.2); }
      `}</style>

      <div className="ap-wrap">
        {!readOnly && (
          <div className="ap-header">
            <h2 className="ap-title">Product Catalogue</h2>
            <button className="ap-btn" onClick={startNew}>+ Add Product</button>
          </div>
        )}

        {msg && (
          <div className={`ap-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>
        )}

        {loading ? (
          <p style={{ color: 'rgba(245,240,235,0.3)', fontSize: 14 }}>Loading products...</p>
        ) : (
          <table className="ap-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                {!readOnly && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'rgba(245,240,235,0.2)', padding: '40px' }}>
                    No products yet. Click "+ Add Product" to create your first SKU.
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p._id}>
                    <td className="ap-product-name">{p.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(245,240,235,0.4)' }}>{p.sku}</td>
                    <td>₹{p.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`ap-stock-badge ${p.stock > 10 ? 'ap-stock-ok' : p.stock > 0 ? 'ap-stock-low' : 'ap-stock-out'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <span className={`ap-active-dot ${p.active ? 'dot-on' : 'dot-off'}`} />
                      {p.active ? 'Active' : 'Inactive'}
                    </td>
                    {!readOnly && (
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="ap-btn ghost" onClick={() => startEdit(p)}>Edit</button>
                          <button className="ap-btn danger" onClick={() => handleDelete(p._id!)}>Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="ap-form-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="ap-form-card">
            <h2 className="ap-form-title">{editing?._id ? 'Edit Product' : 'Add New Product'}</h2>

            <div className="ap-form-grid">
              <div className="ap-form-field ap-form-full">
                <label className="ap-form-label">Product Name *</label>
                <input className="ap-form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. RockResin — Pure Himalayan Shilajit" />
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">SKU *</label>
                <input className="ap-form-input" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="e.g. RR-20G-001" />
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">Category</label>
                <select className="ap-form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="shilajit-resin">Shilajit Resin</option>
                  <option value="honey-sticks">Honey Sticks</option>
                  <option value="bundle">Bundle</option>
                </select>
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">Sale Price (₹) *</label>
                <input type="number" className="ap-form-input" value={form.price} onChange={e => setForm({...form, price: +e.target.value})} />
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">MRP (₹)</label>
                <input type="number" className="ap-form-input" value={form.mrp} onChange={e => setForm({...form, mrp: +e.target.value})} />
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">Stock Units *</label>
                <input type="number" className="ap-form-input" value={form.stock} onChange={e => setForm({...form, stock: +e.target.value})} />
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">Weight / Size</label>
                <input className="ap-form-input" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} placeholder="e.g. 20g" />
              </div>
              <div className="ap-form-field ap-form-full">
                <label className="ap-form-label">Description</label>
                <textarea className="ap-form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Product description..." />
              </div>
              <div className="ap-form-field">
                <label className="ap-form-label">Status</label>
                <select className="ap-form-select" value={form.active ? 'true' : 'false'} onChange={e => setForm({...form, active: e.target.value === 'true'})}>
                  <option value="true">Active (visible)</option>
                  <option value="false">Inactive (hidden)</option>
                </select>
              </div>
            </div>

            {msg && <div className={`ap-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>}

            <div className="ap-form-actions">
              <button className="ap-btn ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="ap-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : (editing?._id ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

---

## PHASE 5 — INVENTORY QUICK-UPDATE COMPONENT

Create `components/admin/AdminInventory.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'

export default function AdminInventory({ token }: { token: string }) {
  const [products, setProducts] = useState<any[]>([])
  const [updates, setUpdates] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
  }, [])

  const updateStock = async (id: string, newStock: number) => {
    setSaving(id)
    try {
      const res = await fetch(`/api/admin/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stock: newStock }),
      })
      if (res.ok) {
        setMsgs(m => ({ ...m, [id]: '✅ Updated' }))
        setProducts(p => p.map(x => x._id === id ? { ...x, stock: newStock } : x))
        setTimeout(() => setMsgs(m => ({ ...m, [id]: '' })), 2000)
      } else {
        setMsgs(m => ({ ...m, [id]: '❌ Failed' }))
      }
    } finally { setSaving(null) }
  }

  return (
    <>
      <style>{`
        .inv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .inv-card {
          background: #1a1a1a;
          border: 1px solid rgba(200,150,62,0.1);
          padding: 28px;
          position: relative;
        }
        .inv-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: #F5F0EB;
          margin-bottom: 4px;
        }
        .inv-card-sku {
          font-size: 11px;
          color: rgba(245,240,235,0.3);
          letter-spacing: 0.1em;
          margin-bottom: 20px;
          font-family: monospace;
        }
        .inv-current {
          font-size: 48px;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
        }
        .inv-current.ok { color: #81c784; }
        .inv-current.low { color: #ffb74d; }
        .inv-current.out { color: #ff6b6b; }
        .inv-current-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,240,235,0.3);
          margin-bottom: 20px;
        }
        .inv-update-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .inv-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(200,150,62,0.2);
          color: #F5F0EB;
          font-family: 'Jost', sans-serif;
          font-size: 16px;
          font-weight: 400;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .inv-input:focus { border-color: rgba(200,150,62,0.5); }
        .inv-save-btn {
          background: #C8963E;
          color: #1A1A1A;
          border: none;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          padding: 10px 20px;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .inv-save-btn:hover { background: #b5852f; }
        .inv-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .inv-msg {
          font-size: 12px;
          margin-top: 8px;
          height: 16px;
          transition: opacity 0.3s;
        }
        .inv-divider {
          height: 1px;
          background: rgba(200,150,62,0.08);
          margin: 20px 0;
        }
        .inv-quick-btns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .inv-quick-btn {
          background: transparent;
          border: 1px solid rgba(200,150,62,0.2);
          color: rgba(245,240,235,0.5);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .inv-quick-btn:hover {
          border-color: rgba(200,150,62,0.5);
          color: #C8963E;
        }
      `}</style>

      <div className="inv-grid">
        {products.map(p => {
          const currentStock = p.stock
          const inputVal = updates[p._id] !== undefined ? updates[p._id] : currentStock
          const stockClass = currentStock > 20 ? 'ok' : currentStock > 5 ? 'low' : 'out'

          return (
            <div key={p._id} className="inv-card">
              <p className="inv-card-name">{p.name}</p>
              <p className="inv-card-sku">SKU: {p.sku}</p>

              <p className={`inv-current ${stockClass}`}>{currentStock}</p>
              <p className="inv-current-label">Units in stock</p>

              <div className="inv-divider" />

              <div className="inv-quick-btns" style={{ marginBottom: 12 }}>
                {[10, 25, 50, 100].map(n => (
                  <button key={n} className="inv-quick-btn"
                    onClick={() => setUpdates(u => ({ ...u, [p._id]: currentStock + n }))}>
                    +{n}
                  </button>
                ))}
                <button className="inv-quick-btn"
                  onClick={() => setUpdates(u => ({ ...u, [p._id]: 0 }))}>
                  Set 0
                </button>
              </div>

              <div className="inv-update-row">
                <input
                  type="number"
                  className="inv-input"
                  value={inputVal}
                  min={0}
                  onChange={e => setUpdates(u => ({ ...u, [p._id]: +e.target.value }))}
                />
                <button
                  className="inv-save-btn"
                  disabled={saving === p._id}
                  onClick={() => updateStock(p._id, inputVal as number)}
                >
                  {saving === p._id ? '...' : 'Update'}
                </button>
              </div>
              <p className="inv-msg" style={{ color: msgs[p._id]?.startsWith('✅') ? '#81c784' : '#ff6b6b' }}>
                {msgs[p._id] || ''}
              </p>
            </div>
          )
        })}
      </div>
    </>
  )
}
```

---

## PHASE 6 — BACKEND API ROUTES

Create these Next.js API routes:

### `app/api/admin/products/route.ts` (GET all + POST new)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tattava_admin_secret_2025_change_in_prod'
const MONGODB_URI = process.env.MONGODB_URI || ''

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(MONGODB_URI)
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  mrp: { type: Number },
  description: { type: String },
  category: { type: String, default: 'shilajit-resin' },
  stock: { type: Number, default: 0 },
  images: [String],
  active: { type: Boolean, default: true },
  weight: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const products = await Product.find({}).sort({ createdAt: -1 })
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  try {
    const data = await req.json()
    data.updatedAt = new Date()
    const product = await Product.create(data)
    return NextResponse.json({ product }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
```

### `app/api/admin/products/[id]/route.ts` (GET one + PUT + DELETE)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tattava_admin_secret_2025_change_in_prod'
const MONGODB_URI = process.env.MONGODB_URI || ''

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(MONGODB_URI)
}

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
  name: String, sku: String, price: Number, mrp: Number,
  description: String, category: String, stock: Number,
  images: [String], active: Boolean, weight: String, tags: [String],
  updatedAt: Date,
}))

function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const data = await req.json()
  data.updatedAt = new Date()
  const product = await Product.findByIdAndUpdate(params.id, data, { new: true })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  await Product.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
```

### `app/api/admin/products/[id]/stock/route.ts` (PATCH stock only)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tattava_admin_secret_2025_change_in_prod'
const MONGODB_URI = process.env.MONGODB_URI || ''

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(MONGODB_URI)
}

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
  stock: Number, updatedAt: Date
}))

function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { stock } = await req.json()
  const product = await Product.findByIdAndUpdate(
    params.id,
    { stock, updatedAt: new Date() },
    { new: true }
  )
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product })
}
```

### `app/api/admin/stats/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tattava_admin_secret_2025_change_in_prod'
const MONGODB_URI = process.env.MONGODB_URI || ''

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(MONGODB_URI)
}

function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()

  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ stock: Number, price: Number, active: Boolean }))
  const Order = mongoose.models.Order

  const products = await Product.find({})
  const productCount = products.length
  const lowStock = products.filter((p: any) => p.stock <= 10).length

  let orderCount = 0
  let revenue = 0
  if (Order) {
    orderCount = await Order.countDocuments({})
    const orders = await Order.find({})
    revenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
  }

  return NextResponse.json({ orders: orderCount, revenue, products: productCount, lowStock })
}
```

---

## PHASE 7 — SEED THE TWO LAUNCH PRODUCTS

Create `scripts/seedProducts.js` and run it:

```javascript
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected'))

const productSchema = new mongoose.Schema({
  name: String, sku: String, price: Number, mrp: Number,
  description: String, category: String, stock: Number,
  images: [String], active: Boolean, weight: String, tags: [String],
  createdAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now }
})
const Product = mongoose.model('Product', productSchema)

async function seed() {
  // Clear existing
  await Product.deleteMany({})

  await Product.create([
    {
      name: 'RockResin — Pure Himalayan Shilajit',
      sku: 'RR-20G-001',
      price: 1299,
      mrp: 1499,
      description: 'Pure Himalayan Shilajit resin sourced above 16,000ft. ≥70% natural fulvic acid, 80+ trace minerals. Triphala purified. NABL lab-tested. 20g glass jar — 30-40 day supply.',
      category: 'shilajit-resin',
      stock: 100,
      images: ['https://media.3tattava.com/products/Rockresin-hero.jpeg'],
      active: true,
      weight: '20g',
      tags: ['shilajit', 'resin', 'energy', 'minerals', 'himalayan'],
    },
    {
      name: 'Shahjeet Sticks — Honey Shilajit',
      sku: 'SJ-30S-001',
      price: 999,
      mrp: 1199,
      description: '600mg pure Shilajit per stick, infused with natural honey. 30 single-serve sticks. Tear, squeeze, perform. No measuring, no mixing. NABL tested, AYUSH-GMP certified.',
      category: 'honey-sticks',
      stock: 150,
      images: ['https://media.3tattava.com/products/shahjeet-box.png'],
      active: true,
      weight: '30 sticks × 8g',
      tags: ['shilajit', 'honey', 'sticks', 'daily-ritual', 'portable'],
    }
  ])

  console.log('✅ 2 products seeded:')
  console.log('   — RockResin (₹1,299) — 100 units')
  console.log('   — Shahjeet Sticks (₹999) — 150 units')
  mongoose.connection.close()
}

seed()
```

Run:
```bash
node scripts/seedProducts.js
```

---

## PHASE 8 — ALSO CREATE PLACEHOLDER ORDERS COMPONENT

Create `components/admin/AdminOrders.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'

export default function AdminOrders({ token }: { token: string }) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <style>{`
        .ord-empty {
          text-align: center;
          padding: 80px 24px;
          color: rgba(245,240,235,0.2);
        }
        .ord-empty-icon { font-size: 48px; margin-bottom: 16px; }
        .ord-empty-text { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: rgba(245,240,235,0.3); }
        .ord-empty-sub { font-size: 13px; margin-top: 8px; font-weight: 300; }
        .ord-table { width: 100%; border-collapse: collapse; }
        .ord-table th {
          font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(245,240,235,0.3); padding: 12px 16px; text-align: left;
          border-bottom: 1px solid rgba(200,150,62,0.1); font-weight: 400;
        }
        .ord-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 13px; color: rgba(245,240,235,0.7); font-weight: 300;
        }
        .status-badge {
          display: inline-block; padding: 3px 10px; font-size: 11px; font-weight: 500; border-radius: 2px;
        }
        .s-pending { background: rgba(255,152,0,0.12); color: #ffb74d; }
        .s-confirmed { background: rgba(76,175,80,0.12); color: #81c784; }
        .s-shipped { background: rgba(33,150,243,0.12); color: #64b5f6; }
        .s-delivered { background: rgba(76,175,80,0.18); color: #a5d6a7; }
        .s-cancelled { background: rgba(220,50,50,0.12); color: #ff6b6b; }
      `}</style>

      {loading ? (
        <p style={{ color: 'rgba(245,240,235,0.3)', fontSize: 14 }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="ord-empty">
          <div className="ord-empty-icon">◎</div>
          <p className="ord-empty-text">No orders yet</p>
          <p className="ord-empty-sub">Orders will appear here once customers start buying.</p>
        </div>
      ) : (
        <table className="ord-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o._id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{o._id?.slice(-8).toUpperCase()}</td>
                <td>{o.customer?.name || o.email || '—'}</td>
                <td>{o.items?.length || 1} item(s)</td>
                <td>₹{o.total?.toLocaleString('en-IN') || '—'}</td>
                <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <span className={`status-badge s-${o.status || 'pending'}`}>
                    {(o.status || 'pending').charAt(0).toUpperCase() + (o.status || 'pending').slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
```

---

## PHASE 9 — INSTALL DEPENDENCIES

```bash
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
npm install mongoose
```

---

## PHASE 10 — TEST EVERYTHING

```bash
npm run dev
```

**Test flow:**
1. Go to `http://localhost:3000/admin` → should redirect to `/admin/login`
2. Enter credentials:
   - Email: `admin@3tattava.com`
   - Password: `3Tattava@Admin2025!`
3. Click Sign In → should land on dashboard
4. Check stats cards load
5. Click "Products" → should see 2 seeded products
6. Click "Inventory" → update stock on RockResin, verify number changes
7. Click "+ Add Product" → fill form → save → verify it appears in list
8. Click "Orders" → should show empty state (no orders yet)
9. Click Sign Out → should return to login

---

## PHASE 11 — DEPLOY

```bash
git add .
git commit -m "feat: admin panel - auth fix, product management, inventory control, premium UI"
git push origin main
```

Then run the seeder script on production (you can do this from your EC2 or via Vercel serverless if the DB connection works):
```bash
NODE_ENV=production node scripts/seedProducts.js
```

---

## YOUR ADMIN CREDENTIALS (SAVE THIS)

```
URL:      https://3tattava.com/admin/login
Email:    admin@3tattava.com  
Password: 3Tattava@Admin2025!
Role:     superadmin
```

**Change the password after first login by updating the seeder script with a new password and re-running it.**

---

## IMPORTANT NOTES FOR CLAUDE CODE

1. **Read the existing codebase first** — use the diagnostic commands in Phase 1 before writing any new code
2. **Don't duplicate models** — check `mongoose.models.ModelName` before creating new schemas
3. **The MongoDB connection string** is in `.env.local` as `MONGODB_URI` — do not hardcode it
4. **JWT_SECRET must be in .env.local** — add it if missing
5. **The admin route `/admin` currently crashes** because it checks for a token that doesn't exist — fix the auth check first (Phase 1) before rebuilding the UI
6. **Preserve existing routes** — only modify admin-related files