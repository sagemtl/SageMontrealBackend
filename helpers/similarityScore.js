module.exports = function(userData, originalData) {
  let difference = 0;
  let len = Math.min(userData.length, originalData.length);

  const userDataExtremes = {min: getMin(userData), max: getMax(userData)};
  const origDataExtremes = {min: getMin(originalData), max: getMax(originalData)};

  for (i = 1; i < len; i++) {
    current_difference = verifyDelta(userData[i].audioData, originalData[i].audioData, 0.02, userDataExtremes, origDataExtremes);

    if (current_difference) {
      difference += current_difference;
    }
  }

  return difference / len;
}

const verifyDelta = (userArr, origArr, delta, userDataExtremes, origDataExtremes) => {
  let res = 0;
  const arr1 = normalize(userArr, userDataExtremes);
  const arr2 = normalize(origArr, origDataExtremes);

  for(let i = 0; i < arr1.length; i++) {
    const user = arr1[i];
    const orig = arr2[i];
    if (Math.abs((user || 0) - (orig || 0)) <= delta) {
      res += 1;
    }
  };
  return res / arr1.length;
}

const normalize = (arr, dataExtremes) => {
  const maxVal = dataExtremes.max;
  const minVal = dataExtremes.min;

  return arr.map((el) => maxVal === minVal ? 0.5 : (el - minVal) / (maxVal - minVal));
}

const getMin = (arr) => {
  const minVals = arr.map((el) => Math.min(...el.audioData));
  return Math.min(...minVals);
}

const getMax = (arr) => {
  const maxVals = arr.map((el) => Math.max(...el.audioData));
  return Math.max(...maxVals);
}

const scoreModifier = (score) => {
  return 2.5 * score ^ 2 * 100;
}
