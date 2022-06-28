import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  prevScrollpos = window.pageYOffset;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    const currentScrollPos = window.pageYOffset;
    const navbar = document.getElementById("navbar");

    if (this.prevScrollpos > currentScrollPos) {
      if (navbar) {
        navbar.style.top = "0";
      }
    } else {
      if (navbar) {
        navbar.style.top = "-50px";
      }
    }
    this.prevScrollpos = currentScrollPos;
  }
}

