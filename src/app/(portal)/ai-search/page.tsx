'use client'

import { Search } from 'lucide-react'
import { SearchResultsTable } from '@/components/ai-search'
import { LoadingSpinner, PageHeader, SearchInput } from '@/components/common'
import { Badge } from '@/components/ui'
import { useSemanticSearch } from '@/hooks'
import { AI_SEARCH_MODULES } from '@/lib/constants/ai-search'

export default function AiSearchPage() {
  const {
    t,
    canView,
    query,
    setQuery,
    selectedModules,
    toggleModule,
    results,
    isLoading,
    isFetching,
    hasSearched,
  } = useSemanticSearch()

  if (!canView) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        {t('noAccess')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      <div className="space-y-4">
        <SearchInput value={query} onChange={setQuery} placeholder={t('searchPlaceholder')} />

        <div className="flex flex-wrap gap-2">
          {AI_SEARCH_MODULES.map(mod => (
            <button key={mod} type="button" onClick={() => toggleModule(mod)}>
              <Badge variant={selectedModules.includes(mod) ? 'default' : 'outline'}>
                {t(`modules.${mod}`)}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {isLoading && hasSearched && (
        <div className="flex h-32 items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && hasSearched && (
        <SearchResultsTable t={t} data={results} loading={isFetching} />
      )}
      {!hasSearched && (
        <div className="text-muted-foreground flex h-32 items-center justify-center">
          <Search className="me-2 h-5 w-5" />
          {t('enterQuery')}
        </div>
      )}
    </div>
  )
}
