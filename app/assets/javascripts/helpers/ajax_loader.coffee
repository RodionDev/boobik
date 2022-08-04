class @AjaxLoader
    refreshingInterval: false
    loadingTitles:
        index: 'Fetching projects...'
        show: 'Gathering project details...'
    target:
        url: false
        type: 'unknown'
    constructor: ->
        do @refreshTargetURL
        @updateLoadingPreset true
        window.addEventListener 'load', @loadContent.call @ , false
    refreshTargetURL: ->
        path = window.location.pathname
        if /dashboard\/project\/(\d+)/i.test path
            @target.url = '/api/project/' + (/dashboard\/project\/(\d+)/g.exec path)[1]
            @target.type = 'show'
        else if path.match /dashboard\/?$/i
            @target.url = "/api/projects"
            @target.type = 'index'
        else
            console.error "[FATAL] Unable to load page, unable to map URL to valid RESTful endpoint! Check URL and try again."
            @target.url = "/api/projects"
            @target.type = 'index'
    updateDOMFromPayload: (payload, meta='') ->
        $("[data-ajax-meta='#{meta}']").each ->
            scopedPayload = if $(this).attr "data-ajax-scope" then payload[ $(this).attr "data-ajax-scope" ] else payload
            match = ( $(this).attr( "data-ajax-attr-pair" ) or "" ).match /([^,\s]+)/g
            if match
                match.forEach (pair) =>
                    sides = pair.match /[^:]+/g
                    if sides.length is 1
                        $(this).html( scopedPayload[ sides[ 0 ] ] )
                    else if sides.length is 2
                        $(this).attr( sides[0], scopedPayload[ sides[ 1 ] ] )
                    else
                        console.warn("Malformed data-ajax-attr-pair, pair #{pair} is invalid on element #{this}")
    updateLoadingPreset: (initial) ->
        if initial
            $("section.page-viewer .content .loading").html( $(".loading-types ##{@target.type}").html() )
            @updateDOMFromPayload( section_title: @loadingTitles[@target.type] )
        else
    refreshData: ->
        $.ajax
            url: "#{@target.url}/metadata"
            method: 'get'
            dataType: 'text'
            error: (xhr, state, display) =>
                console.error "[FATAL] AJAX request to load project metadata failed! #{state}, #{display}. XHR dump follows"
                console.debug xhr
                clearInterval @refreshingInterval
            success: (scriptText, xhr) =>
                eval( scriptText )( this )
    loadContent: ->
        clearInterval @refreshingInterval
        return console.warn "Unable to load content, no target URL available on ajaxLoader" unless @target.url
        $.ajax
            url: @target.url
            method: 'get'
            dataType: 'json'
            error: (xhr, state, display) =>
                console.error "[FATAL] AJAX request to load project fragments failed! #{state}, #{display}. XHR dump follows"
                console.debug xhr
            success: (payload) =>
                updateScript = eval( payload.update_script )
                $("main section.page-viewer, .ajax-insert").stop( true ).fadeOut( 250 )
                setTimeout =>
                    @updateDOMFromPayload( payload )
                    updateScript( payload.content )
                    $("main section.page-viewer").attr( "id", payload.section_id ).stop( true ).fadeIn( 150 )
                    $(".ajax-insert").stop( true ).fadeIn( 150 )
                    do @startDataRefresh
                , 150
    reloadContent: ->
        clearInterval @refreshingInterval
        $ "section#projects .content .projects"
            .fadeOut( 250 ).promise().done =>
                $ "section#projects .content .loading"
                    .fadeIn( 150 ).promise().done =>
                        do @loadContent
                        notices.queue "A change in your projects was detected, we've reloaded your dashboard automatically to reflect the new changes"
    startDataRefresh: ->
        clearInterval @refreshingInterval
        @refreshingInterval = setInterval =>
            do @refreshData
        , 60000
