'use strict';

const getStartDateValue = () => {
  const startDate = document.getElementById('start-date');

  return new Date(startDate.value);
};

const getEndDateValue = () => {
  const endDate = document.getElementById('end-date');

  return new Date(endDate.value);
};

const removeAttrDisabled = () => {
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');

  const setDisabledState = (disabled) => {
    endDate.disabled = disabled;
  };

  const updateDisabledState = () => {
    if (startDate.value) {
      setDisabledState(false);
    } else {
      setDisabledState(true);
    }
  };

  startDate.addEventListener('change', updateDisabledState);
  updateDisabledState();
};

const stopChooseDatesBeforeEndDate = () => {
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');

  startDateInput.addEventListener('change', function() {
    const startDateValue = startDateInput.value;

    endDateInput.min = startDateValue;

    // Перевіряємо, чи обрана дата в полі "end-date" більше за дату в полі "start-date".
    // Якщо так, то оновлюємо значення поля "end-date".
    if (endDateInput.value < startDateValue) {
      endDateInput.value = startDateValue;
    }
  });
}

const checkEndDate = () => {
  const startDateValue = getStartDateValue();
  const endDateValue = getEndDateValue();
  const startDate = new Date(startDateValue);
  const endDate = new Date(endDateValue);

  if (startDate > endDate) {
    const endDateDiv = document.getElementById('item-end');

    endDateDiv.classList.add('warning');

    // Додаємо ще span з текстом для валідації
    const warningText = document.createElement('span');
    warningText.textContent = "Invalid date!";
    warningText.classList.add('warning-text');
    endDateDiv.appendChild(warningText);
  }
};

const setDatesAtInputs = () => {
  const startDateDiv = document.getElementById('item-start');
  const startDateInput = document.getElementById('start-date');
  const endDateDiv = document.getElementById('item-end');
  const endDateInput = document.getElementById('end-date');

  if (!startDateInput.value) {
    startDateDiv.classList.add('warning');

    // Додаємо ще span з текстом для валідації
    const warningText = document.createElement('span');
    warningText.textContent = "Please, choose start date!";
    warningText.classList.add('warning-text');
    startDateDiv.appendChild(warningText);
  } else if (!endDateInput.value) {
    endDateDiv.classList.add('warning');

    // Додаємо ще span з текстом для валідації
    const warningText = document.createElement('span');
    warningText.textContent = "Please, choose end date!";
    warningText.classList.add('warning-text');
    endDateDiv.appendChild(warningText);
  } else {
    startDateDiv.classList.remove('warning');
    endDateDiv.classList.remove('warning');

    // Видаляємо span з текстом, якщо він існує
    const existingWarningTextFirstInput = startDateDiv.querySelector('.warning-text');
    const existingWarningTextSecondInput = endDateDiv.querySelector('.warning-text');

    if (existingWarningTextFirstInput) {
      existingWarningTextFirstInput.remove();
    }

    if (existingWarningTextSecondInput) {
      existingWarningTextSecondInput.remove();
    }
  }
};

const addPresetSelectFunctionality = () => {
  const endDateInput = document.getElementById('end-date');
  const presetSelect = document.getElementById('preset-select');

  presetSelect.addEventListener('change', function() {
    const startDateValue = getStartDateValue();
    
    if (startDateValue) {
      const startDate = new Date(startDateValue);
      let endDate;

      switch (presetSelect.value) {
        case 'week':
          endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          endDate = new Date(startDate.getTime());
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        default:
          return;
      }

      const formattedEndDate = endDate.toISOString().slice(0, 10);
      endDateInput.value = formattedEndDate;
    } else {
      // Обробити випадок, коли дата початку не вибрана
      endDateInput.value = '';
      console.error("Please, choose a start date first!");
    }
  });
};

const calculateTypeOfDays = (startDate, endDate, type) => {
  const oneDay = 24 * 60 * 60 * 1000;
  let currentDay = new Date(startDate);
  let count = { weekdays: 0, weekends: 0, alldays: 0 };

  while (currentDay <= endDate) {
    const dayOfWeek = currentDay.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      count.weekends++;
    } else {
      count.weekdays++;
    }
    count.alldays++;
    currentDay = new Date(currentDay.getTime() + oneDay);
  }

  return count[type] || 0;
};

