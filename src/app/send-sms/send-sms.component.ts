import { Component, OnInit } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.css'],
  animations: [
    trigger('alertInOut', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('200ms', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0, height: 0 }))
      ])
    ]),
    trigger('enterLeave', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SendSmsComponent implements OnInit {

  // Alerts labels
  private textAlert: boolean;
  private phoneAlert: boolean;

  // Data
  private smsPrice: number;

  // States
  private sendSms: boolean;
  private calculatingPrice: boolean;

  constructor() {
    this.textAlert = false;
    this.phoneAlert = false;

    this.sendSms = true;
    this.calculatingPrice = false;
  }

  ngOnInit() {
    this.smsPrice = 0;
  }

  /**
   * Validate text message
   * @param value message
   */
  private validateText(value: string): boolean {
    return value.trim().length !== 0;
  }

  /**
   * Validate phone numbers
   * @param value phones
   */
  private validatePhones(value: string): boolean {
    const regex = /\(\d{2}\)\d{5}-\d{4}/;
    const phones = value.split(' ');
    let vality = true;
    phones.map(item => {
      regex.test(item) ? vality = (vality && true) : vality = (vality && false);
    });
    return vality;
  }

  /**
   * Reset alerts
   */
  private clearAlerts() {
    this.phoneAlert = false;
    this.textAlert = false;
  }

  /**
   * Show alerts
   * @param phones phones for validate
   * @param text text for validate
   */
  private showAlerts(phones: string, text: string) {
    if (!this.validatePhones(phones)) {
      this.phoneAlert = true;
    }
    if (!this.validateText(text)) {
      this.textAlert = true;
    }
  }

  /**
   * Continue to calculate price
   * @param phones phones numbers
   * @param text message text
   */
  public continue(phones: string, text: string): void {
    this.clearAlerts();
    if (this.validateText(text) && this.validatePhones(phones)) {
      this.sendSms = false;
      this.smsPrice = this.calculatePrice(phones.split(' '), text);
      setTimeout(() => {
        this.calculatingPrice = true;
      }, 1300);
    } else {
      this.showAlerts(phones, text);
    }
  }

  /**
   * Calculate sms price
   * @param phones Phones to calculate value
   * @param text Text to calculate value
   */
  private calculatePrice(phones: string[], text: string): number {
    const taxPhone = 0.10;
    const taxText = 0.05;
    let priceTotal = 0;

    priceTotal += phones.length * taxPhone;
    priceTotal += Math.floor(text.trim().length / 10) * taxText;
    return priceTotal;
  }

  public undoState(): void {
    this.calculatingPrice = false;
    setTimeout(() => {
      this.sendSms = true;
    }, 900);
  }

}
