console.warn("[DEPRECATION NOTICE] scroller.coffee has been deprecated. Please see issue #1 at GitLab.com/hbomb79/bikboo/issues/1 for more information.")
@scrollToTarget = (target, time) ->
    return console.error "Unable to scroll to target #{target}. Target
        doesn't exist in DOM -- refactor query and retry
        (must be a jQuery string)" unless $( target ).length
    $ "html, body"
        .animate
            scrollTop: $( target ).offset().top or 0
            time or 750
$( document ).on "click", "a[data-scroll]", ( event ) ->
    do event.preventDefault if event
    scrollToTarget $( this ).attr("data-scroll"), Number $( this ).attr( "data-scroll-time" )
