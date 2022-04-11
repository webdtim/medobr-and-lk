
// модал с инфой
let dataUser = {
  name: 'Тимур',
  second_name: 'Абдулаев',
  last_name: 'Мурадович',
  specs: [
    {
      id: '112211',
      title: 'Акушер-гинеколог',
      date_end: '20.03.25',
      quantity_nmo: '144'
    },
    {
      id: '1345511',
      title: 'Бактериолог',
      date_end: '20.02.23',
      quantity_nmo: '256'
    },
    {
      id: '231231',
      title: 'Лечебная физкультура и спортивная медицина',
      date_end: '01.04.22',
      quantity_nmo: '56'
    }    
  ],
  email: 'test@mail.com',
  phone: '+7 925 333-33-33',
  delivery: [
    {
      city: 'Москва',
      index: 125057,
      adress: 'Ленинградский проспект 71кД, п.19, кв. 925',
      name_receiver: 'Мама Тимура',
      contact_receiver: '+7(989) 676-54-32',
      selected: true
    },
    {
      city: 'Каспийск',
      index: 132357,
      adress: 'Алферово 12, кв. 925',
      name_receiver: 'Айро Артёмович А.',
      selected: false
    }
  ],
  documents: [
    {
      title: 'Паспорт',
      file_name: 'DCIM-asda123123.jpg',
      link: 'https://medobr.com/user/docs/photo.pass.jpg'
    },
    {
      title: 'Договор',
      file_name: 'aasdasd.docx',
      link: 'https://medobr.com/user/docs/dogovor.docx'
    },
    {
      title: 'СНИЛС',
      file_name: 'snils.png',
      link: 'https://medobr.com/user/docs/snils.png'
    }
  ]
}

$('#lk-info-modal').find('.modal-block__body').html( createModalInfo(dataUser) )

function createModalInfo(dataUser) {
  const infoLK = document.createElement('div')

  for (let key in dataUser) {
    switch (key) {
      case 'specs':
        const arrSpecs = dataUser[key]
        const specsWrapper = document.createElement('div')
        specsWrapper.classList = 'info-lk__inner'

        for (let i = 0; i < arrSpecs.length; i++) {
          specsWrapper.append( createInfoBlock(`${arrSpecs[i].title} - ${arrSpecs[i].date_end} - ${arrSpecs[i].quantity_nmo}`, `Специальность ${i+1}`) )
        }

        infoLK.append(specsWrapper)
        break;
      case 'documents':
        const arrDocuments = dataUser[key]
        const documentsWrapper = document.createElement('div')
        documentsWrapper.classList = 'info-lk__inner'

        for (let i = 0; i < arrDocuments.length; i++) {
          documentsWrapper.append( createInfoBlock(`${arrDocuments[i].file_name}`, arrDocuments[i].title) )
        }

        infoLK.append(documentsWrapper)
        break;
    }
  }

  return infoLK
}


function dataExists(data) {
  return data.length >= 1
}

function createInfoBlock(dataText, labelText, modifyClass) {
  
  if ( !dataExists(dataText) ) return false

  if ( !modifyClass ) modifyClass = ''
  
  const infoBLock = document.createElement('div')
  infoBLock.classList = 'info-lk__block'

  infoBLock.innerHTML = `
    <div class="info-lk__label">${labelText}</div>
    <div class="info-lk__text ${modifyClass}">${dataText}</div>
  `

  return infoBLock
}








initSelects('select-custom')

// пример: .select-program__dropdown-list 
//           .select-program__item-wrap - доп. оболочка
//             .select-program__item

// событие выбора
// elem.addEventListener('customselect', e => {console.log(e.detail)})
function initSelect(elemSelect, selectClass) {
  new CustomSelect({
    elem: elemSelect,
    selectClass: selectClass
  })
}

function initSelects(nameClassForSelect) {
  const selects = document.querySelectorAll(`.${nameClassForSelect}`)
      
  for (let select of selects) {
    initSelect(select, nameClassForSelect)
  }
}