const durationBetweenDates = (dateFrom = new Date('31 Jan 2022'), dateTo = new Date(), dimension = 'days') => {
  const startDateValue = getStartDateValue();
  const endDateValue = getEndDateValue();
  const start = new Date(startDateValue);
  const end = new Date(endDateValue);

  // Перевіряємо чи дійсно в змінних буде дата, щоби уникнути помилок
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return console.error("Invalid date: Please, choose both dates to calculate duration between dates!");
  }

  const durationInSeconds = Math.ceil(Math.abs(end.getTime() - start.getTime()) / 1000);
  const durationInMinutes = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60));
  const durationInHours = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60));
  const durationInDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  switch (dimension) {
    case 'days':
      return `${durationInDays} days`;
    case 'hours':
      return `${durationInHours} hours`;
    case 'minutes':
      return `${durationInMinutes} minutes`;
    case 'seconds':
      return `${durationInSeconds} seconds`;
    default:
      return "Invalid dimension";
  }
};

const initDurationBetweenDates = () => {
  const startDateValue = getStartDateValue();
  const endDateValue = getEndDateValue();
  const start = new Date(startDateValue);
  const end = new Date(endDateValue);

  const checkboxes1 = ['days', 'hours', 'minutes', 'seconds'];
  const checkboxes2 = ['weekdays', 'weekends', 'alldays'];
  let result = '';

  // Перевірка обраних чекбоксів та розрахунок тривалості
  checkboxes1.forEach(checkboxId => {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox.checked) {
      const duration = durationBetweenDates(undefined, undefined, checkboxId);
      result += `${duration}\n`;
    }
  });

  checkboxes2.forEach(checkboxId => {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox.checked) {
      const duration = calculateTypeOfDays(start, end, checkboxId);
      result += `${duration} ${checkboxId}\n`;
    }
  });

  const startDate = new Date(getStartDateValue());
  const endDate = new Date(getEndDateValue());
  const resultArea = document.getElementById('result-area');
  const activeCheckbox = document.querySelector(".duration-types__item input:checked");

  if (activeCheckbox) {
    resultArea.textContent = result;
  } else if (startDate > endDate) {
    console.error("The end date can't be earlier than the start date!");
  } else if (startDate < endDate) {
    console.error("Please, choose any type of duration!");
  }
};

const saveDataToLocalStorage = () => {
  // Збереження результату у локальне сховище
  const startDateValue = getStartDateValue();
  const endDateValue = getEndDateValue();
  const resultArea = document.getElementById('result-area');
  const result = resultArea.textContent;

  if (isNaN(startDateValue.getTime()) || isNaN(endDateValue.getTime())) {
    console.error('Invalid date: Please, choose both dates to calculate duration between dates!');
    return;
  }

  const startDate = startDateValue.toISOString().slice(0, 10);
  const endDate = endDateValue.toISOString().slice(0, 10);

  // Отримання попередньо збережених результатів з локального сховища
  let savedResults = localStorage.getItem('savedResults');
  if (!savedResults) {
    savedResults = [];
  } else {
    savedResults = JSON.parse(savedResults);
  }

  // Додавання нового результату до списку
  const newResult = {
    startDate: startDate,
    endDate: endDate,
    result: result
  };
  savedResults.push(newResult);

  // Збереження останніх 10 результатів у локальне сховище
  if (savedResults.length > 10) {
    savedResults = savedResults.slice(-10);
  }
  localStorage.setItem('savedResults', JSON.stringify(savedResults));
};

const renderDataFromLocalStorage = () => {
  const showDataElement = document.getElementById('show-localstorage-data');
  const savedResults = localStorage.getItem('savedResults');

  // Перевірка, чи є збережені результати
  if (savedResults) {
    const resultsArray = JSON.parse(savedResults);

    // Створення HTML-рядка для виведення кожного результату
    const resultsHTML = resultsArray.map(result => {
      return `<div class="data-output__items">
                <p class="data-output__start">Start Date: ${result.startDate}</p>
                <p class="data-output__end">End Date: ${result.endDate}</p>
                <p class="data-output__result">Result: ${result.result}</p>
              </div>`;
    }).join('');

    showDataElement.innerHTML = resultsHTML;
  } else {
    showDataElement.innerHTML = '<p>No saved results found.</p>';
  }
}

const initCalculateDuration = () => {
  const trigger = document.querySelector('.form-control__btn');

  removeAttrDisabled();
  stopChooseDatesBeforeEndDate();
  addPresetSelectFunctionality();

  trigger.addEventListener('click', function () {
    // Перевірка, чи обрані дати
    setDatesAtInputs();

    // Перевірка, чи дата з другого інпуту не раніше дати з першого інпуту
    checkEndDate();

    // Розрахунок днів, часів, мінут, секунд 
    initDurationBetweenDates();

    // Збереження у локальному сховищі останніх 10 результатів, які рахував юзер на сторінці в додатку
    saveDataToLocalStorage();

    // Виведення данних з LocalStorage на сторінку
    renderDataFromLocalStorage();
  });
};

initCalculateDuration();