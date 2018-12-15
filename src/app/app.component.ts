import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * Scroll To
   * @param id Target ID
   */
  public scroll(id) {
    const target = document.getElementById(id);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}
