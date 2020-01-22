'use strict';
var elementForm = document.querySelector('#user-phone-number');
var subscriptionPeriod = document.querySelector('.subscription__period');

var subscriptionBlock = document.querySelector('.subscription__wrapper');
var inputOne = document.querySelector('#one');
var inputSix = document.querySelector('#six');
var inputTwelve = document.querySelector('#twelve');
var timeout = 1000 / 60;
var durationTime = 1500;

var slider = (function () {
  return function (selector) {
    var mainElement = document.querySelector(selector); // основный элемент блока
    var sliderWrapper = mainElement.querySelector('.slider-wrapper');
    var sliderItems = mainElement.querySelectorAll('.slider-item'); // элементы (.slider-item)
    //var sliderControls = mainElement.querySelectorAll('.slider-control'); // элементы управления
    //var sliderControlLeft = mainElement.querySelector('.slider-control--left'); // кнопка "LEFT"
    //var sliderControlRight = mainElement.querySelector('.slider-control--right'); // кнопка "RIGHT"
    var wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width); // ширина обёртки
    var itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width);
    var photoQuantity = Math.round(wrapperWidth / itemWidth);
    var maxPosition = Math.ceil(sliderItems.length / photoQuantity) - 1;
    var position = 0;
    var transform = 0;
    var step = 100; // шаг в 100% смещает на всю ширину обертки

    var transformItem = function (direction) {
      if (direction === 'right') {
        //sliderControlLeft.style.display = "block";
        if (position < maxPosition) {
          position ++;
          transform -= step
        } else {
          //  sliderControlRight.style.display = "none";
        }
      }

      if (direction === 'left') {
        // sliderControlRight.style.display = "block";
        if (position > 0) {
          position --;
          transform += step
        } else {
          // sliderControlLeft.style.display = "none";
        }
      }

      sliderWrapper.style.transform = 'translateX(' + transform + '%)';

    };


    // обработчик события click для кнопок "назад" и "вперед"
    var onControlClick = function (evt) {
      if (evt.target.classList.contains('slider-control')) {
        evt.preventDefault();
        var direction = evt.target.classList.contains('slider-control--right') ? 'right' : 'left';
        transformItem(direction);
      }
    };

    var onWindowResize = function () {
      wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width); // ширина обёртки
      itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width);
      photoQuantity = Math.round(wrapperWidth / itemWidth);
      maxPosition = Math.ceil(sliderItems.length / photoQuantity) - 1;
      position = 0;
      sliderWrapper.style.transform = 'translateX(' + 0 + '%)';
    };

    mainElement.addEventListener('click', onControlClick);
    window.addEventListener('resize', onWindowResize);

  }
}());

slider('.coach__slider-btn-container');
slider('.feedback__slider-container');


/* Маска для номера телефона */

var maskOptions = {
  mask: '+{7}(000)000-00-00',
  // lazy: false
};
var mask1 = IMask(elementForm, maskOptions);


Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t + b
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

function isDomElement(obj) {
  return obj instanceof Element;
}

function isMouseEvent(obj) {
  return obj instanceof MouseEvent;
}

function findScrollingElement(element) { //FIXME Test this too
  do {
    if (element.clientHeight < element.scrollHeight || element.clientWidth < element.scrollWidth) {
      return element;
    }
  } while (element === element.parentNode);
}
function init() {
  //Links
  var anchor1Link  = document.querySelector('.button--presentation');

  //Anchors
  var anchor1      = document.querySelector('#subscription');


  anchor1Link.addEventListener('click', function (evt)  {
    scrollTo(anchor1, evt, durationTime) }, false);
}

function scrollTopValue(domElement) { //DEBUG
  return 'scrollTopValue:', domElement.scrollTop;
}
function offsetTopValue(domElement) { //DEBUG
  return 'offsetTopValue:', domElement.offsetTop;
}

var requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, timeout);
  };
})();

function scrollTo(to, callback, duration) {


  if (isDomElement(to)) {
    to = to.offsetTop;
  }

  function move(amount) {
    document.documentElement.scrollTop = amount;
    document.body.parentNode.scrollTop = amount;
    document.body.scrollTop = amount;
  }

  function position() {
    return document.documentElement.offsetTop || document.body.parentNode.offsetTop || document.body.offsetTop;
  }

  var start = position(),
    change = to - start,
    currentTime = 0,
    increment = 20;


  var animateScroll = function() {
    // increment the time
    currentTime += increment;
    // find the value with the quadratic in-out easing function
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    // move the document.body
    move(val);
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll);
    }
    else {
      if (callback && typeof(callback) === 'function') {
        // the animation is done so lets callback
        callback();
      }
    }
  };

  animateScroll();
}

init();

/* Выбор абонемента */

