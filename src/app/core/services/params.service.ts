import { Injectable, Inject } from '@angular/core';
import { map ,  catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClientLanguage } from '../../shared/models/common/client-language.model';

@Injectable()
export class ParamsService {
  public appTitle = 'Tsm';
  public baseApiUrl = '';
  public clientBaseUrl = 'https://tsm.sytech.vn';
  public slogan = '';
  public gmapsApiKey = '';
  public clientLanguages: ClientLanguage[] = [];
  public contactEmail: string | undefined = undefined;
  public contactPhone: string | undefined = undefined;
  public clearConsole = false;

  constructor(private http: HttpClient) { }

  load() {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8'});

      this.http.get(location.origin + '/assets/params.json', { headers })
        .pipe(map(res => res), catchError(err => {
          throw new Error('Không tìm thấy file tham số [' + err.toString() + ']');
        }))
        .subscribe((paraResponse: any) => {
          if (paraResponse.baseApiUrl) {
            this.baseApiUrl = paraResponse.baseApiUrl;
          }
          else {
            resolve(false);
            throw new Error('Chưa có tham số baseApiUrl');
          }

          if (paraResponse.clientLanguages) {
            this.clientLanguages = paraResponse.clientLanguages;
          }
          else {
            resolve(false);
            throw new Error('Chưa có tham số clientLanguages');
          }

          if (paraResponse.clientBaseUrl) {
            this.clientBaseUrl = paraResponse.clientBaseUrl;
          }

          if (paraResponse.appTitle) {
            this.appTitle = paraResponse.appTitle;
          }

          if (paraResponse.slogan) {
            this.slogan = paraResponse.slogan;
          }

          if (paraResponse.gmapsApiKey) {
            this.gmapsApiKey = paraResponse.gmapsApiKey;
          }

          if (paraResponse.contactEmail) {
            this.contactEmail = paraResponse.contactEmail;
          }

          if (paraResponse.contactPhone) {
            this.contactPhone = paraResponse.contactPhone;
          }

          this.clearConsole = paraResponse.clearConsole || false;

          resolve(true);
        });
    });
  }

  public formatPhone() {
    const cleaned = ('' + this.contactPhone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return '+' + match[1] + ' '+ match[2] + ' ' + match[3] + ' ' + match[4];
    }

    return this.contactPhone;
  }
}
