'use strict'

const dateOne = process.argv[2];
const dateTwo = process.argv[3];

const separator = '-';
const daysInMonths = [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const isTheSameYearAndMonth = (dateOne, dateTwo)  =>  dateOne.substr(0,7) === dateTwo.substr(0,7);
const isTheSameYear = (dateOne, dateTwo) => dateOne.substr(0,4) === dateTwo.substr(0,4);

const isSpecialYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0 ) || (year % 400 === 0);
};


const parseDate = (date) => {
    let splittedDate = date.split(separator);
    return {
      year: parseInt(splittedDate[0]),
      month: parseInt(splittedDate[1]),
      day: parseInt(splittedDate[2])
    };
};

const daysUntilEndOfMonth = (date) => {
  let parsedDate = parseDate(date);
  let lastDay = daysInMonths[parsedDate.month];
  if(parsedDate.month === 2 && isSpecialYear(parsedDate.year)) {
    lastDay = 29;
  }

  return Math.max(0, lastDay - parsedDate.day);
}

const calculateDaysBetweenMonths = (monthStart, monthEnd, year) => {
  let totalDays = 0;
  for(let i = monthStart + 1; i < monthEnd; i++) {
    totalDays += daysInMonths[i];
  }

  if(isSpecialYear(year) && monthStart <= 2) {
    totalDays++;
  }
  return totalDays;

};

const calculateBiggerDate = (dateOne, dateTwo) => {
    return {
      endDate: dateOne > dateTwo ? dateOne : dateTwo,
      startDate: dateTwo > dateOne ? dateOne : dateTwo
    };
};




const calculateDateFromDifferentMonths = (dateOne, dateTwo) => {
  let totalDays = 0;
  const orderedDates = calculateBiggerDate(dateOne, dateTwo);

  let parsedStartDate = parseDate(orderedDates.startDate);
  let parsedEndDate = parseDate(orderedDates.endDate);

  totalDays = calculateDaysBetweenMonths(parsedStartDate.month, parsedEndDate.month, parsedEndDate.year);

  totalDays += daysUntilEndOfMonth(orderedDates.startDate);

  totalDays += parsedEndDate.day;
  return totalDays;
};


const calculateDateFromDifferentYearAndMonth = (dateOne, dateTwo) => {

  const calculateDaysFromYears = (yearStart, yearEnd) => {
    let totalDays = 0;
    for(let i = yearStart + 1; i < yearEnd; i++) {
      isSpecialYear(i) ? totalDays += 366 : totalDays += 365;
    }
    return totalDays;
  };

  const calculateUntilEndOfYear = (date) => {
    let totalDays = 0;
    let parsedDate = parseDate(date);

    totalDays += daysUntilEndOfMonth(date);

    totalDays += calculateDaysBetweenMonths(parsedDate.month, 12, parsedDate.year);
    if(parsedDate.month < 12) totalDays += 31;
    return totalDays;
  };

  const calculateFromStartOfYear = (date) => {
    let parsedDate = parseDate(date);
    let totalDays = parsedDate.day;

    for(let i = 0; i < parsedDate.month; i++) {
      totalDays += daysInMonths[i];
    }
    if(isSpecialYear(parsedDate.year) && parsedDate.month > 2) totalDays++;
    return totalDays;
  };

  const orderedDates = calculateBiggerDate(dateOne, dateTwo);

  let parsedStartDate = parseDate(orderedDates.startDate);
  let parsedEndDate = parseDate(orderedDates.endDate);
  let totalDays = calculateUntilEndOfYear(orderedDates.startDate)
    + calculateDaysFromYears(parsedStartDate.year, parsedEndDate.year)
    + calculateFromStartOfYear(orderedDates.endDate);
    return totalDays;
};

const calculateDateFromSameYearAndMonth = (dateOne, dateTwo) => {
  let difference = (parseInt(dateOne.split(separator).join('')) - parseInt(dateTwo.split(separator).join(''))) ;
  return difference > 0 ? difference : difference * -1;
};


const calculate = (dateOne, dateTwo) => {
  if(!dateOne || !dateTwo) {
    return 'Please insert two dates';
  }
  let totalDays = 0;

  if(isTheSameYearAndMonth(dateOne, dateTwo)) {
    totalDays = calculateDateFromSameYearAndMonth(dateOne, dateTwo);
  } else if(isTheSameYear(dateOne, dateTwo)){
    totalDays = calculateDateFromDifferentMonths(dateOne, dateTwo);
  } else {
    totalDays = calculateDateFromDifferentYearAndMonth(dateOne, dateTwo);
  }

  return totalDays -1;  //drop start and end dates
}
const totalDays = calculate(dateOne, dateTwo);
console.log(dateOne, '-',dateTwo,':', totalDays, totalDays > 1 ? 'days' : 'day');
