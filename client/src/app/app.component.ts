import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseLayoutComponent } from './shared/baseLayout/baselayout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BaseLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Recipe Collection Site';
}
