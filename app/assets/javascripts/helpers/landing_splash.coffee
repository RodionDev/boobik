    A coffeescript 'partial', abstracting away the splash screen
    animations.
    This helper handles the GAuth2 authentication wrapping,
    dashboard connection, and more.
    Copyright (c) Harry Felton 2017
class @SplashHelper
    constructor: ->
        @authHelper = new GAuth2(
            (state) =>
                @refreshGoogleIntegration state, @signedInUser
            (user) =>
                @refreshGoogleIntegration @isSignedIn, user
            true )
        $( document ).ready =>
            do $ '#swapper-loader'
                .show
            $ '#learn-more'
                .on 'click', (event) =>
                    event.preventDefault()
                    event.stopPropagation()
                    do @revealMore
    refreshGoogleIntegration: (state, user) ->
        return console.error "Cannot refresh Google integration on splash screen -- no auth instance found" unless @authHelper
        if ( state is @isSignedIn ) and ( @signedInUser and user and user.getId() is @signedInUser.getId() and @signedInUser.getId()? )
            return
        @isSignedIn = state unless typeof state is 'undefined'
        @signedInUser = user unless typeof user is 'undefined'
        swapper = $ '#splash .wrapper#main #secondary #swapper'
        swapper.animate opacity: 0, 150
        setTimeout =>
            swapper.find '#dashboard'
                .css 'display', @isSignedIn and "inline-block" or "none"
            swapper.find '#google'
                .css 'display', @isSignedIn and "none" or "inline-block"
            swapper.find '#get-started'
                .text @isSignedIn and "Welcome back, #{@signedInUser.getBasicProfile().getGivenName()}!" or "Ready to get started?"
            swapper.animate opacity: 1, 150
            $ '#swapper-loader'
                .fadeOut 150
                    .promise().then ->
                        @hide()
        , 150
    revealMore: ->
        alert "This feature is not yet implemented (NYI). It will be implemented once full-development is given the green light."
    concealMore: ->
