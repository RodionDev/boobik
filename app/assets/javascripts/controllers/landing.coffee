signInChange = (isSignedIn) ->
    console.log "Signin state has changed. Is user signed in: #{isSignedIn}"
userChange = (user) ->
    console.log "Sign in user has changed. New user: #{user}"
auth = new GAuth2( signInChange, userChange, true )
@googleSignOut = ->
    auth.auth.signOut()
