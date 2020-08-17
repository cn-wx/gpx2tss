const radianToDegrees = (radians) => {
  const pi = Math.PI;
  return radians * (180 / pi);
};

const pace = (km, ms) => {
  const min = ms / (1000 * 60);
  return km === 0 ? 0 : min / km;
};

module.exports = {
  radianToDegrees,
  pace,
};
