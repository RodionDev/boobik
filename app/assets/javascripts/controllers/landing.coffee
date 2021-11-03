    Controller specific coffeescript source (for LandingController).
    This file configures the splash screen animations as well as
    Google OAuth2 authentication integration (via GAuth2 class,
    available on window).
    Copyright (c) Harry Felton 2017
@googleHook = ->
    @splash = new SplashHelper
    @googleSignOut = ->
        return console.error "Cannot sign out Google user. Authentication wrapper is unavailable (perhaps the Google API failed to load)." unless typeof @splash.authHelper.auth.signOut is 'function'
        @splash.authHelper.auth.signOut()
