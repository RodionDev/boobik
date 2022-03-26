$( document ).ready ->
    delegatedTarget = ".column#notifications .wrapper .notification-dismiss"
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
                .slideUp( 300 ).promise().done ->
                    $( this ).remove()
        .on "ajax:error", delegatedTarget, (event, xhr, status, error) ->
            console.error "FAILED to destroy notification"
            alert "Unable to destroy notification. Please try again later."
            $( event.target ).removeClass "removing"
        .on "ajax:complete", delegatedTarget, (event) ->
            do _checkRecentActivity
            console.debug "NYI"
