'use strict';

const getStartDateValue = () => {
  const startDate = document.getElementById('start-date');
  const startDateValue = new Date(startDate.value);

  return startDateValue;
};

const getEndDateValue = () => {
  const endDate = document.getElementById('end-date');
  const endDateValue = new Date(endDate.value);

  return endDateValue;
};

const removeAttrDisabled = () => {
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const presetSelect = document.getElementById('preset-select');

  const setDisabledState = (disabled) => {
    presetSelect.disabled = disabled;
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

const checkEndDate = () => {
  const resultArea = document.getElementById('result-area');
  if (getStartDateValue() > getEndDateValue()) {
    resultArea.innerHTML = "The end date can't be earlier of start date!";
    return;
  }
};

const setDatesAtInputs = () => {
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const resultArea = document.getElementById('result-area');

  if (!startDate.value) {
    resultArea.textContent = "Please, choose date in first input!";
  } else if (!endDate.value) {
    resultArea.textContent = "Please, choose date in second input!";
  } else if (startDate.value && endDate.value) {
    resultArea.textContent = "";
  }
};

const addPresetSelectFunctionality = () => {
  const presetSelect = document.getElementById('preset-select');
  const resultArea = document.getElementById('result-area');
  const startDateValue = getStartDateValue();
  const startDate = new Date(startDateValue);
  let endDate;

  presetSelect.addEventListener('change', function() {
    if (presetSelect.value === 'week') {
      endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      resultArea.textContent = "Duration in week between dates From and To";
    } else if (presetSelect.value === 'month') {
      endDate = new Date(startDate.getTime());
      endDate.setMonth(endDate.getMonth() + 1);
      resultArea.textContent = "Duration in month between dates From and To";
    } else if (presetSelect.value === 'all') {
      endDate = new Date(startDate.getTime());
      endDate.setFullYear(endDate.getFullYear() + 1);
      resultArea.textContent = "Duration for all days between dates From and To";
    }
  
    const endDateInput = document.getElementById('end-date');
    endDateInput.value = endDate.toISOString().split('T')[0];
  });
};

const durationBetweenDates = (dateFrom = new Date('31 Jan 2022'), dateTo = new Date(), dimension = 'days') => {
  const startDateValue = getStartDateValue();
  const endDateValue = getEndDateValue();
  const start = new Date(startDateValue);
  const end = new Date(endDateValue);

  // Перевіряємо чи дійсно в змінних буде дата, щоби уникнути помилок
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "Invalid date";
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
      return 'Invalid dimension';
  }
};

const initDurationBetweenDates = () => {
  const daysCheckbox = document.getElementById('days');
  const hoursCheckbox = document.getElementById('hours');
  const minutesCheckbox = document.getElementById('minutes');
  const secondsCheckbox = document.getElementById('seconds');

  // Перевірка обраних чекбоксів та розрахунок тривалості
  let result = "";
  if (daysCheckbox.checked) {
    const days = durationBetweenDates(undefined, undefined, 'days');
    result += `${days}\n`;
  }
  if (hoursCheckbox.checked) {
    const hours = durationBetweenDates(undefined, undefined, 'hours');
    result += `${hours}\n`;
  }
  if (minutesCheckbox.checked) {
    const minutes = durationBetweenDates(undefined, undefined, 'minutes');
    result += `${minutes}\n`;
  }
  if (secondsCheckbox.checked) {
    const seconds = durationBetweenDates(undefined, undefined, 'seconds');
    result += `${seconds}\n`;
  }

  const resultArea = document.getElementById('result-area');
  resultArea.value = result;
};

const initCalculateDuration = () => {
  const trigger = document.querySelector('.form-control__btn');

  removeAttrDisabled();

  trigger.addEventListener('click', function () {
    // Перевірка, чи обрані дати
    setDatesAtInputs();

    // Перевірка, чи дата з другого інпуту не раніше дати з першого інпуту
    checkEndDate();

    // Вмбір проміжку часу 'week' або 'month' або 'all days'
    addPresetSelectFunctionality();

    // Розрахунок днів, часів, мінут, секунд 
    initDurationBetweenDates();
  });
};

initCalculateDuration();
