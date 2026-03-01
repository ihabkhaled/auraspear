import { NextResponse } from 'next/server'
import { mockUsers } from '@/mocks/data/admin.data'

export const dynamic = 'force-dynamic'

const currentUser = mockUsers[0]

export async function GET() {
  if (!currentUser) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    data: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      mfaEnabled: currentUser.mfaEnabled,
      lastLogin: currentUser.lastLogin,
    },
  })
}
