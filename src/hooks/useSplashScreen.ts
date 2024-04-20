import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const useSplashScreen = (isReady: boolean) => {
    const [isHide, setIsHide] = useState(false)

    useEffect(() => {
        if (isReady && !isHide) {
            hideSplashScreen()
        }
    }, [isReady, isHide])

    async function hideSplashScreen() {
        setTimeout(async () => {
            setIsHide(true)
            await SplashScreen.hideAsync()
        }, 1000)
    }
}

export default useSplashScreen
