const Romanizer = require('js-hira-kata-romanize');

export const romanize = (kata) => {
  const r = new Romanizer();
  const roman = r.romanize(kata)
  return roman
}