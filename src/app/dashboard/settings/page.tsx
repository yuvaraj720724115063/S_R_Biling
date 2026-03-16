'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Sidebar from '@/components/Sidebar'

interface Settings {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyGSTIN: string
  defaultGSTRate: number
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<Settings>({
    companyName: 'S.R. Cycle & Auto Spares',
    companyAddress: 'Thennampulam - 614 806',
    companyPhone: '9487170053, 7358446429',
    companyGSTIN: '',
    defaultGSTRate: 18
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Only allow administrators to access
  if (session?.user?.role !== 'ADMINISTRATOR') {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="card p-8 text-center">
            <p className="text-error font-semibold">Access Denied</p>
            <p className="text-gray-600 mt-2">Only administrators can access settings</p>
          </div>
        </main>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Error saving settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Error saving settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
            <p className="text-gray-600">Manage application settings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Company Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company Address</label>
                  <textarea
                    value={settings.companyAddress}
                    onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company Phone</label>
                  <input
                    type="text"
                    value={settings.companyPhone}
                    onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">GSTIN</label>
                  <input
                    type="text"
                    value={settings.companyGSTIN}
                    onChange={(e) => setSettings({ ...settings, companyGSTIN: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 33AAAAA0000A1Z5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Default GST Rate (%)</label>
                  <input
                    type="number"
                    value={settings.defaultGSTRate}
                    onChange={(e) => setSettings({ ...settings, defaultGSTRate: parseFloat(e.target.value) })}
                    className="input-field"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* User Management Section */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Current User</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{session?.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold">{session?.user?.role?.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className={`p-4 rounded ${message.includes('successfully') ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
