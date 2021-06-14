'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Hossam Mohamed',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-06-08T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-06-14T10:01:17.194Z',
    '2021-06-11T23:36:17.929Z',
    '2021-06-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Mahmoud Ali',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const logo = document.querySelector('.logo');

let currentAccount = accounts.find(acc => acc === inputLoginUsername.value);

const option = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};
function getTime() {
  const now = new Date();
  labelDate.textContent = new Intl.DateTimeFormat('en-US', option).format(now);
}
setInterval(() => getTime(), 1000);

// const local = navigator.language;
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hours = `${now.getHours()}`.padStart(2, 0);
// const mins = `${now.getMinutes()}`.padStart(2, 0);
// const seconds = `${now.getSeconds()}`.padStart(2, 0);

// format date to 1,2,3 days ago format
function updateUi(acc) {
  displayMovements(acc);
  calcBalance(acc);
  calcSummary(acc);
}
const formatDate = function (date) {
  const dayPassed = (date1, date2) =>
    Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
  const days = dayPassed(new Date(), date);

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  console.log(days);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days <= 7) return `${days} days ago`;

  return new Intl.DateTimeFormat('en-US').format(date);
};
// display movs

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = '';
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date);
    // const formatNum = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div className="movements__date">${displayDate}</div>

        <div class="movements__value">${formatNum(mov, currentAccount)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
function formatNum(num, acc) {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(num);
}
//
//create usernames
function createUsers(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}
createUsers(accounts);
console.log(accounts);
const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => {
    return acc + curr;
  });
  labelBalance.textContent = `${formatNum(acc.balance, currentAccount)}`;
};
const calcSummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => {
      return acc + curr;
    });
  labelSumIn.textContent = `${formatNum(income, currentAccount)}`;
  const outCome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => {
      return acc + curr;
    });
  labelSumOut.textContent = `${formatNum(Math.abs(outCome), currentAccount)}`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * currentAccount.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, curr) => acc + curr);
  labelSumInterest.textContent = `${formatNum(interest, currentAccount)}`;
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome ${currentAccount.owner}`;
    //
    containerApp.style.opacity = '1';
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUi(currentAccount);
    // displayMovements(currentAccount);
    // calcBalance(currentAccount);
    // calcSummary(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const accRecive = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, accRecive);
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    accRecive?.username !== currentAccount.username
  ) {
    // make transfer
    document.body.style.backgroundColor = 'rgb(102, 255, 51)';

    setTimeout(() => (document.body.style.backgroundColor = '#f3f3f3'), 800);
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    accRecive.movementsDates.push(new Date().toISOString());
    accRecive.movements.push(amount);

    //
    console.log(currentAccount);
    updateUi(currentAccount);

    // displayMovements(currentAccount);
    // calcBalance(currentAccount);
    // calcSummary(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    document.body.style.backgroundColor = 'red';

    setTimeout(() => (document.body.style.backgroundColor = '#f3f3f3'), 500);
    containerApp.style.opacity = '0';
    inputCloseUsername.value = inputClosePin.value = '';

    console.log(accounts);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    document.body.style.backgroundColor = '#B2DAF0';

    setTimeout(() => (document.body.style.backgroundColor = '#f3f3f3'), 800);
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUi(currentAccount);
    // displayMovements(currentAccount);
    // calcBalance(currentAccount);
    // calcSummary(currentAccount);
    inputLoanAmount.value = '';
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  console.log(sorted);
});
function currentTime() {
  const time = new Date();
  labelTimer.textContent = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(time);
}
setInterval(() => currentTime(), 1000);

// const logo = document.querySelector('.logo');
// setInterval(
//   () =>
//     (logo.style.transform = `translateY(${Math.trunc(Math.random() * 500)}px)`),

//   800
// );
// setInterval(
//   () =>
//     (logo.style.transform = `translateX(${Math.trunc(Math.random() * 500)}px)`),

//   1000
// );
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// const kateData1 = [4, 1, 15, 8, 3];
// //
// const juliaData2 = [9, 16, 6, 8, 3];
// const kateData2 = [10, 5, 6, 1, 4];

// const checkDogs = function (kateData, juliaData) {
//   const JuliaDataCopy = juliaData.slice();
//   const correctJuliaData = JuliaDataCopy.slice(1, 3);
//   console.log(correctJuliaData);
//   const allData = correctJuliaData.concat(kateData);
//   allData.forEach((age, i) => {
//     const type =
//       age > 3
//         ? `Dog number ${i + 1} is an adult, and is ${age} years old`
//         : `Dog number ${i + 1} is still a puppy`;
//     console.log(type);
//   });
// };
// checkDogs(kateData1, juliaData1);
// console.log('---------');
// checkDogs(kateData2, juliaData2);
// const calc = juliaData1.map((value, key) => (value = value * (key + 4)));
// console.log(calc);
// const juliaData1 = [3, 5, -2, -12, 7];
// const movementss = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const newArr = movementss.reduce((acc, current) => {
//   if (acc < current) {
//     return acc;
//   } else {
//     return current;
//   }
// }, movementss[0]);
// console.log(`${newArr} $`);
// Data 1: [5, 2, 4, 1, 15, 8, 3]
// Data 2: [16, 6, 10, 5, 6, 1, 4]
// const calcAverageHumanAge = function (dogsAge11) {
//   const filter1 = dogsAge11
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(dog => dog > 18);
//   const average = filter1.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   console.log(filter1);
//   console.log(average);
// };
// const dogsAge22 = [16, 6, 10, 5, 6, 1, 4];
// calcAverageHumanAge(dogsAge11);
// calcAverageHumanAge(dogsAge22);
// var acc1 = -1;
// var __FOUND = -1;
// for (var i = 0; i < accounts.length; i++) {
//   if (accounts[i].owner == 'Jessica Davis') {
//     // __FOUND is set to the index of the element
//     __FOUND = accounts[i];
//     break;
//   }
// }
// console.log(__FOUND); //

// for (const [i] of accounts.entries()) {
//   if (accounts[i].owner === 'Jessica Davis') {
//     console.log(accounts[i]);
//   }
// }
// const acc = accounts.find(acc1 => acc1.owner === 'Jessica Davis');
// console.log(acc);
// const dogsAge11 = [5, 2, 4, 1, 15, 8, 3];
// const index = dogsAge11.findIndex(dog => (dog = 8));
// console.log(index);
// labelBalance.addEventListener('click', function () {
//   const arr = Array.from(document.querySelectorAll('.movements__value'), el =>
//     Number(el.textContent.replace('€', ''))
//   );
//   arr.sort((a, b) => b - a);
//   console.log(arr);
// });
// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => +el.textContent.replace('€', '')
//   );
//   console.log(movementsUI);
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// });
// console.log(8 ** (1 / 3));
// //  من 1 الي عشره ولما نزود المينمام نامبر هيخلي الرقم من 10 ل 20
// const ran = (max, min) => Math.trunc(Math.random() * 10 + 10);

// console.log(ran(20, 10));
// console.log(new Date(account1.movementsDates[0]));
// function sayHi() {
//   console.log('Hello');
// }

// setTimeout(sayHi, 1000);
