import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

const SETTINGS_KEYS = [
  'companyName',
  'companyAddress',
  'companyPhone',
  'companyGSTIN',
  'defaultGSTRate'
] as const

type SettingsKey = typeof SETTINGS_KEYS[number]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [settingsRows, currentUser] = await Promise.all([
      prisma.settings.findMany({
        where: {
          key: {
            in: [...SETTINGS_KEYS]
          }
        }
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          username: true,
          name: true,
          role: true
        }
      })
    ])

    const mappedSettings = settingsRows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})

    return NextResponse.json({
      settings: {
        companyName: mappedSettings.companyName || 'S.R. Cycle & Auto Spares',
        companyAddress: mappedSettings.companyAddress || 'Thennampulam - 614 806',
        companyPhone: mappedSettings.companyPhone || '9487170053, 7358446429',
        companyGSTIN: mappedSettings.companyGSTIN || '',
        defaultGSTRate: Number(mappedSettings.defaultGSTRate || '18')
      },
      currentUser: currentUser
        ? {
            name: currentUser.name,
            role: currentUser.role,
            username: currentUser.username
          }
        : null
    })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const payloadSettings = (body?.settings ?? body) as Partial<Record<SettingsKey, string | number>>

    const usernameInput = typeof body?.username === 'string' ? body.username.trim() : ''
    const passwordInput = typeof body?.password === 'string' ? body.password : ''

    if (usernameInput.length > 0 && usernameInput.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 })
    }

    if (passwordInput.length > 0 && passwordInput.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const settingsToSave: Array<{ key: SettingsKey; value: string }> = []

    for (const key of SETTINGS_KEYS) {
      const value = payloadSettings[key]
      if (value !== undefined && value !== null) {
        settingsToSave.push({ key, value: String(value) })
      }
    }

    await prisma.$transaction(async (tx) => {
      for (const entry of settingsToSave) {
        await tx.settings.upsert({
          where: { key: entry.key },
          update: { value: entry.value },
          create: { key: entry.key, value: entry.value }
        })
      }

      const userUpdateData: { username?: string; password?: string } = {}

      if (usernameInput.length > 0) {
        userUpdateData.username = usernameInput
      }

      if (passwordInput.length > 0) {
        userUpdateData.password = await hashPassword(passwordInput)
      }

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: session.user.id },
          data: userUpdateData
        })
      }
    })

    return NextResponse.json({
      message: 'Settings saved successfully',
      reloginRequired: Boolean(usernameInput || passwordInput)
    })
  } catch (error: unknown) {
    console.error('Settings save error:', error)

    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }

    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}