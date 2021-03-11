import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SideBarComponent
  ],
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
