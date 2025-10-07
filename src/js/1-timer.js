import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector("[data-start]");
const input = document.querySelector("#datetime-picker");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerInterval = null;

// Додає 0 зліва, якщо число < 10
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Конвертація мс у дні/години/хв/сек
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Опції для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
      });
      startBtn.setAttribute("disabled", true);
    } else {
      startBtn.removeAttribute("disabled");
    }
  },
};

flatpickr("#datetime-picker", options);

// Функція оновлення таймера
function updateTimer() {
  const diff = userSelectedDate - new Date();

  if (diff <= 0) {
    clearInterval(timerInterval);
    input.removeAttribute("disabled");
    startBtn.setAttribute("disabled", true);
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(diff);

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Клік по Start
startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;

  startBtn.setAttribute("disabled", true);
  input.setAttribute("disabled", true);

  timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
});