function CustomSelect({elem, selectClass}) {

  elem.addEventListener('click', function(event) {
    const targetSelectItem = event.target.closest(`.${selectClass}__item`)


    // модификация, в других проектах не использовать
    if(elem.classList.contains('no-open')) {
      const prevStepElem = elem.previousElementSibling
      validateSelect(prevStepElem)
      return
    }

    if (event.target.closest('input')) {
      // предотвратить двойной клик из-за лейбла
      event.stopPropagation();
    } else if (event.target.closest(`.${selectClass}__top`)) {
      toggle();
    } else if (targetSelectItem) {
      const checkedValue = targetSelectItem.querySelector('input').value
      const checkedTitle = targetSelectItem.querySelector('input').nextElementSibling.textContent
      selectedSelecet(checkedTitle, checkedValue)
      closeSelect();

      // зависимость селектов друг от друга
      if (elem.dataset.allowOpenNext) {
        const nextElem = elem.nextElementSibling

        unSelectedSelect(nextElem)

        if (elem.dataset.allowOpenNext === 'false') {
          nextElem.classList.remove('no-open')
          elem.dataset.allowOpenNext = 'true'
        }
      }
    }
  })

  const searchInput = elem.querySelector('input.select-custom__search')
  searchInput.addEventListener('input', e => {
    searchInDropdownList(e.target)
  })

  let isOpen = false;
  // ------ обработчики ------

  // закрыть селект, если клик вне его
  function clickOutSelect(event) {
    if (!elem.contains(event.target)) closeSelect();
  }

  function setValue(title, value) {
    elem.dataset.selectedVal = value
    elem.querySelector(`.${selectClass}__head-selected`).textContent = title;

    const widgetEvent = new CustomEvent('customselect', {
      bubbles: true,
      detail: {
        title: title,
        value: value
      }
    });

    elem.dispatchEvent(widgetEvent);
  }
  // elem.addEventListener('customselect', e => {console.log(e.detail)})

  function openSelect() {
    removeClass(elem, `error`);
    addClass(elem, 'open');
    document.addEventListener('click', clickOutSelect);
    isOpen = true;
  }

  function closeSelect() {
    removeClass(elem, `open`);
    validateSelect(elem)
    document.removeEventListener('click', clickOutSelect);
    isOpen = false;
  }

  function toggle() {
    if (isOpen) closeSelect()
    else openSelect();
  }

  function selectedSelecet(checkedTitle, checkedValue) {
    addClass(elem, 'selected');
    setValue(checkedTitle, checkedValue);
  }

  function unSelectedSelect(elem) {
    removeClass(elem, 'selected');
    elem.dataset.selectedVal = ''
    elem.querySelector(`.${selectClass}__head-selected`).textContent = ''
  }

  function searchInDropdownList(inpt) {
    const searchItems = elem.querySelectorAll('.select-custom__item')
    
    searchItems.forEach(item => {
      const textItem = item.textContent.toLowerCase()
      if (textItem.includes(inpt.value.toLowerCase())) {
        item.classList.remove('hidden')
      } else {
        item.classList.add('hidden')
      }
    })
  }
}

function addClass(elem, className) {
  elem.classList.add(className)
}

function removeClass(elem, className) {
  if (elem) elem.classList.remove(className)
}
  
function validateSelect(elem) {
  const selectedValue = elem.dataset.selectedVal

  if (!selectedValue) {
    addClass(elem, 'error');
    return false
  }
  return true
}
// ------ End Custom Select ------------


// раскрытие элементов
$('body').on('click', '.complete .btn', function(e) {
  e.target.closest('.complete').classList.toggle('open')
})

// // модалы
// $('body').on('click', '[data-modal=true]', function (e) {
//   e.preventDefault();
//   let id = $(this).attr('data-modal-id');
//   //console.log('test');
//   $(id).toggle();
// });

// $('[data-modal-close]').on('click', function() {
//   if ($(this).attr('data-modal-close') === 'true') {
//     $(this).closest('.modal-block').toggle()
//   }
// })

// добавление специальности
function createSpec(specs) {

  let arrSpecs = ''

  for(let i = 0; i < specs.length; i++) {
    arrSpecs += (`
    <div class="select-custom__item">
      <label class="radio radio--mini">
        <input type="radio" name="format" value="${specs[i].value}"><span class="span">${specs[i].title}</span>
      </label>
    </div>`)
  }

  const spec = `<div class="modal-block__inputs-wrap">
    <label class="modal-block__label standart-label"><span>Специальность</span>
      <div class="select-custom req" data-selected-val="" data-allow-open-next="false">
        <div class="select-custom__top">
          <label class="select-custom__preview"><span class="select-custom__desc">Специальность</span>
            <input class="select-custom__search" placeholder="Выберите тип услуги">
            <div class="select-custom__head-selected"></div>
          </label>
        </div>
        <div class="select-custom__dropdown">
          <div class="select-custom__dropdown-body">`
          + arrSpecs +
          `</div>
        </div>
        <div class="select-custom__err-text">Пожалуйста, выберите специальность!</div>
      </div>
    </label>
    <label class="modal-block__label standart-label">
      <span>Дата окончания <br> сертификата</span>
      <input class="modal-block__body-input" placeholder="12.03.2025">
    </label>
    <label class="modal-block__label standart-label">
      <span>Текущее кол-во <br> баллов НМО</span>
      <input class="modal-block__body-input" placeholder="123">
    </label>
  </div>`

  return spec
}

function initSpec(elemSelect) {
  initSelect(elemSelect, 'select-custom')
}

$('body').on('click','#add-spec', function(e) {
  $(this).before(createSpec([{title: 'спек 1', value: 'spec1'}, {title: 'спек 2', value: 'spec2'}]))
  
  const selectElem = e.target.previousElementSibling.querySelector('.select-custom')
  initSpec(selectElem)
})

// choose-seminar
$('body').on('click','#btn-add-seminar', function() {
  console.log($(this))
  $('.choose-seminar').addClass('open')
  $(this).hide()
})

$('body').on('click', '.choose-seminar__close', function() {
  $(this).parent().removeClass('open')
  $('#btn-add-seminar').show()
})

// const arrAllow = [false, false]
let allowPay = false

