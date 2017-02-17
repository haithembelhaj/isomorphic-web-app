import {Promise} from 'es6-promise';

export function getDataUri(url, format, quality) {

  return new Promise((resolve, reject) => {

    const image = new Image();

    image.onload = function () {

      const canvas = document.createElement('canvas');

      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;

      canvas.getContext('2d').drawImage(this, 0, 0);


      // Get raw image data
      resolve(canvas.toDataURL('image/' + format, quality));
    };

    image.onerror = (e) => reject(e);

    image.src = url;
  });
}
