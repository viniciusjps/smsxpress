import { Component } from '@angular/core';
import swal from 'sweetalert';

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
  public scroll(id): void {
    const target = document.getElementById(id);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  public consult(value): void {
    swal({
      text: 'Informe o número do protocolo',
      content: {
        element: 'input',
        attributes: {
          placeholder: '0000-1111-2222'
        }
      },
      icon: 'info',
      button: {
        text: 'Consultar',
        closeModal: false,
        className: 'ui green button'
      }
    })
      .then(protocol => {
        if (!protocol) {
          throw null;
        }
        return fetch('https://api-smsxpress.herokuapp.com/api/sms/' + protocol);
      })
      .then(res => {
        return res.json();
      })
      .then(json => {
        let text = 'Mensagem: ' + json.text + '\n\n';
        text += 'Destinatários: \n';
        json.to.map(phone => {
          text += phone + '\n';
        });
        const date = new Date(json.createdAt);
        text += '\n' + 'Enviado em ' + date.toLocaleDateString();
        swal({
          title: 'Nº ' + json.protocol,
          text: text,
          button: {
            text: 'fechar',
            closeModal: true,
            className: 'ui blue button'
          }
        });
      })
      .catch(error => {
        if (error) {
          swal('Ops', 'Verifique o número do seu protocolo', 'error');
        } else {
          swal.stopLoading();
          swal.close();
        }
      });
  }

}
