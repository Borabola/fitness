'use strict';
var elementForm = document.querySelector('#user-phone-number');
var subscriptionPeriod = document.querySelector('.subscription__period');

var subscriptionBlock = document.querySelector('.subscription__wrapper');
var inputOne = document.querySelector('#one');
var inputSix = document.querySelector('#six');
var inputTwelve = document.querySelector('#twelve');
var timeout = 1000 / 60;
var durationTime = 1500;
var multiItemSlider = (function () {

  function _isElementVisible(element) {
    var rect = element.getBoundingClientRect(),
      vWidth = window.innerWidth || doc.documentElement.clientWidth,
      vHeight = window.innerHeight || doc.documentElement.clientHeight,
      elemFromPoint = function (x, y) { return document.elementFromPoint(x, y) };
    if (rect.right < 0 || rect.bottom < 0
      || rect.left > vWidth || rect.top > vHeight)
      return false;
    return (
      element.contains(elemFromPoint(rect.left, rect.top))
      || element.contains(elemFromPoint(rect.right, rect.top))
      || element.contains(elemFromPoint(rect.right, rect.bottom))
      || element.contains(elemFromPoint(rect.left, rect.bottom))
    );
  }

  return function (selector, config) {
    var
      _mainElement = document.querySelector(selector), // основный элемент блока
      _sliderWrapper = _mainElement.querySelector('.slider-wrapper'), // обертка для .slider-item
      _sliderItems = _mainElement.querySelectorAll('.slider-item'), // элементы (.slider-item)
      _sliderControls = _mainElement.querySelectorAll('.slider-control'), // элементы управления
      _sliderControlLeft = _mainElement.querySelector('.slider-control--left'), // кнопка "LEFT"
      _sliderControlRight = _mainElement.querySelector('.slider-control--right'), // кнопка "RIGHT"
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
      _positionLeftItem = 0, // позиция левого активного элемента
      _transform = 0, // значение транфсофрмации .slider_wrapper
      _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
      _items = [], // массив элементов
      _interval = 0,
      _html = _mainElement.innerHTML,
      _states = [
        { active: false, minWidth: 0, count: 1 },
        { active: false, minWidth: 980, count: 2 }
      ],
      _config = {
        isCycling: false, // автоматическая смена слайдов
        direction: 'right', // направление смены слайдов
        interval: 5000, // интервал между автоматической сменой слайдов
        pause: true // устанавливать ли паузу при поднесении курсора к слайдеру
      };

    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    }

    // наполнение массива _items
    _sliderItems.forEach(function (item, index) {
      _items.push({ item: item, position: index, transform: 0 });
    });

    var _setActive = function () {
      var _index = 0;
      var width = parseFloat(document.body.clientWidth);
      _states.forEach(function (item, index, arr) {
        _states[index].active = false;
        if (width >= _states[index].minWidth)
          _index = index;
      });
      _states[_index].active = true;
    };

    var _getActive = function () {
      var _index;
      _states.forEach(function (item, index, arr) {
        if (_states[index].active) {
          _index = index;
        }
      });
      return _index;
    };

    var position = {
      getItemMin: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position < _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getItemMax: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position > _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getMin: function () {
        return _items[position.getItemMin()].position;
      },
      getMax: function () {
        return _items[position.getItemMax()].position;
      }
    };

    var _transformItem = function (direction) {
      var nextItem;
        if (!_isElementVisible(_mainElement)) {
        return;
      }
      if (direction === 'right') {
        _positionLeftItem++;
        if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
          nextItem = position.getItemMin();
          _items[nextItem].position = position.getMax() + 1;
          _items[nextItem].transform += _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }
        _transform -= _step;
      }
      if (direction === 'left') {
        _positionLeftItem--;
        if (_positionLeftItem < position.getMin()) {
          nextItem = position.getItemMax();
          _items[nextItem].position = position.getMin() - 1;
          _items[nextItem].transform -= _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }
        _transform += _step;
      }
      _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
    };

    var _cycle = function (direction) {
      if (!_config.isCycling) {
        return;
      }
      _interval = setInterval(function () {
        _transformItem(direction);
      }, _config.interval);
    };

    // обработчик события click для кнопок "назад" и "вперед"
    var _controlClick = function (e) {
      if (e.target.classList.contains('slider-control')) {
        e.preventDefault();
        var direction = e.target.classList.contains('slider-control--right') ? 'right' : 'left';
        _transformItem(direction);
        clearInterval(_interval);
        _cycle(_config.direction);
      }
    };

    // обработка события изменения видимости страницы
    var _handleVisibilityChange = function () {
      if (document.visibilityState === "hidden") {
        clearInterval(_interval);
      } else {
        clearInterval(_interval);
        _cycle(_config.direction);
      }
    };

    var _refresh = function () {
      clearInterval(_interval);
      _mainElement.innerHTML = _html;
      _sliderWrapper = _mainElement.querySelector('.slider-wrapper');
      _sliderItems = _mainElement.querySelectorAll('.slider__item');
      _sliderControls = _mainElement.querySelectorAll('.slider-control');
      _sliderControlLeft = _mainElement.querySelector('.slider-control--left');
      _sliderControlRight = _mainElement.querySelector('.slider-control--right');
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
      _positionLeftItem = 0;
      _transform = 0;
      _step = _itemWidth / _wrapperWidth * 100;
      _items = [];
      _sliderItems.forEach(function (item, index) {
        _items.push({ item: item, position: index, transform: 0 });
      });
    };

    var _setUpListeners = function () {
      _mainElement.addEventListener('click', _controlClick);
      if (_config.pause && _config.isCycling) {
        _mainElement.addEventListener('mouseenter', function () {
          clearInterval(_interval);
        });
        _mainElement.addEventListener('mouseleave', function () {
          clearInterval(_interval);
          _cycle(_config.direction);
        });
      }
      document.addEventListener('visibilitychange', _handleVisibilityChange, false);
      window.addEventListener('resize', function () {
        var
          _index = 0,
          width = parseFloat(document.body.clientWidth);
        _states.forEach(function (item, index, arr) {
          if (width >= _states[index].minWidth)
            _index = index;
        });
        if (_index !== _getActive()) {
          _setActive();
          _refresh();
        }
      });
    };

    // инициализация
    _setUpListeners();
    if (document.visibilityState === "visible") {
      _cycle(_config.direction);
    }
    _setActive();

    return {
      right: function () { // метод right
        _transformItem('right');
      },
      left: function () { // метод left
        _transformItem('left');
      },
      stop: function () { // метод stop
        _config.isCycling = false;
        clearInterval(_interval);
      },
      cycle: function () { // метод cycle
        _config.isCycling = true;
        clearInterval(_interval);
        _cycle();
      }
    }

  }
}());

