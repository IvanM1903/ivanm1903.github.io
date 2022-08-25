import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjectContentEnum } from 'src/app/dashboard/views/projects/utils/project-content.enum'
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  public PCE = ProjectContentEnum;
  public modalCardTitle = '';
  public modalCardText = '';
  public modalCardRoute = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  openModalCard(title: string, text: string) {
    this.modalCardTitle = title;
    this.modalCardText = text;
    
    document.getElementById("openCardCarouselModal")?.click();
  }
}
