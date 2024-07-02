import R from 'ramda'
import { useReducer } from 'react'

import { DEFAULT_RECENT_FETCH_DAYS, MAX_RETRY_COUNT } from '@/constants'
import { SECURITY_TYPES } from '@/constants/treasuryDirect'
import { Security } from '@/types/treasuryDirect'
import { sleep } from '@/utils'
import { getAnnouncedSecurities } from '@/utils/treasuryDirect'

interface State {
    status: 'ideal' | 'fetching' | 'retry'
    fetchedCount: number
    retriedCount: number
    errorMessage: string
}

type Action = { type: 'fetching' | 'retry' | 'success' } | { type: 'failed'; msg: string }

const initialState: State = {
    status: 'ideal',
    fetchedCount: 0,
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
            return { ...initialState, fetchedCount: state.fetchedCount + 1 }

        case 'failed':
            return { ...state, status: 'ideal', retriedCount: 0, errorMessage: action.msg }

        default:
            return state
    }
}

const useRetrieveRecentTreasuryDirectData = (
    loadSecurities: (securities: Security[], error: any | null) => Promise<void>
) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    async function getRecentTreasuryDirectData(days: number = DEFAULT_RECENT_FETCH_DAYS) {
        if (state.status !== 'ideal' && state.status !== 'retry') return

        dispatch({ type: 'fetching' })

        try {
            console.log('Start getting recent securities from Treasury Direct')

            const recentSecurities = await Promise.all(
                SECURITY_TYPES.map((type) => getAnnouncedSecurities({ type, days }))
            ).then((value) => R.flatten(value))

            console.log(
                `Success retrieve ${recentSecurities.length} recent securities from Treasury Direct`
            )

            await loadSecurities(recentSecurities, null)
            dispatch({ type: 'success' })
        } catch (error: any) {
            console.error('Unable to fetch treasury direct data: ', error)
            console.log('Retried count: ', state.retriedCount)
            if (state.retriedCount < MAX_RETRY_COUNT) {
                await sleep(1000)
                dispatch({ type: 'retry' })
                await getRecentTreasuryDirectData(days)
            } else {
                dispatch({
                    type: 'failed',
                    msg: error?.message || 'Retrieve recent treasury direct data failed'
                })
                await loadSecurities([], error)
            }
        }
    }

    return { state, getRecentTreasuryDirectData }
}

export default useRetrieveRecentTreasuryDirectData
