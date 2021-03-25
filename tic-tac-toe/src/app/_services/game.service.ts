import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GameState } from '../_models/GameState';
import { Tile } from '../_models/Tile';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  baseUrl = environment.apiUrl + 'game/';
  constructor( private http: HttpClient ) { }

  makeMove(id: string, i: number): Observable<number> {
    return this.http.get<number>(this.baseUrl + `makeMove/${id}/${i}`);
  }


  startGame(player: number, board: any[]): Observable<GameState> {
    return this.http.post<GameState>(this.baseUrl, {"gameState": {player, board}});
  }

}
