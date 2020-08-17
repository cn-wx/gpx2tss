const { get } = require("lodash");

const { radianToDegrees } = require("./common");

const grade = (start, end, dist) => {
  if (dist === 0) return 0;
  const eleChange = end - start;
  const radian = Math.atan(eleChange / (dist * 1000));
  return radianToDegrees(radian);
};

const getEle = (n) => {
  return get(n, "ele.0");
};

const inclinePace = (pace, grade) => {
  const coef = 0.033;
  return pace / (1 + coef * grade);
};

const declinePace = (pace, grade) => {
  const coef = 0.01815;
  return pace / (1 + coef * grade);
};

/**
 * Calculate the Normalized Graded Pace of two intervals.
 */
const ngp = (prev, curr, interval) => {
  const prevEle = getEle(prev);
  const currEle = getEle(curr);
  const g = grade(prevEle, currEle, get(interval, "dist"));
  return {
    ...interval,
    ngp:
      g > 0
        ? inclinePace(get(interval, "pace"), g)
        : declinePace(get(interval, "pace"), g),
  };
};

module.exports = {
  ngp,
};
