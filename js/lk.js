
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

  this.selectedValue = function(value) {

  }

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
      selectedSelecte(checkedTitle, checkedValue)
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

  function selectedSelecte(checkedTitle, checkedValue) {
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

  const spec = `
  <div class="spec">
    <div class="select-custom select-custom--check req" data-selected-val="" data-allow-open-next="false">
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

    <div class="modal-block__inputs-wrap">
      <div class="custom-input custom-input--check req">
        <label class="custom-input__label"><span class="custom-input__desc">Дата окончания сертификата</span>
          <input class="custom-input__input" placeholder="дд.мм.гггг" data-type="date" data-custom-type="nmo-date">
        </label>
        <div class="custom-input__err-text">Неверная дата</div>
      </div>
      <div class="custom-input custom-input--check req">
        <label class="custom-input__label"><span class="custom-input__desc">Имеется баллов НМО</span>
          <input class="custom-input__input" placeholder="000" data-type="nmo">
        </label>
        <div class="custom-input__err-text">Введите баллы</div>
      </div>
    </div>
  </div>`

  return spec
}

function initSpec(elemSelect) {
  initSelect(elemSelect, 'select-custom')
}

function addItemToSpecList(specList, data) {
  const allSpec = specList.querySelectorAll('.spec-list__item')
  const specItem = `<div class="spec-list__item" data-id-spec="${data.id}">
    <span class="spec-list__num">${allSpec.length + 1}</span>
    <div class="spec-list__text"><span>${data.name}</span>, <span>${data.date}</span>, <span>${data.point}</span> баллов НМО</div>
    <div class="spec-list__edit"></div>
    <div class="spec-list__delete"></div>
  </div>`

  specList.innerHTML += specItem
}

function recalculationSpecList(specsList) {
  const specs = specsList.querySelectorAll('.spec-list__item')

  for( let i = 0; i < specs.length; i++ ) {
    specs[i].querySelector('.spec-list__num').textContent = i + 1
  }
}

function removeSpecListItem(item, specsList) {
  item.remove()
  recalculationSpecList(specsList)
}

function fillCustomField(field, value) {
  const input = field.querySelector('input')
  input.value = value
  validateCustomInput(input)
}

function selectedCustomSelect(select, id, name) {
  select.classList.add('selected', 'suc')
  select.dataset.selectedVal = id
  select.querySelector('.select-custom__head-selected').textContent = name

  const targetCheckbox = select.querySelector(`input[value="${id}"]`)
  if (targetCheckbox) targetCheckbox.checked = true
}

function editSpec({id, name, date, points}, editBtn) {
  const wrapper = editBtn.closest('.modal-block__p-and-border')
  const select = wrapper.querySelector('.select-custom')
  const dateField = wrapper.querySelector('input[data-type="date"]').closest('.custom-input')
  const pointsField = wrapper.querySelector('input[data-type="nmo"]').closest('.custom-input')

  selectedCustomSelect(select, id, name)
  fillCustomField(dateField, date)
  fillCustomField(pointsField, points)
}

// удаление
$('body').on('click','.spec-list__delete', function(e) {
  const item = $(this).closest('.spec-list__item')
  const specsList = e.target.closest('.spec-list')

  removeSpecListItem(item, specsList)
})

// редактирование
$('body').on('click','.spec-list__edit', function(e) {
  const editBtn = e.target
  const item = $(this).closest('.spec-list__item')
  const specsList = editBtn.closest('.spec-list')

  const id = item.data('id-spec')
  const allSpans = item.find('.spec-list__text').find('span')
  const name = allSpans[0].textContent
  const date = allSpans[1].textContent
  const points = allSpans[2].textContent.replace(/[^+\d]/g, '')

  editSpec({id, name, date, points}, editBtn)

  removeSpecListItem(item, specsList)
})

