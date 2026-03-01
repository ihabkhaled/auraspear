import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  // Logout is client-side only - clear tokens in localStorage
  return NextResponse.json({ message: 'Logged out successfully' })
}
