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
export function create2DArray(arr, cols) {
  let result = [];
  for (let i = 0; i < arr.length; i += cols) {
    result.push(arr.slice(i, i + cols));
  }
  return result;
}

export function replaceArrayElements(arr, values, start, end) {
  if (values.length > end - start) {
    console.log("Length of values array should not be greater than pagesize");
    return arr;
  }

  for (let i = start; i < start + values.length; i++) {
    arr[i] = values[i - start];
  }

  return arr;
}
export function isSubArrayNotEmpty(mainArray, startIndex, endIndex) {
  const subArray = mainArray.slice(startIndex, endIndex);

  return subArray.length > 0;
}

export function onTestDelete(arr, id, start, end, pageSize, totalPages) {
  const subArray = arr.slice(start, end);
  const indexToDelete = subArray.findIndex((test) => test._id === id);
  let totalPageNumber;

  if (indexToDelete !== -1) {
    const originalIndex = start + indexToDelete;
    arr.splice(originalIndex, 1);

    // Recalculate total page number based on pageSize after deletion
    totalPageNumber =
      arr.length > (totalPages - 1) * pageSize
        ? Math.ceil((arr.length || 1) / pageSize)
        : totalPages;
  } else {
    totalPageNumber = totalPages;
  }

  return {
    newArray: arr,
    totalPageNumber: totalPageNumber || 1, // Ensure at least 1 page if the array is empty
  };
}

export function onTestAdd(testState, test, pageSize, type) {
  const totalPages = testState.totalPages;

  let tests = testState.tests;
  let myTest = testState.myTest;
  let latest = testState.latest;
  let start = testState.totalPages.alltests - 1;
  let end = start + pageSize;
  if (tests.length != 0 || tests.slice(start, end).length != 0) {
    tests = [...tests, test];

    totalPages.alltests = Math.ceil((tests.length || 1) / pageSize);
  }
  start = testState.totalPages.mytest - 1;
  end = start + pageSize;
  if (myTest.length != 0 || myTest.slice(start, end).length != 0) {
    myTest = [...myTest, test];
    console.log("utils: ", pageSize, myTest.length, totalPages);
    totalPages.mytest = Math.ceil(
      (latest.length || 1) / pageSize > totalPages.mytest
        ? (latest.length || 1) / pageSize
        : totalPages.mytest
    );
    console.log("utils: ", pageSize, tests.length, totalPages);
  }
  start = testState.totalPages.latest - 1;
  end = start + pageSize;
  if (latest.length != 0 || latest.slice(start, end).length != 0) {
    latest = [...latest, test];
    totalPages.latest = Math.ceil((myTest.length || 1) / pageSize);
  }
  console.log("utils: ", totalPages);
  return {
    tests,
    myTest,
    latest,
    totalPages,
  };
}

export function onTestUpdate(id, testState, test) {
  const latest = testState.latest;
  const tests = testState.tests;
  const myTest = testState.myTest;
  for (let i = tests.length - 1; i >= 0; i--) {
    if (tests[i]._id === id) {
      tests[i] = test;
    }
  }
  for (let i = latest.length - 1; i >= 0; i--) {
    if (latest[i]._id === id) {
      latest[i] = test;
    }
  }
  for (let i = myTest.length - 1; i >= 0; i--) {
    if (myTest[i]._id === id) {
      myTest[i] = test;
    }
  }

  return {
    tests,
    myTest,
    latest,
  };
}
