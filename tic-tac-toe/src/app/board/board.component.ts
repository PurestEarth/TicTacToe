import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../_services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() boardSize: string | undefined;
  gameId: string | undefined;
  wonMessage: string | undefined;
  tiles = new Array(100);
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    if (this.boardSize) {
      this.initBoard()
    }
  }

  initBoard() {
    this.tiles = []
    for(let i=0; i<Number(this.boardSize)*Number(this.boardSize); i++) {
      // Load previous session if needed
      this.tiles.push({checked: false})
    }
  }

  startGame() {
    this.gameService.startGame(0, this.tiles).subscribe( gameState => {
      this.wonMessage = undefined;
      this.gameId = gameState._id;
    })
  }

  checkTile(i: number) {
    if (!this.tiles[i].checked && this.gameId) {
      this.gameService.makeMove(this.gameId, i).subscribe( res => {
        console.log('Move made')
        if (res == 200) {
          this.tiles[i].checked = true;
          this.tiles[i].mark = 'X';
          if(i > 0) {
            this.tiles[i-1].checked = true;
            this.tiles[i-1].mark = 'O';
          }
        }
        else if (res==201) {
          this.gameId = undefined;
          this.wonMessage = "You won the game"
          this.initBoard()
        } else if (res == 202) {
          this.gameId = undefined;
          this.wonMessage = "AI won the game"
          this.initBoard()
        }

      } )
      // round end

    }
  }

  getTileClass(isChecked: boolean) {
    return isChecked ? 'checked' : 'unchecked'
  }

}
