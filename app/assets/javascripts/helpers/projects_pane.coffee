class @ProjectsPane
    constructor: ->
        $( "a.new-project" ).on "click", (event) =>
            do @spawnPlaceholder
            window.location.hash = "!create"
            event.preventDefault()
        placeholder = ".column#projects .wrapper .panel#projects .project.placeholder"
        $ "body"
            .on "click", "#{placeholder} .placeholder-close", (event) =>
                do @removePlaceholder
            .on "click", "#{placeholder} #new-help", (event) =>
                do @revealPlaceholderHelp
            .on "click", "#{placeholder} #close-help", (event) =>
                do @hidePlaceholderHelp
            .on "click", "#{placeholder} .placeholder-save", (event) =>
                do @pushPlaceholder
    refresh: ->
        $wrapper = $ ".column#projects .wrapper"
        $panel = $wrapper.find ".panel#projects"
        projectCount = $panel.find(".project:not(.closing)").length
        $wrapper.find ".notice, .loading"
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
                , 250
                .promise().done ->
                    $panel.hide().removeClass "open"
                    $wrapper.find ".notice#no-projects"
                        .fadeIn 250
        setTimeout ->
            $panel.find ".closing"
                .remove()
        , 250
    spawnPlaceholder: ->
        $panel = $ ".column#projects .wrapper .panel#projects"
        return console.debug "Ignoring request to spawn placeholder; placeholder already found inside panel!" if $panel.find(".project.placeholder").length
        $placeholder = $ """
            <div class="project placeholder">
                <div class="help-content">
                    <a href="#" id="close-help" class="top-right-nav">&#10006;</a>
                    <h2 class="title">You needed help?</h2>
                    <span>Don't worry, we're here to help!</span>
                    <h3 class="sub">Cannot submit</h3>
                    <p>We work hard to fight against technical problems, but sometimes a couple squeeze by. If you're experiencing issues, please try <a href="#">clearing your cache</a>. Still doesn't work? Try again in a little while before <a href="#">contacting us</a>.</p>
                    <h3 class="sub">Re-Captcha Code</h3>
                    <p>For most users, captcha codes won't appear when creating a project; however if our system detects unusual activity we may prompt you to confirm you're not human.</p>
                    <h3 class="sub">Other problems</h3>
                    <p>Experiencing other issues with our form? No worries. Use the <a href="projects/new">older version</a> instead</p>
                </div>
                <div class="content">
                    <form>
                        <a href="#" id="new-help" class="top-right-nav">Help</a>
                        <h2 class="title">New project</h2>
                        <span class="about">A project is where you'll plan your videos, upload your assets, and render your videos. Creating a project is free and easy, so why wait?</span>
                        <h3 class="sub">Name</h3>
                        <input type="text" placeholder="Lorem ipsum">
                        <h3 class="sub">Description</h3>
                        <textarea name="desc" cols="20" rows="5" placeholder="An optional description of your project"></textarea>
                        <div class="footer">
                            <span>I agree to this websites <a href="/terms">terms of service</a></span>
                            <input type="checkbox">
                            <div class="right">
                                <a href="#" class="button sub placeholder-close">Cancel</a>
                                <a href="#" class="button placeholder-save">Create project</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        """
        $placeholder.prependTo $panel
        do @refresh
    pushPlaceholder: ->
    removePlaceholder: ->
        window.location.hash = ""
        $ ".column#projects .wrapper .panel#projects .project.placeholder"
            .addClass "closing"
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
