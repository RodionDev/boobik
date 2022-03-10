_missHandler = (event) ->
    $modal = $ 'nav #profile-modal'
    return unless $modal.attr( "data-open" ) is 'true'
    $button = $ "nav a#profile"
    if not ( $modal.is( event.target ) or $modal.has( event.target ).length or $button.is( event.target ) or $button.has( event.target ).length )
        closeProfileModal()
@openProfileModal = ->
    $ 'nav #profile-modal'
        .stop true
        .show()
        .attr 'data-open', 'true'
        .animate
            top: '55px'
            opacity: 1
        , 100
    $( document ).mouseup _missHandler
@closeProfileModal = ->
    $ 'nav #profile-modal'
        .stop true
        .attr "data-open", 'false'
        .animate
            top: '45px'
            opacity: 0
        , 100
        .promise().then ->
            this.hide()
    $( document ).unbind 'mouseup', _missHandler
@toggleProfileModal = ->
    $modal = $ 'nav #profile-modal'
    if ( $modal.attr "data-open" ) is 'true'
        closeProfileModal()
    else
        openProfileModal()
$( document ).on "click", "nav a#profile", (event) ->
    event.preventDefault()
    toggleProfileModal()
