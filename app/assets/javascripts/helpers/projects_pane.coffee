console.warn "DEPRECATION WARNING: This file (helpers/projects_pane.coffee) has been deprecated. It will be removed in the future, migrate code to new CoffeeScript"
class @ProjectsPane
    errorState: false
    isLoading: false
    constructor: ->
        $( "a.new-project" ).on "click", (event) =>
            do @spawnPlaceholder
            window.location.hash = "!create"
            event.preventDefault()
        placeholder = ".column#projects .wrapper .panel#projects .project.placeholder"
        $ "body"
            .on "click", "#{placeholder} .placeholder-close:not(.disabled)", (event) =>
                do @removePlaceholder
            .on "click", "#{placeholder} #new-help", (event) =>
                do @revealPlaceholderHelp
            .on "click", "#{placeholder} #close-help", (event) =>
                do @hidePlaceholderHelp
            .on "click", "#{placeholder} .placeholder-save:not(.loading)", (event) =>
                do @pushPlaceholder
    refresh: ->
        $wrapper = $ ".column#projects .wrapper"
        $panel = $wrapper.find ".panel#projects"
        projectCount = $panel.find(".project:not(.hidden):not(.hiding)").length
        $wrapper.find ".notice"
            .fadeOut 250
        if @isLoading
            @hidePanel ->
                $wrapper.find ".notice.loading"
                    .fadeIn 250
        else if projectCount and not $panel.hasClass "open"
            do @showPanel
        else if not projectCount and $panel.hasClass "open"
            @hidePanel ->
                $wrapper.find ".notice#no-projects"
                    .fadeIn 250
        setTimeout ->
            $panel.find ".hiding"
                .addClass "hidden"
                .removeClass "hiding"
        , 250
    hidePanel: (done) ->
        $panel = $ ".column#projects .wrapper .panel#projects"
        $panel
            .stop true
            .animate
                marginTop: '50px',
                opacity: 0
            , 150
            .promise().done ->
                $panel.hide().removeClass "open"
                do done if done
    showPanel: ->
        $ ".column#projects .wrapper .panel#projects"
            .stop true
            .addClass "open"
            .show().css
                opacity: 0,
                marginTop: "50px"
            .animate
                marginTop: 0,
                opacity: 1
            , 250
    spawnPlaceholder: ->
        $panel = $ ".column#projects .wrapper .panel#projects"
        return console.debug "Ignoring request to spawn placeholder; placeholder already visible inside panel!" if $panel.find(".project.placeholder:visible").length
        if $panel.find(".project:not(.placeholder):not(.hidden)").length
        else
            $panel.find ".placeholder"
                .removeClass "hidden"
        setTimeout ->
            $panel.find ".placeholder form input:visible:first"
                .focus()
        , 250
        do @refresh
    pushPlaceholder: ->
        $placeholder = $ ".column#projects .wrapper .panel#projects .project.placeholder"
        data = $placeholder.find("form").serialize()
        $placeholder.find "input, textarea"
            .attr "disabled", true
        $placeholder.find ".button.placeholder-save"
            .addClass "loading inplace"
        $placeholder.find ".button.placeholder-close"
            .addClass "disabled"
        $.ajax
            url: '/projects'
            dataType: 'json'
            method: 'POST'
            data: data
            complete: (event) =>
                console.log "complete"
                $placeholder.find "input, textarea"
                    .attr "disabled", false
                $placeholder.find ".button.placeholder-save"
                    .removeClass "loading inplace"
                $placeholder.find ".button.placeholder-close"
                    .removeClass "disabled"
            success: (payload, state, xhr) =>
                console.log "SUCCESS"
                console.log payload
                console.log state
                notices.queue "Created project!"
                do @removePlaceholder
            error: (xhr, state, display) =>
                console.error "Ajax error while pushing new project. #{state}, #{display}. XHR dump follows"
                console.debug xhr
                response = xhr.responseJSON
                notices.queue( "Unable to create new project: #{response and response.error or display} (#{xhr.status})", true )
    removePlaceholder: ->
        window.location.hash = ""
        $panel = $ ".column#projects .wrapper .panel#projects"
        if $panel.find(".project:not(.placeholder):not(.hidden)").length
        else
            $panel.find ".project.placeholder"
                .addClass "hiding"
        do @refresh
    fetchProjects: (completeCallback, successCallback, errorCallback, insertionCallback) ->
        $.ajax
            url: '/projects'
            dataType: 'json'
            method: 'GET'
            complete: (event) =>
            success: (payload, state, xhr) =>
                $panel = $ "<div class='panel' id='projects'></div>"
            error: (xhr, state, display) =>
    revealPlaceholderHelp: ->
        $placeholder = $ ".column#projects .wrapper .panel#projects .project.placeholder"
        if $placeholder.length
            $placeholder.find ".help-content"
                .stop true
                .show()
                .css
                    opacity: 0,
                    marginTop: "50px"
                .addClass "shown"
                .animate
                    opacity: 1,
                    marginTop: 0
                , 150
    hidePlaceholderHelp: ->
        $placeholder = $ ".column#projects .wrapper .panel#projects .project.placeholder"
        if $placeholder.length
            $help_content = $placeholder.find ".help-content"
            if $help_content.hasClass "shown"
                $help_content
                    .stop true
                    .animate
                        opacity: 0
                        marginTop: "55px"
                    , 150
                    .promise().done ->
                        $help_content
                            .hide()
                            .removeClass "shown"
