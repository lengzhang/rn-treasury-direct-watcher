import { Button, ButtonGroup, ButtonText } from '@gluestack-ui/themed'
import { memo } from 'react'

import { useSettingContext } from '@/contexts/SettingContext'

const BUTTON_ITEMS = ['Light', 'Auto', 'Dark'].map((label) => ({ key: label.toLowerCase(), label }))

const ColorModeButtonGroup = () => {
    const { colorMode, setColorMode } = useSettingContext()

    const onPressButton = (key: string) => () => {
        const selectedColorMode = key === 'light' ? 'light' : key === 'dark' ? 'dark' : undefined

        setColorMode(selectedColorMode)
    }

    return (
        <ButtonGroup isAttached size="xs">
            {BUTTON_ITEMS.map(({ key, label }) => {
                const isSelected = (colorMode || 'auto') === key
                return (
                    <Button
                        key={label}
                        action={isSelected ? 'primary' : 'secondary'}
                        disabled={isSelected}
                        onPress={onPressButton(key)}>
                        <ButtonText>{label}</ButtonText>
                    </Button>
                )
            })}
        </ButtonGroup>
    )
}

export default memo(ColorModeButtonGroup)
