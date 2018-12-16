import { Component, OnInit } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import axios from 'axios';

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
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('200ms', style({ opacity: 1, height: '*', transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class SendSmsComponent implements OnInit {

  // Alerts labels
  public textAlert: boolean;
  public phoneAlert: boolean;

  // Data
  public smsPrice: number;
  public phonesNumbers: string[];
  public smsText: string;
  public protocol: string;

  // States
  public sendSms: boolean;
  public calculatingPrice: boolean;

  constructor() {
    this.textAlert = false;
    this.phoneAlert = false;

    this.sendSms = true;
    this.calculatingPrice = false;
  }

  ngOnInit() {
    this.smsPrice = 0;
    this.phonesNumbers = [];
    this.smsText = '';
    this.protocol = '';
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
    const regex = /^\(\d{2}\)\d{5}-\d{4}$/;
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
      this.phonesNumbers = phones.split(' ');
      this.smsText = text;
      setTimeout(() => {
        this.calculatingPrice = true;
      }, 800);
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

  /**
   * Returns to the previous state
   */
  public undoState(): void {
    this.calculatingPrice = false;
    setTimeout(() => {
      this.sendSms = true;
    }, 800);
  }

  /**
   * Confirm shipping
   */
  public async confirmShipping(): Promise<any> {
    this.calculatingPrice = false;
    await axios.post('https://api-smsxpress.herokuapp.com/api/sms/send', {
      to: this.phonesNumbers,
      text: this.smsText,
      from: '+19805332276'
    })
      .then((res) => {
        this.protocol = res.data.protocol;
        this.sendSms = true;
        this.calculatingPrice = true;
      })
      .catch((error) => {
        this.sendSms = false;
      });
  }

  /**
   * Prepares the environment for a new shipment
   */
  public sendNewSms() {
    this.clearData();
    this.sendSms = false;
    this.undoState();
  }

  /**
   * Clear data
   */
  private clearData() {
    this.smsPrice = 0;
    this.smsText = '';
    this.phonesNumbers = [];
    this.protocol = '';
  }

}
