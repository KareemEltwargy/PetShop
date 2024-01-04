import { Component } from '@angular/core';
import { TranslationService } from '../../Services/translation.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  originalText = {
    
Getintouch:'Get in touch',
Name:'Name',
Email:'Email',
Subject:'Subject',
Message:'Message',
SendEmail:'Send Email'
  };

  translatedText = {
Getintouch:'كن علي تواصل معنا',
Name:'الإسم',
Email:'البريد الإلكتروني',
Subject:'الموضوع',
Message:'الرسالة',
SendEmail:'أرسل البريد الإلكتروني'
  };

  isTranslated = false;

  constructor(private translationService: TranslationService) {
    this.translationService.isTranslated$.subscribe((isTranslated) => {
      this.isTranslated = isTranslated;
      let name = document.getElementById('name');
    if (name) name.style.direction = this.isTranslated ? 'rtl' : 'ltr';

    let Email = document.getElementById('email');
    if (Email) Email.style.direction = this.isTranslated ? 'rtl' : 'ltr';

    let object = document.getElementById('object');
    if (object) object.style.direction = this.isTranslated ? 'rtl' : 'ltr';

    let message = document.getElementById('message');
    if (message) message.style.direction = this.isTranslated ? 'rtl' : 'ltr';
    });
  }
}