$('body').on('click','#add-spec', function(e) {
  const spec = $('.spec')
  if (!validateAllFormFields(spec)) return
  const specsWrap = e.target.closest('.modal-block__p-and-border')
  const specList = specsWrap.querySelector('.spec-list')
  const select = spec.find('.select-custom')

  const id = select.data('selected-val')
  const name = select.find('.select-custom__head-selected').text()
  const date = spec.find('input[data-type="date"]').val()
  const point = spec.find('input[data-type="nmo"]').val()

  addItemToSpecList(specList, {id, name, date, point})

  spec.remove()

  // добавляем новые поля ввода
  $(this).before(createSpec([{title: 'спек 1', value: 'spec1'}, {title: 'спек 2', value: 'spec2'}]))
  // вешаем слушатель
  const selectElem = specsWrap.querySelectorAll('.select-custom')
  initSpec(selectElem[selectElem.length - 1])
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
  const reg = inpt.dataset.customType

  function addError() {
    customInput.classList.add('error')
    customInput.classList.remove('suc')
    return false
  }

  function addSuc() {
    customInput.classList.remove('error')
    customInput.classList.add('suc')
    customInput.classList.add('open')
    return true
  }

  if (!inpt.value) {
    return addError()
  } else {

    const nVal = inpt.value.replace(/[^+\d]/g, '')

    switch (reg) {
      case 'nmo':
        return nVal > 9 ? addSuc() : addError()
      case 'birth-date':
        if (  nVal.length < 8 || nVal.slice(0,2) > 31 || nVal.slice(0,2) < 1
              || nVal.slice(2,4) > 12 || nVal.slice(2,4) < 1
              || nVal.slice(4) < 1880 || nVal.slice(4) > (new Date()).getFullYear() - 10) {
          return addError()
        } else {
          return addSuc()
        }
      case 'nmo-date':
        if (  nVal.length < 8 || nVal.slice(0,2) > 31 || nVal.slice(0,2) < 1
              || nVal.slice(2,4) > 12 || nVal.slice(2,4) < 1
              || nVal.slice(4) < (new Date()).getFullYear() - 1 || nVal.slice(4) > (new Date()).getFullYear() + 10) {
          return addError()
        } else {
          return addSuc()
        }
      case 'index':
        return nVal.length === 6 ? addSuc() : addError()
      case 'snils':
        return nVal.length === 11 ? addSuc() : addError()
      case 'tel':
        if (nVal[0] == 7 || nVal[0] == 8) return nVal.length === 11 ? addSuc() : addError()
        else return (nVal.length >= 11 && nVal.length <= 16) ? addSuc() : addError()
      default:
        return addSuc()
    }
    // if (reg) {
    //   // switch 
    // } else {
    //   customInput.classList.remove('error')
    //   return true
    // }
  }
}

$('body').on('click', '.custom-input__label', function(e) {
  const customInput = $(this).closest('.custom-input')
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
    case 'tel':

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

function validateLoadFile(inpt) {
  const loadFile = inpt.closest('.custom-file')

  if (!inpt.value) {
    loadFile.classList.add('error')
    return false
  } else {
    loadFile.classList.remove('error')
    return true
  }
}

function compareInputsMark(collections) {
  let haveValue = false

  if (collections.length < 2) return

  for (let i = 0; i < collections.length; i++) {
    const inpt = collections[i]
    if(inpt.value) {
      haveValue = true
    }
  }

  for (let i = 0; i < collections.length; i++) {
    const inpt = collections[i]
    if (haveValue) {
      const field = inpt.closest('.req')
      console.log('Уже есть значения')
      field.classList.remove('req','error')
    } else {
      console.log('нет значений, Добавляем обязательность')
      inpt.parentElement.classList.add('req')
    }
  }

  return haveValue
}

$('body').on('blur', 'input[required]', function(e) {
  validateInput(e.target)
})

// // удалить
// $('.choose-seminar__form').on('submit', function(e) {
//   e.preventDefault()
//   if (validateAllFormFields($(this))) {
//     $(this).submit()
//   }
// })

$('body').on('click', '#go-to-pay', function() {
  const form = $(this).closest('.choose-seminar__form')
  
  const marksElse = form.find('[data-mark-else]')
  compareInputsMark(marksElse)

  validateAllFormFields(form)
})

function validateAllFormFields(form) {
  const reqSelects = form.find('.select-custom.req')
  const reqInputs = form.find('input[required]')
  const reqCustomInputs = form.find('.custom-input.req input')
  const reqInptsFiles = form.find('.custom-file.req input')
  let isSucValidate = true

  // валидация
  for (let i = 0; i < reqSelects.length; i++) {
    if(!validateSelect(reqSelects[i])) isSucValidate = false
  }

  for (let i = 0; i < reqInputs.length; i++) {
    if(!validateInput(reqInputs[i])) isSucValidate = false
  }

  for (let i = 0; i < reqCustomInputs.length; i++) {
    if(!validateCustomInput(reqCustomInputs[i])) isSucValidate = false
  }

  for (let i = 0; i < reqInptsFiles.length; i++) {
    if(!validateLoadFile(reqInptsFiles[i])) isSucValidate = false
  }

  return isSucValidate
}



$('body').on('click', '[data-send-req]', function(e) {
  let isGroup
  const elem = e.target
  if (elem.classList.contains('nav-link')) {
    isGroup = elem.closest('ul.nav-tabs').querySelector('a.nav-link.active').dataset.sendReq
  } else {
    isGroup = elem.dataset.sendReq
    // переключаем таб
    $(`#lk-info-change a[href="#${isGroup}"]`).closest('li.nav-item').next().children().tab('show')
  }

  const tab = $('#' + isGroup)

  switch (isGroup) {
    case 'contacts':
      console.log('send contacts')

      // $.ajax({
      //   type: 'POST',
      //   url: $(this).attr('action'),
      //   data: new FormData(this),
      //   contentType: false,
      //   processData:false,
      //   //xhrFields: { responseType: 'arraybuffer' },
      //   success: function(ret,status,xhr){
      //     $('.create_deal_submit').removeAttr('disabled').html('Перейти к оплате');
      //     ret = JSON.parse(ret);
      //     if(ret.error) {
      //       alert(ret.error);																				
      //     } else {
      //       if(ret.link.indexOf('>>')!=-1&&ret.link.indexOf('http')!=-1) {
      //         $('.create_deal_submit').hide();
      //         location.href = ret.link.split('>>').join(''); //goto cashdesk
      //         } 
      //       else {alert('Ошибка создания платежа!'); console.log(ret.link);}
      //     }
      //   }
      // });
      const contactsBody = {
        last_name: tab.find('input[name="last_name"]').val(),
        name: tab.find('input[name="name"]').val(),
        second_name: tab.find('input[name="second_name"]').val(),
        birthdate: tab.find('input[name="birthdate"]').val(),
        snils: tab.find('input[name="snils"]').val()
      }

      // fetch('https://medobr.com/ajax/lk/setparams.php', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json;charset=utf-8'
      //   },
      //   body: JSON.stringify(contactsBody)
      // })
      //   .then(response => response.json())
      //   .then(data => {
      //     console.log(data)
      //     if (data.status !== 'ok') {
      //       alert('что-то пошло не так. Не удалось обновить информацию')
      //     }
      //   })
      //   .catch(err => console.error(err));

      let strContacts = ''

      for (let key in contactsBody) {
        strContacts += key + '=' + contactsBody[key] + '&'
      }

      fetch(`https://medobr.com/ajax/lk/setparams.php?${strContacts}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.status !== 'ok') {
            alert('что-то пошло не так. Не удалось обновить информацию')
          }
        })
        .catch(err => console.error(err));
      break;

    case 'specs':
      const specsBody = []
      const specsElems = document.querySelectorAll('.spec-list__item')
      const newSpec = document.querySelector('.spec')
      
      for (let spec of specsElems) {
        const id = spec.dataset.idSpec
        const spansInText = spec.querySelectorAll('.spec-list__text span')
        const date = spansInText[1].textContent
        const nmo = spansInText[2].textContent
        specsBody.push({id, date, nmo})
      }

      {
        const inptSpec = newSpec.querySelector('input[type="radio"]:checked')
        if (inptSpec) {
          const id = inptSpec.value
          const date = spec.querySelector('input[data-type="date"]').value
          const nmo = spec.querySelector('input[data-type="nmo"]').value
          specsBody.push({id, date, nmo})
        }
      }
      
      if (!specsBody.length) return
      console.log('send specs')

      let strSpecs = ''

      specsBody.forEach((item, i) => {
        for (let key in item) {
          strSpecs += `specs[${i}][` + key + ']=' + item[key] + '&'
        }
      })

      console.log(strSpecs)

      fetch(`https://medobr.com/ajax/lk/setparams.php?${strSpecs}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.status !== 'ok') {
            alert('что-то пошло не так. Не удалось обновить информацию  ' + data.error)
          }
        })
        .catch(err => console.error(err));
      // // отправка JSON'ом
      // fetch('https://medobr.com/ajax/lk/setparams.php', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json;charset=utf-8'
      //   },
      //   body: JSON.stringify(specsBody)
      // })
      //   .then(response => response.json())
      //   .then(data => {
      //     console.log(data)
      //     if (data.status !== 'ok') {
      //       alert('что-то пошло не так. Не удалось обновить информацию')
      //     }
      //   })
      //   .catch(err => console.error(err));
      break;

    case 'docs':
      const formData = new FormData();
      const filesFields = tab.find('input[type="file"]');

      for (let field of filesFields) {
        if(!field.files[0]) continue
        formData.append(field.name, field.files[0]);
      }

      fetch(`https://medobr.com/ajax/lk/setparams.php`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.status !== 'ok') {
            alert('что-то пошло не так. Не удалось обновить информацию')
          }
        })
        .catch(err => console.error(err));
      break;
  }

})



// CUSTOM MODAL
$('body').on('click','[data-custom-modal]', (e) => {
  const targetId = e.target.dataset.customModal
  openCustomModal(targetId)
})

$('body').on('click','[data-custom-modal-close="true"]', closedCustomModal)

function openCustomModal(id) {
  const targetModal = $('#' + id)

  if (targetModal) {
    targetModal.addClass('open')
    // blockedBody()
  } else console.error(`Не удалось найти модал с id ${targetId}`)
}

function closedCustomModal(e) {
  const modal = e.target.closest('.custom-modal')
  modal.classList.remove('open')
  // unblockedBody()
}

function blockedBody() {
  $('body').addClass('body--no-scroll')
}

function unblockedBody() {
  $('body').removeClass('body--no-scroll')
}

