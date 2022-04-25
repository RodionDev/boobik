class @ActivityPane
    recentMode: true
    errorState: false
    cache:
        total: 0
        loaded: 0
        offset: 0
        isLoading: false
    constructor: ->
        delegatedTarget = ".column#notifications .wrapper .notification-dismiss"
        self = this
        $ "body"
            .on "click", delegatedTarget, (event) ->
                if $( this ).hasClass "removing"
                    console.warn "This notification is already being removed!"
                    event.stopPropagation()
                    event.preventDefault()
                    false
                $( this ).addClass "removing"
            .on "click", ".column#notifications .wrapper .notice #view-older", (event) =>
                event.preventDefault()
                @recentMode = false
                do @loadMore
            .on "ajax:success", delegatedTarget, (event, data, status, xhr) ->
                $( event.target ).parents ".notification"
                    .animate
                        marginLeft: '100%',
                        opacity: 0
                    , 200
                    .promise().done ->
                        $( this ).slideUp( 100 ).promise().done ->
                            $( this ).remove()
                            self.cache.loaded -= 1
                            self.cache.total -= 1
                            do self.updatePane
            .on "ajax:error", delegatedTarget, (event, xhr, status, error) ->
                console.error "FAILED to destroy notification (#{error}, #{status})"
                $( event.target ).removeClass "removing"
        notifWrapper = $ ".column#notifications > .wrapper"
        notifPanel = notifWrapper.find ".panel#notifs"
        notifWrapper.on "scroll", (event) =>
            return if @cache.loaded is @cache.total
            if ( notifPanel.innerHeight() - notifWrapper.scrollTop() ) <= ( notifWrapper.innerHeight() + 10 )
                @recentMode = false
                do @loadMore
        do @loadMore
    updatePane: ->
        $ ".column#notifications .wrapper .loading, .column#notifications .wrapper .notice"
            .fadeOut( 250 )
        if @errorState
            $ ".column#notifications .wrapper .notice.error#failure"
                .stop( true ).fadeIn( 250 )
                .find( "pre#error" ).text( @errorState )
        else if @recentMode
            if @cache.total > 0 and @cache.loaded is 0
                $ ".column#notifications .wrapper .notice#no-recent"
                    .stop( true ).fadeIn( 250 )
            else if @cache.total is 0
                $ ".column#notifications .wrapper .notice#no-activity"
                    .stop( true ).fadeIn( 250 )
        $panel = $ ".column#notifications .wrapper .panel#notifs"
        if @cache.loaded > 0 and not $panel.hasClass "open"
            $panel
                .stop( true )
                .addClass "open"
                .show().css( "opacity", 0 )
                .animate
                    marginTop: 0,
                    opacity: 1
                , 250
        else if @cache.loaded is 0 and $panel.hasClass "open"
            $panel
                .stop( true )
                .animate
                    marginTop: '50%',
                    opacity: 0
                , 250
                .promise().done ->
                    $panel.hide().removeClass "open"
    loadMore: ->
        return if @cache.isLoading
        @cache.isLoading = true
        $.ajax
            url: "/notifications" + ( @recentMode and "/recent" or "" ) + "?limit=10&offset=" + @cache.offset
            complete: (event) =>
                do @updatePane
                setTimeout =>
                    @cache.isLoading = false
                , 1000
            success: (payload, state, xhr) =>
                @cache.total = payload.total_notifications
                @cache.loaded += payload.amount_provided
                @cache.offset += payload.amount_provided
                target = $ ".column#notifications .wrapper .panel#notifs"
                payload.payload.forEach (item) ->
                    $ """<div class="notification">
                        <div class="wrapper">
                            <div class="details">
                                <h3 class="title">"""+item.title+"""</h3>
                                <p class="body">"""+item.body+"""</p>
                            </div>
                            <a href="/notifications/"""+item.id+"""" data-remote="true" data-method="delete" class="notification-dismiss">&#10006;</a>
                        </div>
                    </div>"""
                    .appendTo( target )
            error: (xhr, state, display) =>
                console.error "Ajax error while loading more activity. #{state}, #{display}. XHR dump follows"
                console.debug xhr
                @errorState = "#{display} (#{xhr.status})"
