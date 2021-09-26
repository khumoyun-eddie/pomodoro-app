"use strict";
/* Opening settings bar */

const labelTimer = document.querySelector(".time");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".modal__close");
const btnOpenModal = document.querySelector(".icon-settings");
let interval;

const pomodoroTime = document.querySelector("#pomodoro");
const shortBreakTime = document.querySelector("#short-break");
const longBreakTime = document.querySelector("#long-break");
const iconUp = document.querySelectorAll(".form__input-icon--up");
const iconDown = document.querySelectorAll(".form__input-icon--down");
const applyBtn = document.querySelector("#apply");
let timeInputs = document.querySelectorAll(".inputs");

const pomodoroBtn = document.querySelector('.btn[data-buttons="pomodoro"]');
const shortBreakBtn = document.querySelector(
  '.btn[data-buttons="short-break"]'
);
const longBreakBtn = document.querySelector('.btn[data-buttons="long-break"]');
const btnArray = document.querySelectorAll(".header__link");

let [activeBtn] = [...btnArray].filter((btn) =>
  btn.classList.contains("btn--active")
);

const controlBtn = document.querySelector(".text-button");
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenModal.addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
/////////////////////////////////////////////////////////////////////

const displayTime = function (seconds) {
  const min = String(Math.trunc(seconds / 60)).padStart(2, 0);
  const sec = String(seconds % 60).padStart(2, 0);
  labelTimer.textContent = `${min}:${sec}`;
};

/* Chosing pomodoro/ short-break/ long-break */
const optionBtns = document.querySelectorAll(".header__link");
const controlOptions = document.querySelector(".header__list");

controlOptions.addEventListener("click", (e) => {
  const clicked = e.target.closest(".header__link");

  if (!clicked) return;

  // active btn
  optionBtns.forEach((btn) => btn.classList.remove("btn--active"));
  clicked.classList.add("btn--active");
  activeBtn = clicked;
  clearInterval(interval);
  controlBtn.textContent = "start";
  displayTime(activeBtn.dataset.value * 60);
});

/////////////////////////////////////////////////////////////////////
/* Theme changing */
const container = document.querySelector(".container");
const optionColors = document.querySelectorAll(".option__color");
const colorOptionSet = document.querySelector("#colors");

// container.classList.add("theme-orange");
const themes = ["theme-orange", "theme-blue", "theme-pink"];

colorOptionSet.addEventListener("click", function (e) {
  const clicked = e.target.closest(".option__color");
  if (!clicked) return;

  // active color
  optionColors.forEach((btn) => btn.classList.remove("option__color--active"));
  clicked.classList.add("option__color--active");

  // active theme
  container.className = "container";
  container.classList.add(`${themes[clicked.dataset.color]}`);
});
//////////////////////////////////////////////////////////////////////
/* Font changing */
const optionFonts = document.querySelectorAll(".option__fonts");
const fontOptionSet = document.querySelector("#fonts");
const fontSet = ["Kumbh Sans", "Roboto Slab", "Space Mono"];

fontOptionSet.addEventListener("click", function (e) {
  const clicked = e.target.closest(".option__fonts");
  if (!clicked) return;

  optionFonts.forEach((btn) => btn.classList.remove("option__fonts--active"));
  clicked.classList.add("option__fonts--active");
  container.style.fontFamily = `${fontSet[clicked.dataset.font]}`;
});

//////////////////////////////////////////////////////////////////////
/* Time inputs */

iconUp.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    let parentElement = btn.parentElement.previousElementSibling;
    if (
      parentElement.getAttribute("id") === "pomodoro" &&
      parentElement.textContent < 60
    ) {
      parentElement.textContent = parentElement.textContent * 1 + 5;
    }
    // short break
    else if (
      parentElement.getAttribute("id") === "short-break" &&
      parentElement.textContent < 10
    ) {
      parentElement.textContent = parentElement.textContent * 1 + 1;
    }
    // long-break
    else if (
      parentElement.getAttribute("id") === "long-break" &&
      parentElement.textContent < 60
    ) {
      return (parentElement.textContent = parentElement.textContent * 1 + 5);
    }
  })
);
iconDown.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    let parentElement = btn.parentElement.previousElementSibling;
    // checkUp('down',parentElement)
    // parentElement.textContent = parentElement.textContent*1 - 1
    // pomodoro set time
    if (
      parentElement.getAttribute("id") === "pomodoro" &&
      parentElement.textContent > 15
    ) {
      parentElement.textContent = parentElement.textContent * 1 - 5;
    }
    // short break
    else if (
      parentElement.getAttribute("id") === "short-break" &&
      parentElement.textContent > 1
    ) {
      parentElement.textContent = parentElement.textContent * 1 - 1;
    }
    // long-break
    else if (
      parentElement.getAttribute("id") === "long-break" &&
      parentElement.textContent > 15
    ) {
      return (parentElement.textContent = parentElement.textContent * 1 - 5);
    }
  })
);
///////////////////////////////////////////////////////////////////////////
/* Apply button logic */
applyBtn.addEventListener("click", () => {
  closeModal();
  pomodoroBtn.setAttribute("data-value", pomodoroTime.textContent);
  shortBreakBtn.setAttribute("data-value", shortBreakTime.textContent);
  longBreakBtn.setAttribute("data-value", longBreakTime.textContent);

  displayTime(activeBtn.dataset.value * 60);
});

///////////////////////////////////////////////////////////////////////////

const alarmSound = new Audio("../assets/sounds/alarm.mp3");
const breakSound = new Audio("../assets/sounds/sound.mp3");

const sound = function (time, activeBtn) {
  if (time === 0) {
    alarmSound.play();
    breakSound.pause();
    breakSound.currentTime = 0;
  } else if (time > 0 && activeBtn !== pomodoroBtn) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    breakSound.play();
  } else {
    alarmSound.pause();
    breakSound.pause();
  }
};

/* Timer logic */
let timeLeft;
let paused = false;
const setTimer = function (time) {
  const tick = function () {
    displayTime(time);
    sound(time, activeBtn);
    if (time === 0) {
      clearInterval(timer);
      controlBtn.textContent = "restart";
    }
    timeLeft = time--;
  };
  tick();

  const timer = setInterval(tick, 1000);
  return timer;
};

// setTimer(100)

///////////////////////////////////////////////////////////////////////////
/* Pomodoro start logic */

controlBtn.addEventListener("click", function (e) {
  // check is timer still running if not ->
  if (this.textContent === "start" || this.textContent === "restart") {
    // changes textContent to Pause
    startLogic(activeBtn.dataset.value * 60, e.target);
  } else if (this.textContent === "pause") {
    this.textContent = "resume";

    displayTime(timeLeft);
    clearInterval(interval);
  } else if (this.textContent === "resume") {
    activeBtn.dataset.value = timeLeft;
    startLogic(activeBtn.dataset.value, e.target);
  }
});
function startLogic(activeBtn, target) {
  target.textContent = "pause";
  // takes time from pomodoro inputs

  if (interval) clearInterval(interval);
  interval = setTimer(activeBtn);
}
