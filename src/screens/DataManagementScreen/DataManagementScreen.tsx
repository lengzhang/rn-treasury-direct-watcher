import { Box, SafeAreaView, ScrollView } from '@gluestack-ui/themed'

import Controller from './Controller'
import DataList from './DataList'

import FetchingOldDataAlert from '@/components/FetchingOldDataAlert'

const DataManagementScreen = () => {
    return (
        <SafeAreaView flex={1}>
            <ScrollView flex={1}>
                <Box marginTop="$5">
                    <DataList />
                </Box>
                <Controller />
            </ScrollView>
            <FetchingOldDataAlert />
        </SafeAreaView>
    )
}

export default DataManagementScreen
