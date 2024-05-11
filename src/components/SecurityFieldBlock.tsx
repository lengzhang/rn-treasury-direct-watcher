import { Text, Box, Heading } from '@gluestack-ui/themed'
import { ComponentProps, FC } from 'react'

interface SecurityFieldBlockProps extends ComponentProps<typeof Box> {
    label: string
    value?: string
    color?: string
    disableSub?: boolean
    headerProps?: ComponentProps<typeof Heading>
}

const SecurityFieldBlock: FC<SecurityFieldBlockProps> = ({
    label,
    value,
    color,
    disableSub = false,
    headerProps = {},
    ...boxProps
}) => {
    const textProps: ComponentProps<typeof Text> = color ? { color } : {}

    return (
        <Box {...boxProps}>
            <Heading sub={!disableSub} numberOfLines={1} {...headerProps}>
                {label}
            </Heading>
            <Text {...textProps} numberOfLines={1} ellipsizeMode="clip">
                {value || ' '}
            </Text>
        </Box>
    )
}

export default SecurityFieldBlock
