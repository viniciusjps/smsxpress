import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('enterLeave', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('200ms', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0, height: '0' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  // Actions scenes modal
  public search: boolean;
  public result: boolean;

  // Data
  private text: string;
  private to: string[];
  private createdAt: string;

  // Aux data
  private value: string;

  ngOnInit() {
    this.search = false;
    this.result = false;
    this.value = '';
  }

  /**
   * Scroll To
   * @param id Target ID
   */
  public scroll(id): void {
    const target = document.getElementById(id);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Make an Inquiry
   */
  public async consult(): Promise<any> {
    if (this.value !== undefined && this.value !== '') {
      this.search = true;
      await axios.get('https://api-smsxpress.herokuapp.com/api/sms/' + this.value)
        .then(res => {
          this.result = true;
          this.text = res.data[0].text;
          this.to = res.data[0].to;
          const date = new Date(res.data[0].createdAt);
          this.createdAt = date.toLocaleDateString() + ' às ' + date.toLocaleTimeString();
        }).catch(error => {
          this.search = false;
          this.result = true;
        });
    }
  }

  /**
   * Prepare environment for new research
   */
  public newSearch(): void {
    this.search = false;
    this.result = false;
    this.value = '';
  }

  /**
   * Validate protocol entry
   */
  public validInput(): boolean {
    return /^\d{4}-\d{4}-\d{4}$/.test(this.value);
  }

}
