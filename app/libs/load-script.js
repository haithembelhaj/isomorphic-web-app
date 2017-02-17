/**
 * usefull functions
 *
 */

import {Promise} from 'es6-promise';
import {hash} from './utils';
import dom from './dom';

let loadedScripts = {};

/**
 * load a script url async
 * @param url
 * @returns returns a promise
 */
export function loadScript(url, options) {

  options = Object.assign({jsonp: true, async: false}, options);

  const id = 'script' + hash(url);
  let src = options.jsonp ? `${url}&callback=${id}` : url;

  if (!loadedScripts[id]) {

    loadedScripts[id] = new Promise((resolve, reject) => {

      let script = dom.script({
        id,
        src,
        async: options.async,
        type: 'text/javascript'
      });

      script.onerror = reject;

      if(options.jsonp) {

        window[id] = resolve;

      } else {

        script.onload = resolve;
      }

      document.body.appendChild(script);
    });
  }

  return loadedScripts[id];
}
