module.exports = function(userData, originalData) {
  let difference = 0;
  let len = Math.min(userData.length, originalData.length);

  const originalAverage = getAverage(originalData);
  const userAverage = getAverage(userData);

  const originalStd = std(originalData, originalAverage);
  const userStd = std(userData, userAverage);

  for (i = 1; i < len; i++) {
    current_difference = verifyDelta(userData[i].audioData, originalData[i].audioData, 0.128, userStd, originalStd);
    if (current_difference) {
      difference += current_difference;
    }
  }
  return (difference / len) * 100;
}

const absDifference = (arr1, arr2, userAvg, originalAvg) => {
  let res = 0;
  for(let i = 0; i < arr1.length; i++){
    user = arr1[i] / userAvg;
    orig = arr2[i] / originalAvg;
    const el = Math.abs((user || 0) - (orig || 0));
    res += el;
  };
  return res / arr1.length;
};

const getAverage = (data) => {
  let res = 0;
  for (i = 1; i < data.length; i++) {
    let curr = 0;
    data[i].audioData.forEach((val) => {
      curr += val;
    });
    res += (curr / data[i].audioData.length);
  }
 return res / data.length;
}

const verifyDelta = (arr1, arr2, delta, userAvg, originalAvg) => {
  let res = 0;
  for(let i = 0; i < arr1.length; i++){
    user = arr1[i] / userAvg;
    orig = arr2[i] / originalAvg;
    if (Math.abs((user || 0) - (orig || 0)) <= delta) {
      res += 1
    }
  };
  return res / arr1.length;
}

const std = (arr, avg) => {
  let res = 0;
  for(let i = 1; i < arr.length; i++){
    let curr = 0;
    arr[i].audioData.forEach((val) => {
      curr += Math.pow(val - avg, 2);
    })
    res += curr;
  };
  const N = arr.length * arr[1].audioData.length;
  return Math.sqrt(res / N);
}
