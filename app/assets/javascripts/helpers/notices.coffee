    A basic class that handles the processing,
    and display of notices.
    Notices can be queued manually, however this
    class is usually called by embedded Javascript
    created automatically based on 'flash' messages
    passed from rails
    Copyright (c) Harry Felton 2017
class @Notices
    constructor: ->
        @notices = []
        $( document )
            .on 'mouseenter', 'div#flash-notices .notice', =>
                @showCurrent true
            .on 'mouseleave', 'div#flash-notices .notice', =>
                @showCurrent()
            .on "click", "div#flash-notices .notice #notice-close", (event) =>
                @hideCurrent()
        $( document ).on "turbolinks:load", =>
            @$noticeContainer = $ "#flash-notices"
            @$notice = @$noticeContainer.find ".notice" if @$noticeContainer
            @popCurrent() if @notices.length
            $( document ).trigger 'notices:ready', this
    queue: (notice, isAlert) ->
        @notices.push [ notice, isAlert ]
        @showCurrent()
    showCurrent: (noTimeout) ->
        return unless @notices.length
        $notice = @$notice
        $noticeContainer = @$noticeContainer
        return if $noticeContainer.attr( "data-no-interrupt" ) is 'true'
        clearTimeout( @timeout ) if @timeout
        @timeout = setTimeout( @hideCurrent, 3000 ) unless noTimeout
        $notice.find "p"
            .text @notices[ 0 ][ 0 ]
        $notice[ @notices[ 0 ][ 1 ] and 'addClass' or 'removeClass' ] 'alert'
        $noticeContainer.attr 'data-no-interrupt', 'true'
        $noticeContainer.stop( true ).animate( marginTop: -$noticeContainer.outerHeight(), 300 ).promise().done =>
            $noticeContainer.attr 'data-no-interrupt', 'false'
    hideCurrent: =>
        @$noticeContainer.attr 'data-no-interrupt', 'true'
        @$noticeContainer.stop( true ).animate( marginTop: 0, 300 ).promise().done =>
            @$noticeContainer.attr 'data-no-interrupt', 'false'
            @popCurrent()
    popCurrent: ->
        @notices.shift()
        @showCurrent()
$( document ).ready =>
    @notices = new Notices
