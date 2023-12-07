export const getDefinedElemenentCount = (array) => {
  const count = array.filter(function (value) {
    if (value) {
      return value.selectedOption ? true : false;
    } else {
      return false;
    }
  }).length;
  return count;
};
export const visitedQuestion = (array) => {
  const count = array.filter((val) => val !== undefined).length;
  return count;
};

export const analytics = (answers, test) => {
  // analyse the data
  // get total question length
  const totalQuestions = test.questions.length;
  // get no correct wrong and attempted questions
  let wrong = 0;
  let correct = 0;
  const solutions = [];
  let count = 0;
  for (let answer of answers) {
    if (answer) {
      if (answer.selectedOption && answer.correctAnswer) {
        if (answer.selectedOption === answer.correctAnswer) {
          correct = correct + 1;
          solutions[count] = 1;
        } else {
          wrong = wrong + 1;
          solutions[count] = 0;
        }
      }
    }
    count++;
  }
  const attempted = correct + wrong;
  const accuracy =
    attempted === 0 ? 0 : Math.round((correct * 100 * 100) / attempted) / 100;
  return { correct, wrong, attempted, accuracy, totalQuestions, solutions };
};

const getNewNumber = (number) => {
  const arr = [];
  for (let i = 0; i < number; i++) {
    while (true) {
      // generate new number
      const rndInt = Math.floor(Math.random() * number);
      // check if the number is already generated
      if (!arr.includes(rndInt)) {
        arr.push(rndInt);
        break;
      }
    }
  }
  return arr;
};

export const getNewArray = (array) => {
  const newArray = [];
  const number = array.length;
  const newArrayIndex = getNewNumber(number);
  for (let i = 0; i < number; i++) {
    newArray[i] = array[newArrayIndex[i]];
  }

  return newArray;
};

export function toSentenceCase(sentence) {
  // Split the sentence into an array of words
  let words = sentence.toLowerCase().split(" ");

  // Capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Join the words back into a sentence
  let sentenceCase = words.join(" ");

  // Capitalize the first letter of the sentence
  return sentenceCase.charAt(0).toUpperCase() + sentenceCase.slice(1);
}
