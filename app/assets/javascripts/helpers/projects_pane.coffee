class @ProjectsPane
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
        if projectCount and not $panel.hasClass "open"
            $panel
                .stop true
                .addClass "open"
                .show().css
                    opacity: 0,
                    marginTop: "50px"
                .animate
                    marginTop: 0,
                    opacity: 1
                , 250
        else if not projectCount and $panel.hasClass "open"
            $panel
                .stop true
                .animate
                    marginTop: '50px',
                    opacity: 0
                , 150
                .promise().done ->
                    $panel.hide().removeClass "open"
                    $wrapper.find ".notice#no-projects"
                        .fadeIn 250
        setTimeout ->
            $panel.find ".hiding"
                .addClass "hidden"
                .removeClass "hiding"
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
        $placeholder.find "input, textarea"
            .attr "disabled", true
        $placeholder.find ".button.placeholder-save"
            .addClass "loading inplace"
        $placeholder.find ".button.placeholder-close"
            .addClass "disabled"
    removePlaceholder: ->
        window.location.hash = ""
        $panel = $ ".column#projects .wrapper .panel#projects"
        if $panel.find(".project:not(.placeholder):not(.hidden)").length
        else
            $panel.find ".project.placeholder"
                .addClass "hiding"
        do @refresh
    fetchProjects: (completeCallback, successCallback, errorCallback, insertionCallback) ->
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
