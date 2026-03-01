import { NextResponse } from 'next/server'
import { mockUsers } from '@/mocks/data/admin.data'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>
  const email = body['email'] as string | undefined
  const password = body['password'] as string | undefined

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const user = mockUsers.find(u => u.email === email)

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    data: {
      token: 'mock-jwt-token-auraspear-soc-2026',
      refreshToken: 'mock-refresh-token-auraspear-soc-2026',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  })
}
