/**
 * simple uid generator
 *
 * @returns {string}
 */
export function uid() {

  uid._ = uid._ || 0;

  return (uid._++).toString(16);
}

/**
 * hash some string
 *
 * @param str
 * @returns {number}
 */
export function hash(str) {

  let hash = 5381;
  let i = str.length;

  while (i) {

    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  return hash >>> 0;
}