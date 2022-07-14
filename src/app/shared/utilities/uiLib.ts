export class UiLib {
  public getImageDisplay(filename: string | undefined, base64Content: string | undefined): string | undefined {
    if (filename) {
      if (base64Content) {
        let fn: string = filename.toLowerCase();
        if (fn.endsWith(".png")) return "data:image/png;base64," + base64Content;
        else if (fn.endsWith(".jpg")) return "data:image/jpeg;base64," + base64Content;
        else if (fn.endsWith(".jpeg")) return "data:image/jpeg;base64," + base64Content;
        else if (fn.endsWith(".gif")) return "data:image/gif;base64," + base64Content;
        else if (fn.endsWith(".bmp")) return "data:image/bmp;base64," + base64Content;
        else if (fn.endsWith(".webp")) return "data:image/webp;base64," + base64Content;
        else if (fn.endsWith(".svg")) return "data:image/svg+xml;base64," + base64Content;
      }
    }

    return undefined;
  }

  private base64ArrayBuffer(arrayBuffer: ArrayBuffer) {
    let base64 = '';

    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    const bytes = new Uint8Array(arrayBuffer);
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;

    let a;
    let b;
    let c;
    let d;
    let chunk;

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i += 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
      d = chunk & 63;        // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder === 1) {
      chunk = bytes[mainLength];

      a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4; // 3   = 2^2 - 1

      base64 += `${encodings[a]}${encodings[b]}==`;
    } else if (byteRemainder === 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

      a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2; // 15    = 2^4 - 1

      base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
    }

    return base64;
  }

  //Convert base64 string to blob
  public base64toBlob(base64Data: string, contentType: string = "", sliceSize: number = 512) {
    var byteCharacters = atob(base64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  //Save file
  public saveFile(fileName: string, base64: string, contentType = "") {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none");

    let blob = this.base64toBlob(base64, contentType);
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  //Save json
  public saveJson(fileName: string, json: string) {
    let blob = new Blob([json], { type: 'text/json' });
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  public openFileInNewTab(fileName: string, base64: string) {
    const blob = this.base64toBlob(base64, this.getMIMEType(fileName));
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, "_blank");
  }

  private getMIMEType(fileName: string) {
    if (fileName) {
      let fn = fileName.toLowerCase();
      if (fn.endsWith(".pdf")) return "application/pdf";
      else if (fn.endsWith(".png")) return "image/png";
      else if (fn.endsWith(".tif")) return "image/tiff";
      else if (fn.endsWith(".tiff")) return "image/tiff";
      else if (fn.endsWith(".jpeg")) return "image/jpeg";
      else if (fn.endsWith(".jpg")) return "image/jpeg";
      else if (fn.endsWith(".gif")) return "image/gif";
      else if (fn.endsWith(".bmp")) return "image/bmp";
      else if (fn.endsWith(".ico")) return "image/vnd.microsoft.icon";
      else if (fn.endsWith(".webp")) return "image/webp";
      else if (fn.endsWith(".xls")) return "application/vnd.ms-excel";
      else if (fn.endsWith(".xlsx")) return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      else if (fn.endsWith(".doc")) return "application/msword";
      else if (fn.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      else if (fn.endsWith(".csv")) return "text/csv";
      else if (fn.endsWith(".ppt")) return "application/vnd.ms-powerpoint";
      else if (fn.endsWith(".pptx")) return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    }

    return undefined;
  }

  public openUrlInNewTab(url: string) {
    window.open(url, "_blank");
  }
}
