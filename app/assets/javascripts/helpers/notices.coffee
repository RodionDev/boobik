class @Notices
    constructor: (notices=[]) ->
        @notices = notices
        @$noticeContainer = $ "#flash-notices"
        @$notice = @$noticeContainer.find ".notice" if @$noticeContainer
        $ 'div#flash-notices .notice'
            .hover =>
                @showCurrent true
            , =>
                @showCurrent()
        $ 'body'
            .on "click", "div#flash-notices .notice #notice-close", (event) =>
                @hideCurrent()
        do @showCurrent if @notices.length
    queue: (notice, isAlert) ->
        @notices.push [ notice, isAlert and 'alert' or 'notice' ]
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
        $notice[ @notices[ 0 ][ 1 ] is 'alert' and 'addClass' or 'removeClass' ] 'alert'
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
