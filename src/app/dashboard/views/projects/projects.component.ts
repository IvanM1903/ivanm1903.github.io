import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjectContentEnum } from 'src/app/dashboard/views/projects/utils/project-content.enum'
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  public PCE = ProjectContentEnum;

  constructor() {
  }

  ngOnInit(): void {
  }

}
