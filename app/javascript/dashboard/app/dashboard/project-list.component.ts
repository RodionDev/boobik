import { Component, OnInit } from '@angular/core'
@Component({
    selector: 'app-project-list',
    template: `
    <section id="projects">
        <h2 class="section-title">Spinning up</h2>
        <div class="content">
            <div class="loading">
                <div class="project placeholder">
                    <div class="line title" style="width: 40%;"></div>
                    <div class="line" style="width: 70%;"></div>
                    <div class="line" style="width: 60%;"></div>
                    <div class="line last-edit" style="width: 15%;"></div>
                </div>
                <div class="project placeholder">
                    <div class="line title" style="width: 60%;"></div>
                    <div class="line" style="width: 70%;"></div>
                    <div class="line" style="width: 40%;"></div>
                    <div class="line last-edit" style="width: 15%;"></div>
                </div>
            </div>
            <div class="projects"></div>
        </div>
    </section>
    `
})
export class ProjectListComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
