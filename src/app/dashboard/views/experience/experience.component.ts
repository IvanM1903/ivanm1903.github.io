import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

  listItemSelected: string = 'deimos';

  constructor() { }

  ngOnInit(): void {
  }

  onClickListEvent(event: any) {
    const id = event.srcElement.id;
    const element = event.target;

    switch (id) {
      case 'accenture':
        if (element.classList.contains('list-item-clicked')) {
          /* event.target.classList.remove('list-item-clicked');
          this.listItemSelected = ''; */
        } else {
          event.target.classList.add('list-item-clicked');
          //remove all classes from other elements
          document.getElementById('deimos')?.classList.remove('list-item-clicked');
          this.listItemSelected = id;
        }
        break;
      case 'deimos':
        if (element.classList.contains('list-item-clicked')) {
          /* event.target.classList.remove('list-item-clicked');
          this.listItemSelected = ''; */
        } else {
          event.target.classList.add('list-item-clicked');
          //remove all classes from other elements
          document.getElementById('accenture')?.classList.remove('list-item-clicked');
          this.listItemSelected = id;        }
        break;
      default:
        break;
    }


  }

}
