_missHandler = (event) ->
    $modal = $ 'nav #profile-modal'
    return unless $modal.attr( "data-open" ) is 'true'
    $button = $ "nav a#profile"
    if not ( $modal.is( event.target ) or $modal.has( event.target ).length or $button.is( event.target ) or $button.has( event.target ).length )
        closeProfileModal()
@openProfileModal = ->
    $ 'nav #profile-modal'
        .stop true
        .fadeIn 100
        .attr 'data-open', 'true'
    $( document ).mouseup _missHandler
@closeProfileModal = ->
    $ 'nav #profile-modal'
        .stop true
        .fadeOut 100
        .attr "data-open", 'false'
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
