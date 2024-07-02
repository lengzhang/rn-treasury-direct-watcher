import { Alert, AlertIcon, Spinner, Text } from '@gluestack-ui/themed'

import { useDataContext } from '@/contexts/DataContext'

const FetchingOldDataAlert = () => {
    const { oldDataPageNum } = useDataContext()

    return oldDataPageNum > 0 ? (
        <Alert action="info" variant="accent" marginTop="auto" borderRadius="$none">
            <AlertIcon as={Spinner} marginRight="$3" />
            <Text>Retrieving securities from Treasury Direct: page {oldDataPageNum}</Text>
        </Alert>
    ) : null
}

export default FetchingOldDataAlert
