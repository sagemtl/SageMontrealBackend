module.exports = function(userData, originalData) {
  let score = 0;
  let len = userData.length;
  const count = {user: [0,0,0], orig: [0,0,0]};

  let userPtr = 1;
  let originalPtr = 1;

  while (userPtr < len) {

    let currTimeDiff = Math.abs(originalData[originalPtr].audioTime - userData[userPtr].audioTime);

    while (originalPtr + 1 < originalData.length && 
      currTimeDiff >= Math.abs(originalData[originalPtr + 1].audioTime - userData[userPtr].audioTime)) {
        originalPtr ++;
        currTimeDiff = Math.abs(originalData[originalPtr].audioTime - userData[userPtr].audioTime);
      }

    const current_score = verifyDelta(userData[userPtr].audioData, originalData[originalPtr].audioData,count);
    score += current_score;
    userPtr ++;
  }
  console.log(count);
  return scoreModifier(score / len) * 100;
}

const verifyDelta = (userArr, origArr, count) => {
  
  const userPitch = getPitchLevel(userArr);
  const origPitch = getPitchLevel(origArr);
  count.user[userPitch] ++;
  count.orig[origPitch] ++;

  return (userPitch === origPitch) ? 1 : 0;
}

// Pitch Rule:

// 0 = silence
// 1 = low voice
// 2 = high voice

const getPitchLevel = (wave) => {
  let mse = meanSquaredDifference(wave);
  
  if (mse <= 1) {
    return 0;
  }
  else if (mse <= 20) {
    return 1;
  }
  else {
    return 2;
  }
}

const meanSquaredDifference = (arr) => {
  let error = 0;
	for (let i = 0; i < arr.length; i++) {
		error += Math.pow((arr[i] - 128), 2);
	}
	return error / arr.length;
};


const scoreModifier = (score) => {

  if (score <= 0.5427){
    return 2 * Math.pow(score, 2);
  }

  return Math.min(1, 1.5 * (score - 0.15));
}