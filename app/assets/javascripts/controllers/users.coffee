_checkRecentActivity = (event) ->
    $(".column#notifications .wrapper .notice").fadeIn() unless $( ".column#notifications .wrapper .notification" ).length
_probeUserActivity = (event) ->
    console.debug 'NYI'
$( document ).ready ->
    delegatedTarget = ".column#notifications .wrapper .notification-dismiss"
    do _checkRecentActivity
    $ "body"
        .on "click", delegatedTarget, (event) ->
            if $( this ).hasClass "removing"
                console.warn "This notification is already being removed!"
                event.stopPropagation()
                event.preventDefault()
                return false
            $( this ).addClass "removing"
        .on "ajax:success", delegatedTarget, (event, data, status, xhr) ->
            $( event.target ).parents ".notification"
                .animate
                    marginLeft: '100%',
                    opacity: 0
                , 200
                .promise().done ->
                    $( this ).slideUp( 100 ).promise().done ->
                        $( this ).remove()
                        do _checkRecentActivity
        .on "ajax:error", delegatedTarget, (event, xhr, status, error) ->
            console.error "FAILED to destroy notification"
            alert "Unable to destroy notification. Please try again later."
            $( event.target ).removeClass "removing"
        .on "ajax:complete", delegatedTarget, (event) ->
            console.debug "NYI"
