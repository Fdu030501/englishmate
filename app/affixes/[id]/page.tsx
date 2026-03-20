import { allAffixes } from '@/lib/affixes/data'
import AffixDetailClient from './client'

// Generate static params for all affixes
export function generateStaticParams() {
  return allAffixes.map((affix) => ({
    id: affix.id,
  }))
}

export default function AffixDetailPage({ params }: { params: { id: string } }) {
  return <AffixDetailClient id={params.id} />
}
