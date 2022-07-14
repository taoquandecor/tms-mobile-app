export class DateLib {
  // Convert user input string to date
  // Format: (d)d/(M)M/(yy)yy, (M)M/(d)d/(yy)yy, (yy)yy/(M)M/(d)d
  // Return null if cannot convert
  public parseUserInput(value: string, format: string): Date | null {
    // Check if dmy/mdy/ymd
    let ifmt = "";
    Array.from(format).forEach(c => {
      if (c === "d" || c === "D" || c === "M" || c === "y" || c === "Y") {
        c = c.toLowerCase();
        if (ifmt.indexOf(c) < 0) {
          ifmt += c;
        }
      }
    });

    let fmts: string[];
    if (ifmt.indexOf("my") === 0) {
      fmts = [format, "MMyydd", "MMyyyydd", "M/yy/d"];
    }
    else if (ifmt.indexOf("ym") === 0) {
      fmts = [format, "yyMMdd", "yyyyMMdd", "yy/M/d"];
    }
    else if (ifmt.indexOf("md") === 0) {
      fmts = [format, "MMddyy", "MMddyyyy", "M/d/yy"];
    }
    else {
      ;
      fmts = [format, "ddMMyy", "ddMMyyyy", "d/M/yy"];
    }

    for (let fmt of fmts) {
      let d = this.parseExact(value, fmt);
      if (d) {
        return d;
      }
    }

    return null;
  }

  // Convert string to date with input format
  // Support format (d)d/(M)M/(yy)yy when input 31/12/2017 but not support format dd/MM/yyyy when input 1/1/17
  // Return null if cannot convert
  public parseExact(value: string, format: string): Date | undefined {
    let dayString = "";
    let monString = "";
    let yearString = "";
    let lastf = "";

    let func = function (fmt: string, val: string) {
      if (fmt === "d" || fmt === "D") {
        dayString += val;
      }
      else if (fmt === "M") {
        monString += val;
      }
      else if (fmt === "y" || fmt === "Y") {
        yearString += val;
      }
      else return true; // Format đến phân cách ngày nhưng giá trị vẫn còn ví dụ d/M/y, 21/12/2017

      lastf = fmt;
      return false;
    }

    let flen = format.length;
    let vlen = value.length;

    let f = "";
    let v = "";
    let findex = 0;
    let vindex = 0;
    while (findex < flen && vindex < vlen) {
      f = format.charAt(findex);
      v = value.charAt(vindex);

      if (func(f, v)) {
        if ("0123456789".indexOf(v) > -1) {
          if (((lastf === "d" || lastf === "D") && dayString.length < 2) ||
            (lastf === "M" && monString.length < 2) ||
            ((lastf === "y" || lastf === "Y") && yearString.length < 4)) {

            func(lastf, v);
            //vindex++;
          }
          else vindex--;
        }
      }


      findex++;
      vindex++;

      // Xử lý đoạn cuối nếu format hết nhưng vẫn còn giá trị
      if (findex == flen && vindex < vlen) {
        Array.from(value.substr(vindex)).forEach(c => {
          if ("0123456789".indexOf(c) > -1) {
            func(lastf, c);
          }
        });
      }
    }

    let cy = (new Date()).getFullYear();
    let cys = cy.toString();
    if (yearString.length < cys.length) {
      let y = Number(yearString);
      if (isNaN(y)) {
        yearString = cys;
      }
      else {
        let ceil = cy.toString().substr(0, cys.length - yearString.length) + yearString;
        let floor = (cy - 100).toString().substr(0, cys.length - yearString.length) + yearString;
        if (Number(ceil) - cy > cy - Number(floor)) yearString = floor;
        else yearString = ceil;
      }
    }

    let y = Number(yearString);
    let m = Number(monString);
    let d = Number(dayString);

    if (isNaN(y) || isNaN(m) || isNaN(d)) return undefined;
    else {
      m = m - 1;
      let result = new Date(y, m, d, 0, 0, 0, 0);
      if (y === result.getFullYear() && m === result.getMonth() && d === result.getDate()) {
        return result;
      }
      else {
        return undefined;
      }
    }
  }

  public parseFornat(value: string, format: string): Date | undefined {
    if (!value || !format) return undefined;

    let yearString = "";
    let monString = "";
    let dayString = "";
    let hourString = "";
    let minuteString = "";
    let secondString = "";
    let milisecondString = "";

    let func = function (fmt: string, val: string) {
      if (fmt === "y" || fmt === "Y") {
        yearString += val;
      }
      else if (fmt === "M") {
        monString += val;
      }
      else if (fmt === "d" || fmt === "D") {
        dayString += val;
      }
      else if (fmt === "h" || fmt === "H") {
        hourString += val;
      }
      else if (fmt === "m") {
        minuteString += val;
      }
      else if (fmt === "s") {
        secondString += val;
      }
      else if (fmt === "f") {
        milisecondString += val;
      }
    }

    let flen = format.length;
    let vlen = value.length;
    let len = flen < vlen ? flen : vlen;
    for (let i = 0; i < len; i++) {
      func(format.substr(i, 1), value.substr(i, 1));
    }

    let cy = (new Date()).getFullYear();
    let cys = cy.toString();
    if (yearString.length < cys.length) {
      let y = Number(yearString);
      if (isNaN(y)) {
        yearString = cys;
      }
      else {
        let ceil = cy.toString().substr(0, cys.length - yearString.length) + yearString;
        let floor = (cy - 100).toString().substr(0, cys.length - yearString.length) + yearString;
        if (Number(ceil) - cy > cy - Number(floor)) yearString = floor;
        else yearString = ceil;
      }
    }

    let y = Number(yearString);
    let m = Number(monString);
    let d = Number(dayString);
    let h = hourString ? Number(hourString) : 0;
    let p = minuteString ? Number(minuteString) : 0;
    let s = secondString ? Number(secondString) : 0;
    let ms = milisecondString ? Number(milisecondString) : 0;

    if (isNaN(y) || isNaN(m) || isNaN(d)) return undefined;
    else {
      m = m - 1;
      let result = new Date(y, m, d, h, p, s, ms);
      if (y === result.getFullYear() && m === result.getMonth() && d === result.getDate() && h === result.getHours() && p === result.getMinutes() && s === result.getSeconds() && ms === result.getMilliseconds()) {
        return result;
      }
      else {
        return undefined;
      }
    }
  }

  // Trong trường hợp value không phải kiểu date thì nên viết hàm khác vì nó sẽ không có hàm getDate
  public format(value: any, dateFormat: string): string {
    if (value && dateFormat) {
      let v = value;
      if (typeof value.getDate === "undefined") {
        v = new Date(value);
      }

      let ds1 = v.getDate().toString();
      let ds2 = ("0" + ds1).substr(ds1.length - 1, 2);
      let ms1 = (v.getMonth() + 1).toString();
      let ms2 = ("0" + ms1).substr(ms1.length - 1, 2);
      let ys = v.getFullYear().toString();
      let ys2 = ys.substr(2);
      let hs1 = v.getHours().toString();
      let hs2 = ("0" + hs1).substr(hs1.length - 1, 2);
      let ps1 = v.getMinutes().toString();
      let ps2 = ("0" + ps1).substr(ps1.length - 1, 2);
      let ss1 = v.getSeconds().toString();
      let ss2 = ("0" + ss1).substr(ss1.length - 1, 2);

      return dateFormat.toString().replace(/dd/g, ds2).replace(/d/g, ds1).replace(/MM/g, ms2).replace(/M/g, ms1).replace(/yyyy/g, ys).replace(/yy/g, ys2).replace(/HH/g, hs2).replace(/H/g, hs1).replace(/mm/g, ps2).replace(/m/g, ps1).replace(/ss/g, ss2).replace(/s/g, ss1);
    }
    else return "";
  }

  public formatNgb(ngb: any, fmt: string) {
    return this.format(this.ngb2Date(ngb), fmt);
  }

  // Chuyển giá trị trong cột date string sang kiểu date
  // Dùng cho lấy dữ liệu dạng array từ web api
  // data: Array
  public string2DateData(data: any, dateColumns: string[]) {
    if (data) {
      for (let row of data) {
        for (let c of dateColumns) {
          if (row[c]) {
            row[c] = new Date(row[c]);
          }
        }
      }
    }

    return data;
  }

  // Chuyển giá trị trong cột date string sang kiểu ngbdate
  // Dùng cho lấy dữ liệu dạng array từ web api
  // data: Array
  public string2ngbDateData(data: any, dateColumns: string[]) {
    if (data) {
      for (let row of data) {
        for (let c of dateColumns) {
          if (row[c]) {
            let d: Date = new Date(row[c]);
            row["ngb_" + c] = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
          }
        }
      }
    }

    return data;
  }


  // Chuyển giá trị trong cột ngbdate sang kiểu string
  // Dùng cho gửi dữ liệu dạng array đến web api
  // data: Array
  public ngbDate2StringData(data: any, dateColumns: string[], format: string = "yyyy/MM/dd") {
    for (let row of data) {
      for (let c of dateColumns) {
        if (row["ngb_" + c]) {
          row[c] = this.ngb2DateString(row["ngb_" + c], format);
        }
      }
    }

    return data;
  }

  // Chuyển ngbDate lấy từ ngbDatepicker sang string
  public ngb2DateString(ngbDate: any, format: string) {
    if (ngbDate) {
      let d = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
      if (d) {
        return this.format(d, format);
      }
    }

    return undefined;
  }

  // Chuyển ngbDate lấy từ ngbDatepicker sang Date
  public ngb2Date(ngbDate: any) {
    if (ngbDate) {
      let d = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
      if (this.isDate(d)) return d;
    }

    return undefined;
  }

  public date2Ngb(date: Date) {
    if (this.isDate(date)) {
      let d = new Date(date);
      if (this.isDate(d)) {
        return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      }
    }

    return undefined;
  }

  // Lấy ngày hiện tại, bỏ giờ phút giây
  public getCurrentDate(): Date {
    let d = new Date();
    d.setHours(0, 0, 0, 0);

    return d;
  }

  public getCurrentNgbDate(): any {
    let d = new Date();
    d.setHours(0, 0, 0, 0);

    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  public getCurrentTime(format: string = "HH:mm") {
    let d = new Date();
    return this.formatTime(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(), format);
  }

  public isTime(s: string, format: string = "HH:mm") {
    if (s && format) {
      let fmts = format.split(':');
      let ss = s.split(':');

      if (fmts.length <= ss.length && fmts.length > 0) {
        if (fmts.length === 1) return this.checkTimeChunk(ss[0], fmts[0]);
        else if (fmts.length === 2) return (this.checkTimeChunk(ss[0], fmts[0]) && this.checkTimeChunk(ss[1], fmts[1]));
        else if (fmts.length > 2) return (this.checkTimeChunk(ss[0], fmts[0]) && this.checkTimeChunk(ss[1], fmts[1]) && this.checkTimeChunk(ss[2], fmts[2]));
      }
    }

    return false;
  }

  private checkTimeChunk(s: string, fmt: string) {
    let n = Number(s);
    if (s && !isNaN(n)) {
      if (fmt === "H" || fmt === "HH") {
        if (n >= 0 && n < 24) return true;
      }
      else if (fmt === "h" || fmt === "hh") {
        if (n >= 0 && n < 13) return true;
      }
      else if (fmt === "m" || fmt === "mm") {
        if (n >= 0 && n < 60) return true;
      }
      else if (fmt === "s" || fmt === "ss") {
        if (n >= 0 && n < 60) return true;
      }
    }

    return false;
  }

  public formatTime(s: string, format: string = "HH:mm") {
    if (this.isTime(s, format)) {
      if (s && format) {
        let fmts = format.split(':');
        let ss = s.split(':');

        if (fmts.length > 0 && fmts.length <= ss.length) {
          let res = "";
          for (var i = 0; i < fmts.length; i++) {
            res += ("0".repeat(fmts[i].length) + ss[i]).slice(-fmts[i].length) + ":";
          }
          return res.substr(0, format.length);
        }
      }
    }

    return undefined;
  }

  public dateDiff(datepart: any, fromdate: any, todate: any) {
    datepart = datepart.toLowerCase();
    let diff = todate - fromdate;
    const divideBy: any = {
      w: 604800000,
      d: 86400000,
      h: 3600000,
      n: 60000,
      s: 1000
    };

    return Math.floor(diff / divideBy[datepart]);
  }

  public isDate(d: any) {
    if (!d) return false;
    else {
      let timestamp = Date.parse(d)
      if (isNaN(timestamp)) return false;
    }

    return true;
  }

  public addDays(d: Date, days: number) {
    let n = new Date(d);
    return new Date(n.setDate(n.getDate() + Number(days)));
  }

  public addHours(d: Date, hours: number) {
    let n = new Date(d);
    return new Date(n.setHours(n.getHours() + Number(hours)));
  }

  public addMinutes(d: Date, minutes: number) {
    let n = new Date(d);
    return new Date(n.setMinutes(n.getMinutes() + Number(minutes)));
  }

  public dateIntersect(tuNgay1: Date, denNgay1: Date, tuNgay2: Date, denNgay2: Date) {
    if (tuNgay1 > denNgay2) return false;
    if (denNgay1 < tuNgay2) return false;

    return true;
  }

  public validUserTime(userInput: string) {
    if (this.isTime(userInput, "HH:mm")) return userInput;

    if (userInput) {
      let s = userInput.replace(":", "").replace(" ", "");
      if (s.length === 1) s = "0" + s + ":00";
      else if (s.length === 2) s = s + ":00";
      else if (s.length === 3) s = s.substr(0, 2) + ":" + s.substr(2, 1);
      else if (s.length > 3) s = s.substr(0, 2) + ":" + s.substr(2, 2);

      if (this.isTime(s, "HH:mm")) return s;
    }

    return "";
  }

  // Lấy ngày cuối cùng của tháng có thứ tương ứng
  // dayOfWeek: 1 = T2, 2 = T3...., 7 = CN
  public getLastDate(year: number, month: number, dayOfWeek: number) {
    let d = new Date(year, month + 1, 0);
    if (d.getDay() === dayOfWeek) return d;
    else {
      let res = d;
      while (res.getDay() !== dayOfWeek) {
        res = this.addDays(res, -1);
      }

      return res;
    }
  }

  // Lấy ngày đầu tiên của tháng có thứ tương ứng
  // dayOfWeek: 1 = T2, 2 = T3...., 7 = CN
  public getFirstDate(year: number, month: number, dayOfWeek: number) {
    let d = new Date(year, month, 1);
    if (d.getDay() === dayOfWeek) return d;
    else {
      let res = d;
      while (res.getDay() !== dayOfWeek) {
        res = this.addDays(res, 1);
      }

      return res;
    }
  }

  public api2Date(txt: any) {
    if (!txt) return txt;
    if (txt instanceof Date || typeof txt.getDate !== "undefined") return txt;

    //let s = txt.replace(/T/g, ' ');
    //s = s.replace(/[ :]/g, "-").split("-");
    //return new Date(s[0], s[1] - 1, s[2], s[3], s[4], s[5]);

    //return new Date(txt.replace(/-/g, '/').replace(/T/g, ' '));

    return new Date(txt.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
  }

  public ngbDateEquals(d1: any, d2: any) {
    if (!d1 && !d2) return true;

    if (d1 && d2 && d1.year === d2.year && d1.month === d2.month && d1.day === d2.day) return true;

    return false;
  }

  public castTime(s: string, format: string = "HH:mm") {
    if (s && format) {
      let fmts = format.split(':');
      let ss = s.split(':');

      if (fmts.length <= ss.length && fmts.length > 0) {
        if (fmts.length === 1) {
          if (this.checkTimeChunk(ss[0], fmts[0])) {
            return { hour: Number(ss[0]), minute: 0, second: 0 };
          }
        }
        else if (fmts.length === 2) {
          if (this.checkTimeChunk(ss[0], fmts[0]) && this.checkTimeChunk(ss[1], fmts[1])) {
            return { hour: Number(ss[0]), minute: Number(ss[1]), second: 0 };
          }
        }
        else if (fmts.length > 2) {
          if (this.checkTimeChunk(ss[0], fmts[0]) && this.checkTimeChunk(ss[1], fmts[1]) && this.checkTimeChunk(ss[2], fmts[2])) {
            return { hour: Number(ss[0]), minute: Number(ss[1]), second: Number(ss[2]) };
          }
        }
      }
    }

    return undefined;
  }

  public timeBetween(from: string, to: string, gioPhut: string) {
    let ftime = this.castTime(from);
    let ttime = this.castTime(to);
    let time = this.castTime(gioPhut);

    if (time) {
      let curr = new Date();
      let d = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), time.hour, time.minute, time.second).getTime();
      let fd: number | undefined = undefined;
      let td: number | undefined = undefined;

      if (ftime) {
        fd = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), ftime.hour, ftime.minute, ftime.second).getTime();
      }

      if (ttime) {
        td = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), ttime.hour, ttime.minute, ttime.second).getTime();
      }

      let fcheck = fd ? d >= fd : true;
      let tcheck = td ? d <= td : true;

      return fcheck && tcheck;
    }

    return false;
  }

  //  0: ngb1 === ngb2
  // -1: ngb1 < ngb2
  //  1: ngb1 > ngb2
  public compareNgb(ngb1: any, ngb2: any) {
    if (!ngb1 && !ngb2) return 0;

    if (!ngb1 && ngb2) return -1;

    if (ngb1 && !ngb2) return 1;

    const t1 = this.ngb2Date(ngb1)?.getTime();
    const t2 = this.ngb2Date(ngb2)?.getTime();

    return t1 === t2 ? 0 : (t1 ?? 0) < (t2 ?? 0) ? -1 : 1;
  }

  // Lấy ngày đầu tiên và ngày cuối cùng của tuần tính theo ngày d, bắt đầu từ thứ 2 đến chủ nhật
  // Không tính time
  public getWeekDate(d: Date, fromMonday: boolean = true) {
    let day = d.getDay() || 7;

    let from: Date;
    if (fromMonday) {
      from = this.addDays(d, 1 - day);
    }
    else {
      from = this.addDays(d, 0 - day);
    }

    return { from: from, to: this.addDays(from, 6) };
  }

  // Lấy ngày đầu tiên và ngày cuối cùng của tháng tính theo ngày d
  public getMonthDate(d: Date) {
    let from = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
    let to = new Date(d.getFullYear(), d.getMonth() + 1, 0, 0, 0, 0, 0);
    return { from: from, to: to };
  }

  // Lấy ngày đầu tiên và ngày cuối cùng của quý tính theo ngày d
  public getQuarterDate(d: Date) {
    let from: Date, to: Date;
    let m = d.getMonth();
    let y = d.getFullYear();

    if (m === 0 || m === 1 || m === 2) {
      from = new Date(y, 0, 1, 0, 0, 0, 0);
      to = new Date(y, 3, 0, 0, 0, 0, 0);
    }
    else if (m === 3 || m === 4 || m === 5) {
      from = new Date(y, 3, 1, 0, 0, 0, 0);
      to = new Date(y, 6, 0, 0, 0, 0, 0);
    }
    else if (m === 6 || m === 7 || m === 8) {
      from = new Date(y, 6, 1, 0, 0, 0, 0);
      to = new Date(y, 9, 0, 0, 0, 0, 0);
    }
    else {
      from = new Date(y, 9, 1, 0, 0, 0, 0);
      to = new Date(y, 12, 0, 0, 0, 0, 0);
    }

    return { from: from, to: to };
  }

  public ngbDateContains(from: any, to: any, ngb: any) {
    if (!ngb) return false;

    let d = this.ngb2Date(ngb)?.getTime() ?? 0;
    if (!from && to) {
      let t = this.ngb2Date(to)?.getTime() ?? 0;
      if (d <= t) return true;
    }
    else if (from && !to) {
      let f = this.ngb2Date(from)?.getTime() ?? 0;
      if (d >= f) return true;
    }
    else if (from && to) {
      if (d >= (this.ngb2Date(from)?.getTime() ?? 0) && d <= (this.ngb2Date(to)?.getTime() ?? 0)) return true;
    }

    return false;
  }

  public concatTime(ngay: Date, gioPhut: string) {
    if (ngay && this.isTime(gioPhut)) {
      let s = this.format(ngay, "yyyy/MM/dd") + " " + gioPhut;
      let d = this.parseFornat(s, "yyyy/MM/dd HH:mm:ss");
      if (d) return d;
    }

    return ngay;
  }
}
