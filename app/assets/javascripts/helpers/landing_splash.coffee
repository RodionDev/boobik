class @SplashHelper
    constructor: ->
        console.warn("[DEPRECATION NOTICE] landing_splash.coffee is deprecated. Please see issue #1 at GitLab.com/hbomb79/bikboo/issues/1 for more information.")
        $( document ).ready =>
            $ '#learn-more'
                .on 'click', (event) =>
                    event.preventDefault()
                    event.stopPropagation()
                    do @revealMore
    revealMore: ->
        alert "This feature is not yet implemented (NYI). It will be implemented once full-development is given the green light."
    concealMore: ->
