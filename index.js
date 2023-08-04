'use strict';

const getStartDateValue = () => {
  const startDate = document.getElementById('start-date');

  return new Date(startDate.value);
};

const getEndDateValue = () => {
  const endDate = document.getElementById('end-date');

  return new Date(endDate.value);
};

const setDatesAtInputs = () => {
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');

  if (!startDateInput.value) {
    alert("Please, choose start date!");
  } else if (!endDateInput.value) {
    alert("Please, choose end date!");
  } 
};

const removeAttrDisabled = () => {
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const presetSelect = document.getElementById('preset-select');

  const setDisabledState = (disabled) => {
    endDate.disabled = disabled;
    presetSelect.disabled = disabled;
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
          endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        default:
          return;
      }

      const formattedEndDate = endDate.toISOString().slice(0, 10);
      endDateInput.value = formattedEndDate;
    }
  });
};

const calculateDurationInDays = (startDate, endDate, type) => {
  const oneDay = 24 * 60 * 60 * 1000;
  let currentDay = new Date(startDate);
  let weekdays = 0;
  let weekends = 0;

  while (currentDay <= endDate) {
    const dayOfWeek = currentDay.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekends++;
    } else {
      weekdays++;
    }
    currentDay = new Date(currentDay.getTime() + oneDay);
  }

  if (type === 'weekdays') {
    return weekdays;
  } else if (type === 'weekends') {
    return weekends;
  } else if (type === 'alldays') {
    return weekdays + weekends;
  } else {
    return 0; // Неіснуючий type
  }
};

const formatDuration = (duration, type) => {
  switch (type) {
    case 'days':
      return `${duration} days`;
    case 'hours':
      return `${duration * 24} hours`;
    case 'minutes':
      return `${duration * 24 * 60} minutes`;
    case 'seconds':
      return `${duration * 24 * 60 * 60} seconds`;
    default:
      return "Invalid dimension";
  }
};

const initDurationBetweenDates = () => {
  const startDateValue = getStartDateValue();
  const endDateValue = getEndDateValue();
  const start = new Date(startDateValue);
  const end = new Date(endDateValue);
  
  const durationTypes = ['weekdays', 'weekends', 'alldays'];
  const timeTypes = ['days', 'hours', 'minutes', 'seconds'];

  let result = '';

  durationTypes.forEach(durationType => {
    const durationCheckbox = document.getElementById(durationType);
    if (durationCheckbox.checked) {
      timeTypes.forEach(timeType => {
        const timeCheckbox = document.getElementById(timeType);
        if (timeCheckbox.checked) {
          const duration = calculateDurationInDays(start, end, durationType);
          const formattedDuration = formatDuration(duration, timeType);
          result += `${formattedDuration}`;
        }
      });
    }
  });

  document.getElementById('result-area').value = result;
};


const saveDataToLocalStorage = () => {
  const startDateValue = getStartDateValue();
  const endDateValue = getEndDateValue();
  const resultArea = document.getElementById('result-area');
  const result = resultArea.value;
  

  if (isNaN(startDateValue.getTime()) || isNaN(endDateValue.getTime())) {
    console.error('Invalid date: Please, choose both dates and type duration to save information in localStorage!');
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

    // Розрахунок днів, часів, мінут, секунд 
    initDurationBetweenDates();

    // Збереження у локальному сховищі останніх 10 результатів, які рахував юзер на сторінці в додатку
    saveDataToLocalStorage();

    // Виведення данних з LocalStorage на сторінку
    renderDataFromLocalStorage();
  });

  // Виведення данних з LocalStorage на сторінку при завантаженні
  renderDataFromLocalStorage();
};

initCalculateDuration();
