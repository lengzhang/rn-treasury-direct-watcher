import { Security } from '@/types/treasuryDirect'

export interface SecurityTerm {
    Year?: number | undefined
    Month?: number | undefined
    Week?: number | undefined
    Day?: number | undefined
    term: string
    securities: string[] // security ids
}

export type SecurityTypeTermMapperType = Record<
    string, // security type
    Record<
        string, // security term
        SecurityTerm
    >
>

export type SecuritiesType = Record<string, Security>

export interface State {
    initialized: boolean
    securityTypeTermMapper: SecurityTypeTermMapperType
    securityMapper: Record<string, Security>
    lastUpdatedAt: number
    oldDataPageNum: number
}

export type Action =
    | {
          type: 'initialized'
          storedState?: Pick<State, 'securityTypeTermMapper' | 'securityMapper' | 'lastUpdatedAt'>
      }
    | ({
          type: 'merge-data'
      } & Pick<State, 'securityTypeTermMapper' | 'securityMapper'>)
    | {
          type: 'set-old-data-page-number'
          value: number
      }
