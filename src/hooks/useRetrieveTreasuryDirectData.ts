import { useReducer } from 'react'

import { FETCH_PAGE_SIZE, MAX_RETRY_COUNT } from '@/constants'
import { Security } from '@/types/treasuryDirect'
import { sleep } from '@/utils'
import { searchSecurities } from '@/utils/treasuryDirect'

interface State {
    status: 'ideal' | 'fetching' | 'retry'
    retriedCount: number
    errorMessage: string
}

type Action = { type: 'fetching' | 'retry' | 'success' } | { type: 'failed'; msg: string }

const initialState: State = {
    status: 'ideal',
    retriedCount: 0,
    errorMessage: ''
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'fetching':
            return { ...state, status: 'fetching', errorMessage: '' }

        case 'retry':
            return { ...state, status: 'retry', retriedCount: state.retriedCount + 1 }

        case 'success':
            return { ...initialState }

        case 'failed':
            return { ...state, status: 'ideal', retriedCount: 0, errorMessage: action.msg }

        default:
            return state
    }
}

const useRetrieveTreasuryDirectData = (
    loadSecurities: (securities: Security[], error: any | null) => Promise<void>
) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    async function getTreasuryDirectData(pageNum: number) {
        if (!Number.isInteger(pageNum)) {
            console.error(`Page number, ${pageNum}, must be an integer`)
            return
        }
        if (state.status !== 'ideal' && state.status !== 'retry') return

        dispatch({ type: 'fetching' })

        try {
            console.log(`Start getting securities from Treasury Direct for page: ${pageNum}`)

            const securities = await searchSecurities({
                pageNum,
                pageSize: FETCH_PAGE_SIZE,
                endIssueDate: new Date()
            })

            console.log(
                `Success retrieve ${securities.length} securities from Treasury Direct for page ${pageNum}`
            )

            await loadSecurities(securities, null)
            dispatch({ type: 'success' })
        } catch (error: any) {
            console.error(`Unable to fetch treasury direct data for page ${pageNum}: `, error)
            console.log('Retried count: ', state.retriedCount)
            if (state.retriedCount < MAX_RETRY_COUNT) {
                await sleep(1000)
                dispatch({ type: 'retry' })
                await getTreasuryDirectData(pageNum)
            } else {
                dispatch({
                    type: 'failed',
                    msg:
                        error?.message || `Retrieve treasury direct data failed for page ${pageNum}`
                })
                await loadSecurities([], error)
            }
        }
    }

    return { state, getTreasuryDirectData }
}

export default useRetrieveTreasuryDirectData
