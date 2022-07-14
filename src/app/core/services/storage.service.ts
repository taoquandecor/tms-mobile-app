import { Injectable } from '@angular/core';

// Can only use when document is init

@Injectable()
export class StorageService {
  private readonly prefix = 'Tsm.';

  public save(key: string, value: string | undefined) {
    if (value === null || value === undefined) {
      this.remove(key);
    }
    else {
      if (typeof (Storage) == undefined) {
        this.setCookie(this.prefix + key, value, 30);
      }
      else {
        localStorage.setItem(this.prefix + key, value);
      }
    }
  }

  public load(key: string): string | undefined {
    try {
      if (typeof (Storage) == undefined) {
        return this.getCookie(this.prefix + key);
      }
      else {
        return localStorage.getItem(this.prefix + key) || undefined;
      }
    } catch (e) {
      return undefined;
    }
  }

  public remove(key: string): void {
    if (typeof (Storage) == undefined) {
      this.removeCookie(this.prefix + key);
    }
    else {
      localStorage.removeItem(this.prefix + key);
    }
  }

  public saveSession(key: string, value: string) {
    sessionStorage.setItem(this.prefix + key, value);
  }

  public loadSession(key: string): string | null {
    return sessionStorage.getItem(this.prefix + key);
  }

  public removeSession(key: string): void {
    sessionStorage.removeItem(this.prefix + key);
  }

  public clearSession() {
    sessionStorage.clear();
  }

  private setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  private getCookie(cname: string): string {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  private removeCookie(cname: string) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  }

}
