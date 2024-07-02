import { useToken } from '@gluestack-style/react'
import { FC, memo, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { ChartConfig } from 'react-native-chart-kit/dist/HelperTypes'
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart'

import { useDataContext } from '@/contexts/DataContext'
import { useSettingContext } from '@/contexts/SettingContext'

const CHART_WIDTH = Dimensions.get('screen').width
const CHART_HEIGHT = 240

const NUMBER_OF_SECURITIES = 10

interface DataChartProps {
    ids: string[]
}

interface DataChartProps {
    ids: string[]
}

const DataChart: FC<DataChartProps> = ({ ids }) => {
    const { finalColorMode } = useSettingContext()
    const white = useToken('colors', 'white')
    const backgroundDark900 = useToken('colors', 'backgroundDark900')

    const { securityMapper } = useDataContext()

    const [data, setData] = useState<LineChartData>({ labels: [], datasets: [{ data: [] }] })

    useEffect(() => {
        let startIndex = 0
        for (startIndex; startIndex < ids.length; startIndex++) {
            if (securityMapper[ids[startIndex]].pricePer100) break
        }

        const recentSecurities = ids
            .slice(startIndex, startIndex + NUMBER_OF_SECURITIES)
            .map((id) => securityMapper[id])
            .reverse()

        setData(
            recentSecurities.reduce<LineChartData>(
                (acc, security) => {
                    const label = security.issueDate.replace(/T.*$/, '').replace(/^\d{4}-/, '')
                    acc.labels.push(label)

                    const profit = security.pricePer100 ? 100 - parseFloat(security.pricePer100) : 0
                    acc.datasets[0].data.push(profit)
                    return acc
                },
                {
                    labels: [],
                    datasets: [{ data: [] }]
                }
            )
        )
    }, [ids])

    const chartConfig: ChartConfig = {
        ...(finalColorMode === 'light'
            ? {
                  backgroundGradientFrom: white,
                  backgroundGradientTo: white,
                  decimalPlaces: 5, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(38, 38, 38, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(38, 38, 38, ${opacity})`
              }
            : {
                  backgroundGradientFrom: backgroundDark900,
                  backgroundGradientTo: backgroundDark900,
                  decimalPlaces: 5, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
              }),
        strokeWidth: 5
    }

    return data.labels.length > 0 ? (
        <LineChart
            data={{ ...data, legend: [`Recent ${NUMBER_OF_SECURITIES} profit per $100`] }}
            width={CHART_WIDTH} // from react-native
            height={CHART_HEIGHT}
            yAxisInterval={1} // optional, defaults to 1
            yAxisLabel="$"
            chartConfig={chartConfig}
            style={
                {
                    // marginVertical: 8,
                    // borderRadius: 16
                }
            }
            verticalLabelRotation={15}
            yLabelsOffset={0}
        />
    ) : null
}

export default memo(DataChart)
