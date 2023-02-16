$( window ).load ->
    setTimeout ->
        unless $( window.location.hash ).length
            $ 'html, body'
                .scrollTop( 0 )
        else
            scrollToTarget( window.location.hash )
    , 10
