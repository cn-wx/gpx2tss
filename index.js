const { parseGpx } = require("./reader/gpx/parser");
const { rTss: calcrTSS } = require("./calc/rTss");
const { DIRECTORY_PATH } = require("./constants/path");

/**
 * HOW TO USE
 *
 * 1. place gpx files under "resources/examples"
 * 2. input: Functional Threshold Power
 * 3. run `node index.js`
 */
const FTP = 5.19;

(async () => {
  // read all .gpx files in the directory and convert them into useful data structure
  const files = (await parseGpx(DIRECTORY_PATH)) || [];
  // for each file's data, calculate the running TSS
  for (const data of files) {
    const rTss = calcrTSS(data, FTP);
    console.log("rTss: ", rTss);
  }
})();
