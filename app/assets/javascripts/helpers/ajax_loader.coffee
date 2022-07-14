class @AjaxLoader
    refreshingInterval: false
    constructor: ->
        do @loadContent
    startDataRefresh: ->
        clearInterval @refreshingInterval
        @refreshingInterval = setInterval =>
            $.ajax
                url: 'api/projects/metadata'
                method: 'get'
                dataType: 'json'
                error: (xhr, state, display) =>
                    console.error "[FATAL] AJAX request to load project metadata failed! #{state}, #{display}. XHR dump follows"
                    console.debug xhr
                    clearInterval @refreshingInterval
                success: (xhr) =>
                    return @reloadContent() if xhr.project_count != $("section#projects .project-list .content .project").length
                    $.each xhr.projects, (id, val) =>
                        project = $ "section#projects .project-list .content .project[data-id=#{id}]"
                        if ( val.raw != project.attr "data-updated-at" ) or not project.length
                            do @reloadContent
                            return false
                        project.find ".time"
                            .html( val.formatted )
        , 60000
    hookContent: ($content) ->
        $content
            .stop( true )
            .fadeIn( 500 )
            .find( ".project" )
            .css("margin-top", "5rem")
            .each (i) ->
                setTimeout =>
                    $( this ).animate
                        marginTop: "1rem"
                    , 250
                , Math.min( 50 * i, 2000 )
    loadContent: ->
        clearInterval @refreshingInterval
        $.ajax
            url: 'api/projects?hook=ajaxLoader.hookContent'
            method: 'get'
            dataType: 'script'
            error: (xhr, state, display) =>
                console.error "[FATAL] AJAX request to load project fragments failed! #{state}, #{display}. XHR dump follows"
                console.debug xhr
            success: =>
                do @startDataRefresh
    reloadContent: ->
        clearInterval @refreshingInterval
        $ "section#projects .project-list .content"
            .fadeOut( 250 ).promise().done =>
                $ "section#projects .project-list .loading"
                    .fadeIn( 150 ).promise().done =>
                        do @loadContent
                        notices.queue "A change in your projects was detected, we've reloaded your dashboard automatically to reflect the new changes"
