    Controller specific coffeescript source (for LandingController).
    This file configures the splash screen animations as well as
    Google OAuth2 authentication integration (via GAuth2 class,
    available on window).
    Copyright (c) Harry Felton 2017
_replacePrompt = (animate) ->
signInChange = (isSignedIn) ->
    console.log "Signin state has changed. Is user signed in: #{isSignedIn}"
userChange = (user) ->
    console.log "Sign in user has changed. New user: #{user}"
auth = new GAuth2( signInChange, userChange, true )
@googleSignOut = ->
    auth.auth.signOut()
