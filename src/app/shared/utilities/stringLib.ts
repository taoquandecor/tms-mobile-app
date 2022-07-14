export class StringLib {
  private readonly SRCS = 'áàạảãâấầậẩẫăắằặẳẵÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨđĐýỳỵỷỹÝỲỴỶỸ';
  private readonly REPS = 'aaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAeeeeeeeeeeeEEEEEEEEEEEoooooooooooooooooOOOOOOOOOOOOOOOOOuuuuuuuuuuuUUUUUUUUUUUiiiiiIIIIIdDyyyyyYYYYY';
  private readonly REPS2: string[] = [];

  constructor() {
    let i = 0, pos = 0;
    let pre = '';
    for (let c of this.SRCS) {
      let d = this.REPS.charAt(pos);
      if (pre === d) i++;
      else {
        i = 0;

        pre = d;
      }

      pos++;
      this.REPS2.push(d + "~" + i.toString());
    }
  }

  static toKhongDau(text: string) {
    let src = 'áàạảãâấầậẩẫăắằặẳẵÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨđĐýỳỵỷỹÝỲỴỶỸ';
    let des = 'aaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAeeeeeeeeeeeEEEEEEEEEEEoooooooooooooooooOOOOOOOOOOOOOOOOOuuuuuuuuuuuUUUUUUUUUUUiiiiiIIIIIdDyyyyyYYYYY';

    let res = "";
    if (text) {
      for (let i = 0; i < text.length; i++) {
        let c = text.charAt(i);

        let idx = src.indexOf(c);
        if (idx > -1) res += des[idx];
        else res += c;
      }

      return res;
    }

    return text;
  }

  public toVnSort(text: string) {
    let res = "";
    if (text) {
      for (let i = 0; i < text.length; i++) {
        let c = text.charAt(i);

        let idx = this.SRCS.indexOf(c);
        if (idx > -1) res += this.REPS2[idx];
        else res += c;
      }

      return res;
    }

    return text;
  }

  public static inVns(child: string, parent: string | undefined, ignoreCase: boolean = true) {
    if (!child || !parent) return false;

    let p = this.toKhongDau(ignoreCase ? parent?.toLowerCase() : parent);
    let c = this.toKhongDau(ignoreCase ? child.toLowerCase() : child);

    return (p.indexOf(c) > -1);
  }

  static paddingLeft(str: string, padding: string, len: number) {
    if (str === undefined || str === null || padding === undefined || padding === null || len < 1 || str.length >= len) return str;

    let res = str;
    while (res.length < len) {
      res = padding + res;
    }

    return res;
  }

  static concat(s1: string, s2: string, splitter: string) {
    if (s1 && s2) return s1 + splitter + s2;
    else return s1 || s2;
  }
}
