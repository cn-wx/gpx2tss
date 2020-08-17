# gpx2tss

## Description

This project aims to converting GPX training stats exported from Garmin to Training Stress Score.

The first version of this project converts [loadmon](https://github.com/comamitc/loadmon) from Clojure to JavaScript.

## To-do list

- [x] Convert Clojure to JavaScript.
- [ ] Apply new TSS calculation algorithm (Power-based).
- [ ] Frontend application.
- [ ] Garmin Health API integration.

## How to use

1. Install dependencies by running `npm install`.
2. place Garmin exported `.gpx` files under `resources/examples`.
3. modify your Functional Threshold Power in `index.js`.
4. run `node index.js` in your terminal to see your running Trainig Stress Score (rTSS).

## References

[1]. https://github.com/comamitc/loadmon

[2]. Bike and run pacing on downhill segments predict Ironman triathlon
relative success

## License
This project is under [MIT](https://github.com/cn-wx/gpx2tss/blob/master/LICENSE) license.
