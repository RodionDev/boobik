    A coffeescript 'partial', abstracting away the splash screen
    animations.
    Copyright (c) Harry Felton 2017
class @SplashHelper
    constructor: ->
        $( document ).ready =>
            $ '#learn-more'
                .on 'click', (event) =>
                    event.preventDefault()
                    event.stopPropagation()
                    do @revealMore
    revealMore: ->
        alert "This feature is not yet implemented (NYI). It will be implemented once full-development is given the green light."
    concealMore: ->
