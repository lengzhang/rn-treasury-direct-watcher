module.exports = {
    expo: {
        name: process.env.APP_ENV ? `TD Watcher (${process.env.APP_ENV})` : 'TD Watcher',
        description:
            'This application provides visibility to client for Treasury Direct securities.',
        slug: 'treasury-direct-watcher',
        version: '1.0.0',
        githubUrl: 'https://github.com/lengzhang/rn-treasury-direct-watcher',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'automatic',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'cover',
            backgroundColor: '#00000'
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
            bundleIdentifier:
                process.env.APP_ENV === 'development'
                    ? 'com.lengzhang.treasury-direct-watcher-dev'
                    : process.env.APP_ENV === 'preview'
                      ? 'com.lengzhang.treasury-direct-watcher-pre'
                      : 'com.lengzhang.treasury-direct-watcher'
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#00000'
            }
        },
        web: {
            favicon: './assets/favicon.png'
        },
        extra: {
            eas: {
                projectId: 'eff24fc7-5a1f-435d-88a1-5722852d7131'
            }
        },
        updates: {
            url: 'https://u.expo.dev/eff24fc7-5a1f-435d-88a1-5722852d7131'
        },
        runtimeVersion: {
            policy: 'appVersion'
        }
    }
}
