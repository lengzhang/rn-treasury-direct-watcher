module.exports = {
    expo: {
        name: 'rn-treasury-direct-watcher',
        slug: 'rn-treasury-direct-watcher',
        version: '0.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff'
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#ffffff'
            }
        },
        web: {
            favicon: './assets/favicon.png'
        }
    }
}