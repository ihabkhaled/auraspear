import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { mockIOCCorrelations } from '@/mocks/data/intel.data'
import type { IOCCorrelation } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('query')
  const iocType = searchParams.get('type')

  let filtered: IOCCorrelation[] = [...mockIOCCorrelations]

  if (query) {
    const lowerQuery = query.toLowerCase()
    filtered = filtered.filter(ioc =>
      ioc.iocValue.toLowerCase().includes(lowerQuery)
    )
  }

  if (iocType) {
    const types = iocType.split(',')
    filtered = filtered.filter(ioc => types.includes(ioc.iocType))
  }

  return NextResponse.json({ data: filtered })
}
