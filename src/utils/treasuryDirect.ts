import { Security, SECURITY_TYPES_TYPE } from '@/types/treasuryDirect'

export const TD_BASE_URL = 'https://www.treasurydirect.gov/TA_WS'
export const SECURITIES_BASE_URL = `${TD_BASE_URL}/securities`

export const DATE_FORMAT = 'YYYY-MM-DD'

interface GetAnnouncedSecuritiesParams {
    type?: SECURITY_TYPES_TYPE
    pageSize?: number
    days?: number
}
export async function getAnnouncedSecurities({
    type,
    pageSize = 250,
    days = 1
}: GetAnnouncedSecuritiesParams): Promise<Security[]> {
    const url = new URL(`${SECURITIES_BASE_URL}/announced`)
    url.searchParams.set('format', 'json')
    if (type) url.searchParams.set('type', type)
    url.searchParams.set('pagesize', pageSize.toString())
    url.searchParams.set('days', days.toString())

    const res = await fetch(url)
    const data = await res.json()
    return data
}

export async function getSecuritiesByType(type: SECURITY_TYPES_TYPE): Promise<Security[]> {
    const url = new URL(`${SECURITIES_BASE_URL}/${type}`)
    url.searchParams.set('format', 'json')

    const res = await fetch(url)
    const data = await res.json()
    return data
}

export async function getSecurity(cusip: string, issueDate: Date): Promise<Security[]> {
    const issueDateStr = parseIssueDate(issueDate)

    const res = await fetch(`${SECURITIES_BASE_URL}/${cusip}/${issueDateStr}`)
    const data = await res.json()
    return data
}

interface SearchSecuritiesParams {
    cusip?: string
    startIssueDate?: Date
    endIssueDate?: Date
    pageSize?: number
    pageNum?: number
    type?: SECURITY_TYPES_TYPE
    days?: number
}
export async function searchSecurities({
    cusip,
    startIssueDate,
    endIssueDate,
    pageSize,
    pageNum,
    type,
    days
}: SearchSecuritiesParams): Promise<Security[]> {
    const url = new URL(`${SECURITIES_BASE_URL}/search`)
    url.searchParams.set('format', 'json')
    if (cusip) url.searchParams.set('cusip', cusip)
    if (startIssueDate) {
        const startDate = parseIssueDate(startIssueDate)
        url.searchParams.set('startDate', startDate)
    }
    if (endIssueDate) {
        const endDate = parseIssueDate(endIssueDate)
        url.searchParams.set('endDate', endDate)
    }
    if (pageSize) url.searchParams.set('pagesize', pageSize.toString())
    if (pageNum) url.searchParams.set('pagenum', pageNum.toString())
    if (type) url.searchParams.set('type', type)
    if (days) url.searchParams.set('days', days.toString())

    const res = await fetch(url)
    const data = await res.json()
    return data
}

export function parseIssueDate(date: Date) {
    const year = date.getUTCFullYear().toString()
    const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
    const day = `${date.getUTCDate()}`.padStart(2, '0')
    return `${month}/${day}/${year}`
}

export function parseSecurityTerm(term: string) {
    const obj = term
        .split(' ')
        .map((v) => v.split('-'))
        .reduce<{ Year?: number; Month?: number; Week?: number; Day?: number }>(
            (acc, [num, unit]) => {
                if (unit === 'Year') acc.Year = parseInt(num, 10)
                else if (unit === 'Month') acc.Month = parseInt(num, 10)
                else if (unit === 'Week') acc.Week = parseInt(num, 10)
                else if (unit === 'Day') acc.Day = parseInt(num, 10)
                return acc
            },
            {}
        )
    return { term, ...obj }
}
