const { get, reduce } = require("lodash");

const avgGap = (intervals) =>
  reduce(intervals, (acc, cur) => acc + get(cur, "ngp"), 0) / intervals.length;

/**
 * Calculate the running Training Stress Score through .gpx file
 */
const rTss = (data, ftp) => {
  const intervals = get(data, "intervals");
  const ngp = avgGap(intervals);
  if (ngp === 0) return 0;
  const seconds = get(data, "totalTime") / 1000;
  const squaredInf = (ftp / ngp) ** 2;
  return squaredInf * 100 * (seconds / 3600);
};

module.exports = {
  rTss,
};
