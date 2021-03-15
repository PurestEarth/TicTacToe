import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() boardSize: string | undefined;
  tiles = new Array(100);
  constructor() { }

  ngOnInit(): void {
    if (this.boardSize) {
      this.tiles = []
      for(let i=0; i<Number(this.boardSize)*Number(this.boardSize); i++) {
        // Load previous session if needed
        this.tiles.push({checked: false})
      }
    }
  }

  checkTile(i: number) {
    if (!this.tiles[i].checked) {
      // round end
      this.tiles[i].checked = true;
      this.tiles[i].mark = 'X';
    }
  }

  getTileClass(isChecked: boolean) {
    return isChecked ? 'checked' : 'unchecked'
  }

}