function onRadioInputChange() {
  var OneMonthPrice = {
    lessons: '12 занятий',
    coach: '5000',
    day: '1700',
    fullday: '2700',
  };
  var SixMonthPrice = {
    lessons: '72 занятий',
    coach: '30000',
    day: '10000',
    fullday: '16000',
  };
  var TwelveMonthPrice = {
    lessons: '144 занятий',
    coach: '50000',
    day: '20000',
    fullday: '32000',
  };

  var oldSubscriptionList = document.querySelector('.subscription__list');
  if (oldSubscriptionList) {
    subscriptionBlock.removeChild(oldSubscriptionList);
  }

  //console.log(document.querySelector('#subscription-list-template'));
  //console.log(document.querySelector('#subscription-list-template').content);
  /*var subListTemplate = document.querySelector('#subscription-list-template')
    .content
    .querySelector('.subscription__list');
  var subscriptionList = subListTemplate.cloneNode(true); */

  if (document.querySelector('#subscription-list-template')
    .content) {
    var subListTemplate = document.querySelector('#subscription-list-template')
      .content
      .querySelector('.subscription__list');
  } else {
    var subListBlock = document.querySelector('#subscription-list-template');
    subListTemplate = subListBlock.querySelector('.subscription__list');
  }
  //For IE
  //var subListBlock = document.querySelector('#subscription-list-template');
  //var subListTemplate = subListBlock.querySelector('.subscription__list');

  var subscriptionList = subListTemplate.cloneNode(true);

  if (subscriptionList.classList.contains('subscription__list--hidden')) {
    subscriptionList.classList.remove('subscription__list--hidden');
  }

  if (inputOne.checked) {
    if (subscriptionBlock.children[2].children[0].children[0].classList.contains('subscription__bar--six')) {
      subscriptionBlock.children[2].children[0].children[0].classList.remove('subscription__bar--six');
    }
    if (subscriptionBlock.children[2].children[0].children[0].classList.contains('subscription__bar--twelve')) {
      subscriptionBlock.children[2].children[0].children[0].classList.remove('subscription__bar--twelve');
    }
    subscriptionList.children[1].children[1].textContent = OneMonthPrice.lessons;
    subscriptionList.children[1].children[2].insertAdjacentHTML("afterbegin", OneMonthPrice.coach + '<span>₽</span>');
    subscriptionList.children[2].children[2].insertAdjacentHTML("afterbegin", OneMonthPrice.day + '<span>₽</span>');
    subscriptionList.children[3].children[2].insertAdjacentHTML("afterbegin", OneMonthPrice.fullday + '<span>₽</span>');
  } else {
    if (inputSix.checked) {
      subscriptionBlock.children[2].children[0].children[0].classList.add("subscription__bar--six");
      if (subscriptionBlock.children[2].children[0].children[0].classList.contains('subscription__bar--twelve')) {
        subscriptionBlock.children[2].children[0].children[0].classList.remove('subscription__bar--twelve');
      }
      subscriptionList.children[1].children[1].textContent = SixMonthPrice.lessons;
      subscriptionList.children[1].children[2].insertAdjacentHTML("afterbegin", SixMonthPrice.coach + '<span>₽</span>');
      subscriptionList.children[1].children[2].classList.remove("subscription__price--5000");
      subscriptionList.children[1].children[2].classList.add("subscription__price--30000");
      subscriptionList.children[2].children[2].insertAdjacentHTML("afterbegin", SixMonthPrice.day + '<span>₽</span>');
      subscriptionList.children[2].children[2].classList.remove("subscription__price--1700");
      subscriptionList.children[2].children[2].classList.add("subscription__price--10000");
      subscriptionList.children[3].children[2].insertAdjacentHTML("afterbegin", SixMonthPrice.fullday + '<span>₽</span>');
      subscriptionList.children[3].children[2].classList.remove("subscription__price--2700");
      subscriptionList.children[3].children[2].classList.add("subscription__price--16000");
    } else {
      if (inputTwelve.checked) {
        subscriptionBlock.children[2].children[0].children[0].classList.add("subscription__bar--twelve");
        subscriptionList.children[1].children[1].textContent = TwelveMonthPrice.lessons;
        subscriptionList.children[1].children[2].insertAdjacentHTML("afterbegin", TwelveMonthPrice.coach + '<span>₽</span>');
        subscriptionList.children[1].children[2].classList.remove("subscription__price--5000");
        subscriptionList.children[1].children[2].classList.add("subscription__price--50000");
        subscriptionList.children[2].children[2].insertAdjacentHTML("afterbegin", TwelveMonthPrice.day + '<span>₽</span>');
        subscriptionList.children[2].children[2].classList.remove("subscription__price--1700");
        subscriptionList.children[2].children[2].classList.add("subscription__price--20000");
        subscriptionList.children[3].children[2].insertAdjacentHTML("afterbegin", TwelveMonthPrice.fullday + '<span>₽</span>');
        subscriptionList.children[3].children[2].classList.remove("subscription__price--2700");
        subscriptionList.children[3].children[2].classList.add("subscription__price--32000");
      }
    }
  }

  subscriptionBlock.appendChild(subscriptionList);
}
subscriptionPeriod.addEventListener('change', onRadioInputChange);
