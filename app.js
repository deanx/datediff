'use strict'
const dateOne = process.argv[2];
const dateTwo = process.argv[3];

const separator = '-';
const daysInMonths = [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let isTheSameYearAndMonth = (dateOne, dateTwo)  =>  dateOne.substr(0,7) === dateTwo.substr(0,7);
let isTheSameYear = (dateOne, dateTwo) => dateOne.substr(0,4) === dateTwo.substr(0,4);

let isSpecialYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0 ) || (year % 400 === 0);
};


let parseDate = (date) => {
    let splittedDate = date.split(separator);
    return {
      year: parseInt(splittedDate[0]),
      month: parseInt(splittedDate[1]),
      day: parseInt(splittedDate[2])
    };
};

let daysUntilEndOfMonth = (date) => {
  let parsedDate = parseDate(date);
  let lastDay = daysInMonths[parsedDate.month];
  if(parsedDate.month === 2 && isSpecialYear(parsedDate.year)) {
    lastDay = 29;
  }

  return Math.max(0, lastDay - parsedDate.day);
}

let calculateDaysBetweenMonths = (monthStart, monthEnd, year) => {
  let totalDays = 0;
  for(let i = monthStart + 1; i < monthEnd; i++) {
    totalDays += daysInMonths[i];
  }

  if(isSpecialYear(year)) {
    totalDays++;
  }
  return totalDays;

};

let calculateBiggerDate = (dateOne, dateTwo) => {
    return {
      endDate: dateOne > dateTwo ? dateOne : dateTwo,
      startDate: dateTwo > dateOne ? dateOne : dateTwo
    };
};

let calculateDateFromDifferentMonths = (dateOne, dateTwo) => {
  let totalDays = 0;
  const orderedDates = calculateBiggerDate(dateOne, dateTwo);

  let parsedStartDate = parseDate(orderedDates.startDate);
  let parsedEndDate = parseDate(orderedDates.endDate );

  totalDays = calculateDaysBetweenMonths(parsedStartDate.month, parsedEndDate.month, parsedEndDate.year);

  totalDays += daysUntilEndOfMonth(orderedDates.startDate);

  totalDays += parsedEndDate.day;
  return totalDays;
}


let calculateDateFromDifferentYearAndMonth = (dateOne, dateTwo) => {

  const calculateDaysFromYears = (yearStart, yearEnd) => {
    let totalDays = 0;
    for(let i = yearStart + 1; i < yearEnd; i++) {
      isSpecialYear(i) ? totalDays += 366 : totalDays += 365;
    }

    return totalDays;
  };

  const orderedDates = calculateBiggerDate(dateOne, dateTwo);

  let parsedStartDate = parseDate(orderedDates.startDate);
  let parsedEndDate = parseDate(orderedDates.endDate);

  return calculateDaysFromYears(parsedStartDate.year, parsedEndDate.year);
};

let calculateDateFromSameYearAndMonth = (dateOne, dateTwo) => {
  let difference = (parseInt(dateOne.split(separator).join('')) - parseInt(dateTwo.split(separator).join(''))) -1;
  return difference > 0 ? difference : difference * -1;
};


const calculate = (dateOne, dateTwo) => {
  let totalDays = 0;

  if(isTheSameYearAndMonth(dateOne, dateTwo)) {
    totalDays = calculateDateFromSameYearAndMonth(dateOne, dateTwo);
  } else if(isTheSameYear(dateOne, dateTwo)){
    totalDays = calculateDateFromDifferentMonths(dateOne, dateTwo);
  }

  return totalDays -2;  //drop start and end dates
}

console.log(calculate(dateOne, dateTwo));
