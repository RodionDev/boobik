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
            rejectFurther = true
        .on "ajax:success", (event, data, status, xhr) ->
            $( event.target ).parents ".notification"
                .slideUp( 300 ).promise().done ->
                    $( this ).remove()
        .on "ajax:error", (event, xhr, status, error) ->
            console.error "FAILED to destroy notification"
