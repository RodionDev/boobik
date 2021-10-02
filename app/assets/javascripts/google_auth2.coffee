	A helper class for use by JS that wishes to easily make use of Google
	sign in integration.
	Automatically attaches listeners and creates the auth2 instance.
	Copyright (c) Harry Felton 2017
class @GAuth2
	constructor: (signInListener, userListener, autoInit) ->
		@signInListener = signInListener if typeof signInListener is 'function'
		@userListener = userListener if typeof userListener is 'function'
		gapi.load( 'auth2', @init if autoInit )
	init: =>
		@auth = gapi.auth2.init {
			client_id: '1050814368819-l2v81ut67vi65016ced1mstv5j2uepou.apps.googleusercontent.com',
			scope: 'profile'
		}
		return console.error 'No auth instance. Platform failed to load. gapi-auth2' unless @auth
		@auth.isSignedIn.listen @signInListener if @signInListener
		@auth.currentUser.listen @userListener if @userListener
