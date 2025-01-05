export const differenceOfArrays = (submittedAttempts, currentSubmission) => {
  return [...submittedAttempts].filter((x) => !currentSubmission.includes(x));
};

export const checkIfCorrect = (currentSubmission) => {
  const levelCount = {};

  // Count occurrences of each level
  for (const submission of currentSubmission) {
    const level = submission.level;
    levelCount[level] = (levelCount[level] || 0) + 1;
  }

  // Find the maximum frequency and the corresponding level
  let maxFrequency = 0;
  let levelWithMaxFrequency = null;

  for (const [level, count] of Object.entries(levelCount)) {
    if (count > maxFrequency) {
      maxFrequency = count;
      levelWithMaxFrequency = parseInt(level, 10); // Ensure level is returned as a number
    }
  }

  const isCorrect = maxFrequency === 4;
  const isOneGuessAway = maxFrequency === 3;

  return {
    isCorrect: isCorrect,
    isOneGuessAway: isOneGuessAway,
    level: isCorrect ? levelWithMaxFrequency : null, // Return level if condition met
  };
};

export const checkAlreadySubmitted = (submittedAttempts, currentSubmission) => {
  for (let i = 0; i < submittedAttempts.length; i++) {
    if (
      differenceOfArrays(submittedAttempts[i], currentSubmission).length === 0
    )
      return true;
  }

  return false;
};

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

export const emojiTiles= ["🟩", "🟨", "🟪", "🟦"];