/*multiItemSlider('.coach', {
  isCycling: true});
multiItemSlider('.feedback', {
  isCycling: true}); */

multiItemSlider('.coach', {
  isCycling: false});
multiItemSlider('.feedback', {
  isCycling: false});

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


  anchor1Link.addEventListener('click', (evt) => { scrollTo(anchor1, evt, durationTime) }, false);
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
  var oldSubscriptionList = document.querySelector('.subscription__list');
  console.log("Изменения");
  if (oldSubscriptionList) {
  subscriptionBlock.removeChild(oldSubscriptionList);
  }
  var subListTemplate = document.querySelector('#subscription-list-template')
    .content
    .querySelector('.subscription__list');
  var subscriptionList = subListTemplate.cloneNode(true);
  console.log(subscriptionList.childNodes[1]);

  if (inputOne.checked) {
    console.log("1 месяц");
    subscriptionList.children[0].children[1].textContent = '12 занятий';
    subscriptionList.children[0].children[2].textContent = '5000';
    subscriptionList.children[1].children[2].textContent = '1700';
    subscriptionList.children[2].children[2].textContent = '2700';
  } else {
    if (inputSix.checked) {
      console.log("6 месяцев");
      console.log(subscriptionList.children[0].children[1]);
      subscriptionList.children[0].children[1].textContent = '72 занятий';
      subscriptionList.children[0].children[2].textContent = '30000';
      subscriptionList.children[0].children[2].classList.remove("subscription__price--5000");
      subscriptionList.children[0].children[2].classList.add("subscription__price--30000");
      subscriptionList.children[1].children[2].textContent = '10000';
      subscriptionList.children[1].children[2].classList.remove("subscription__price--1700");
      subscriptionList.children[1].children[2].classList.add("subscription__price--10000");
      subscriptionList.children[2].children[2].textContent = '16000';
      subscriptionList.children[2].children[2].classList.remove("subscription__price--2700");
      subscriptionList.children[2].children[2].classList.add("subscription__price--16000");
    } else {
      if (inputTwelve.checked) {
        console.log("12 месяцев");
        subscriptionList.children[0].children[1].textContent = '144 занятий';
        subscriptionList.children[0].children[2].textContent = '50000';
        subscriptionList.children[0].children[2].classList.remove("subscription__price--5000");
        subscriptionList.children[0].children[2].classList.add("subscription__price--50000");
        subscriptionList.children[1].children[2].textContent = '20000';
        subscriptionList.children[1].children[2].classList.remove("subscription__price--1700");
        subscriptionList.children[1].children[2].classList.add("subscription__price--20000");
        subscriptionList.children[2].children[2].textContent = '32000';
        subscriptionList.children[2].children[2].classList.remove("subscription__price--2700");
        subscriptionList.children[2].children[2].classList.add("subscription__price--32000");
      }
    }
  }

  subscriptionBlock.appendChild(subscriptionList);
}

subscriptionPeriod.addEventListener('change', onRadioInputChange);