$('body').on('change', '#agree-off', function() {
  if ($(this).is(':checked')) allowPay = true
  else allowPay = false

  if(allowPay) {
    $('#go-to-pay').removeAttr('disabled')
  } else {
    $('#go-to-pay').attr('disabled','disabled')
  }
})

// $('[data-agree-offer]').on('click', function() {
//   const indexElem = $(this).attr('data-agree-offer')
//   arrAllow[indexElem] = true
//   allowPay = true
  
//   for (let i = 0; i < arrAllow.length; i++) {
//     if(arrAllow[i] !== true) allowPay = false
//   }

//   if(allowPay) {
//     $('#go-to-pay').removeAttr('disabled')
//   }
// })





function validateCustomInput(inpt) {
  const customInput = inpt.closest('.custom-input')
  const reg = inpt.dataset.typeInpt

  if (!inpt.value) {
    customInput.classList.add('error')
    return false
  } else {
    if(reg) {
      // switch 
    } else {
      customInput.classList.remove('error')
      return true
    }
  }
}

$('body').on('click', '.custom-input', function(e) {
  const customInput = $(this)
  customInput.addClass('open')
})

$('body').on('focus', 'input.custom-input__input', function(e) {
  const customInput = $(this).closest('.custom-input')
  customInput.removeClass('error')
})

$('body').on('blur', 'input.custom-input__input', function(e) {
  const customInput = $(this).closest('.custom-input')

  validateCustomInput(e.target)
  if (!e.target.value) customInput.removeClass('open')
})

$('body').on('keyup', 'input', function(e) {
  const inpt = e.target
  const type = inpt.dataset.type
  if(e.key === 'Backspace') return
  
  let tempValueNumber = $(this).val().replace(/[^+\d]/g, '')
  let formatedValue = ''
  // создаем маску
  switch(type) {
    case 'number':
      $(this).val($(this).val().replace(/[^+\d]/g, ''))
      break;
    case 'snils':
      
      for (let i = 0; i < tempValueNumber.length; i++) {
        if (i === 2) {
          formatedValue += tempValueNumber[i] + '-'
        } else if (i === 5) {
          formatedValue += tempValueNumber[i] + '-'
        } else if (i === 8) {
          formatedValue += tempValueNumber[i] + ' '
        } else if (i >= 11) {
        } else {
          formatedValue += tempValueNumber[i]
        }
      }
      $(this).val(formatedValue)
      break;
    case 'ser-pass':

      for (let i = 0; i < tempValueNumber.length; i++) {
        if (i === 1) {
          formatedValue += tempValueNumber[i] + ' '
        } else if (i >= 4) {
        } else {
          formatedValue += tempValueNumber[i]
        }
      }
      $(this).val(formatedValue)
      break;
    case 'num-pass':
      
      for (let i = 0; i < tempValueNumber.length; i++) {
        if (i >= 6) {
        } else {
          formatedValue += tempValueNumber[i]
        }
      }
      $(this).val(formatedValue)
      break;
    case 'code-pass':

      for (let i = 0; i < tempValueNumber.length; i++) {
        if (i === 2) {
          formatedValue += tempValueNumber[i] + '-'
        } else if (i >= 6) {
        } else {
          formatedValue += tempValueNumber[i]
        }
      }
      $(this).val(formatedValue)
      break;
    case 'date':

      for (let i = 0; i < tempValueNumber.length; i++) {
        if (i === 1) {
          formatedValue += tempValueNumber[i] + '.'
        } else if (i === 3) {
          formatedValue += tempValueNumber[i] + '.'
        } else if (i >= 8) {
        } else {
          formatedValue += tempValueNumber[i]
        }
      }
      $(this).val(formatedValue)
      break;
    case 'index':

      for (let i = 0; i < tempValueNumber.length; i++) {
        if (i === 2) {
          formatedValue += tempValueNumber[i] + ' '
        } else if (i >= 6) {
        } else {
          formatedValue += tempValueNumber[i]
        }
      }
      $(this).val(formatedValue)
      break;
    case 'nmo':

      for (let i = 0; i < tempValueNumber.length; i++) {
        if (i >= 4) {
        } else {
          formatedValue += tempValueNumber[i]
        }
      }
      $(this).val(formatedValue)
      break;
    default:
      return
  }
})

function validateInput(inpt) {
  if (!inpt.value) {
    inpt.classList.add('error')
    return false
  } else {
    inpt.classList.remove('error')
    return true
  }
}

$('body').on('blur', 'input[required]', function(e) {
  validateInput(e.target)
})

$('body').on('click', '#go-to-pay', function() {
  const form = $(this).closest('.choose-seminar__form')
  const reqSelects = form.find('.select-custom.req')
  const reqInputs = form.find('input[required]')
  const reqCustomInputs = form.find('.custom-input.req input')
  
  for (let i = 0; i < reqSelects.length; i++) {
    validateSelect(reqSelects[i])
  }

  for (let i = 0; i < reqInputs.length; i++) {
    validateInput(reqInputs[i])
  }

  for (let i = 0; i < reqCustomInputs.length; i++) {
    validateCustomInput(reqCustomInputs[i])
  }
})
