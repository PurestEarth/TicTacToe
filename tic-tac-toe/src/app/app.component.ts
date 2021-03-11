import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tic-tac-toe';
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  getDrawerIcon() {
    if (this.drawer) {
      return this.drawer.opened ? 'keyboard_arrow_right' : 'keyboard_arrow_left'
    } else {
      return 'keyboard_arrow_left'
    }

  }
}
