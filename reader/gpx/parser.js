const fs = require("fs");
const xml2js = require("xml2js");
const distFrom = require("distance-from");
const { isArray, get, has, concat, reduce, map } = require("lodash");
const { ngp: calcNGP } = require("../../calc/ngp");
const { pace: calcPace } = require("../../calc/common");

const { IS_RUN, IS_GPX_FILE } = require("../../constants/regex");

const readFiles = (dirName) => {
  const readDirPr = new Promise((resolve, reject) => {
    fs.readdir(dirName, (err, fileNames) =>
      err ? reject(err) : resolve(fileNames)
    );
  });
  return readDirPr.then((fileNames) =>
    Promise.all(
      map(fileNames, (fileName) => {
        // only read .gpx files
        if (IS_GPX_FILE.test(fileName)) {
          return new Promise((resolve, reject) => {
            fs.readFile(dirName + fileName, "utf-8", (err, content) =>
              err ? reject(err) : resolve(content)
            );
          });
        }
      })
    ).catch((error) => Promise.reject(error))
  );
};

const isRunning = (trk) => {
  if (!isArray(trk))
    throw Error("Please ensure the .gpx file has at least one 'trk'.");
  const track = trk[0];
  return has(track, "type")
    ? IS_RUN.test(get(track, "type"))
    : IS_RUN.test(get(track, "name"));
};

const getTimestamp = (n) => {
  const date = get(n, "time.0", 0);
  return new Date(date).getTime();
};

const getLocation = (n) => {
  const lat = get(n, "$.lat");
  const lon = get(n, "$.lon");
  return lat && lon ? [lat, lon] : undefined;
};

const reduceIntervals = (acc, curr) => {
  const totalDist = get(acc, "totalDist", 0); // km
  const totalTime = get(acc, "totalTime", 0); // ms
  const prev = get(acc, "prev");
  const currTime = getTimestamp(curr);
  const elapsed = prev ? currTime - getTimestamp(prev) : 0;
  const dist = prev
    ? distFrom(getLocation(prev)).to(getLocation(curr)).distance.v
    : 0;
  const pace = calcPace(dist, elapsed);
  const interval = calcNGP(prev, curr, {
    ...curr,
    dist,
    elapsed,
    currTime,
    pace,
  });
  const newAcc = {
    ...acc,
    prev: curr,
    totalDist: totalDist ? totalDist + dist : 0,
    totalTime: totalTime ? totalTime + elapsed : elapsed,
    intervals: concat(get(acc, "intervals", []), [interval]),
  };
  return newAcc;
};

const makeTracks = (data) => {
  const tracks = get(data, "gpx.trk");
  const trkSegments = get(tracks, "0.trkseg");
  const trkPoints = get(trkSegments, "0.trkpt");
  return reduce(trkPoints, reduceIntervals, {});
};

const parseGpx = async (directoryPath) => {
  try {
    const files = [];
    const allContents = await readFiles(directoryPath);

    for (const data of allContents) {
      if (!data) continue;
      const json = await xml2js.parseStringPromise(data);
      // only store running data
      if (isRunning(json.gpx.trk)) {
        files.push(makeTracks(json));
      }
    }
    return files;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  parseGpx,
};
