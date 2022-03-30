$('#donthavepass').on('click', function() {
  changeModalTitle('login-test', 'Получение пароля')
  nextStepInModal($(this))
})

$('[data-target-modal-id]').on('click', function() {
  const elem = $(this)
  const idElem = elem.data('target-modal-id')
  const form = elem.closest('form')

  // nextStepInModal(elem)
  
  // отменяем отправку формы и самостоятельно отправляем запрос
  // form.unbind('submit', formHandler)
  // form.one('submit', formHandler)
  form.unbind('submit')
  form.one('submit', function(e) {
    e.preventDefault();

    const allReqFileds = form.find('input[required]')

    // проверяем заполнение полей
    switch (idElem) {
      case 'mail-code':
        // проверка email
        if ( allRequiredIsFilled(allReqFileds) ) {
        // if ( true) {
          // fetch(`https://medobr.com/ajax/lk/sendcode.php?email=t.abdulaev.snta@gmail.com&debug=Y`)
          // fetch(`https://medobr.com/ajax/lk/sendcode.php?email=${mail}&debug=Y`)
          // тестовый промис
          let promise = new Promise(function(resolve, reject) {
            setTimeout(() => resolve({status: 'ok'}), 500);
          })
          promise
            // .then(response => response.json())
            .then(data => {
              console.log(data)
              if (data.status === 'ok') {
                console.log('код подтверждения верен, мы выслали пароль')
                nextStepInModal(elem);
              }
            })
            .catch(err => console.error(err));
        } else {
          console.log('неверно заполнено поле')
        }
        break;

      case 'mail--ur':
        // проверка email
        console.log('шаг с договором юр. лиц');
        break;

      case 'step5-change-pass':
        console.log('4х значный код');
        if ( allRequiredIsFilled(allReqFileds) ) {
        // if (true) {
          // sendRequest('https://medobr.com/ajax/lk/entercode.php', `code=${code1}${code2}${code3}${code4}`)
          // sendRequest('https://medobr.com/ajax/lk/entercode.php', 'code=1408')
          // тестовый промис
          let promise = new Promise(function(resolve, reject) {
            setTimeout(() => resolve({status: 'ok'}), 500);
          })
          promise
            .then(response => {
              console.log(response)
              if (response.status === 'ok') {
                console.log('код действителен')
                nextStepInModal(elem);
              }
            })
        } else {
          console.log('неверно заполнено поле')
        }
        break;

      case 'new-pass':
        if ( passEqual(allReqFileds) ) {
          console.log('отправляем новый пароль');
          // sendRequest('https://medobr.com/ajax/lk/entercode.php', 'code=8314&setpasswd=Y&password=123456&a')
          // тестовый промис
          let promise = new Promise(function(resolve, reject) {
            setTimeout(() => resolve({status: 'ok'}), 500);
          })
          promise
            .then(response => {
              console.log(response)
              if (response.status === 'ok') {
                alert('Новый пароль установлен!')
                closeModal(elem)
              }
            })
        } else {
          alert('пароли не совпадают')
        }
        break;

      default: 
        nextStepInModal(elem);
    }

    function sendRequest(url, params) {
      return fetch(`${url}?${params}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        return data
      })
      .catch(err => console.error(err));
    }

    return false;
  })
})

function allRequiredIsFilled(fields) {
  let countFields = fields.length
  let countSucCheckedFields = 0
  
  fields.each(function() {
    countSucCheckedFields += checkField($(this))
  })

  return countFields === countSucCheckedFields
}

function checkField(field) {
  if (field.val()) {
    console.log('поле верно заполнено')
    return 1
  } else {
    return 0
  }

  // switch (field.attr('type')) {
    
  //   case 'email':
  //     if (field.val()) {
  //       console.log('email верный')
  //       return 1
  //     }
  //     break;

  //   case 'text':
  //     break;

  //   case 'tel':
  //     break;

  //   case 'number':
  //     break;

  //   default:
  //     console.log('или')
  //     return 0
  // }
}

// проверка совпадения паролей
function passEqual(inputs) {
  if (allRequiredIsFilled(inputs)) {
    return inputs[0].value === inputs[1].value
  }
  return false
}

function changeModalTitle(id, text) {
  $(`#${id}`).find('.modal-block__head-title').text(text)
}

function nextStepInModal(elem) {
  const idElem = elem.data('target-modal-id')
  elem.closest('.modal-block__body').css('display', 'none')
  $(`#${idElem}`).css('display', 'block')
}

// переход на новое поле при вводе проверочного кода
$('.modal-block__code-wrap input').on('keyup', function() {
  if ( $(this).val() ) {
    $(this).closest('label').next().focus()
  }
})


// загрузка файлов
$('.custom-file-input').on('change',function(){
  var fileName = $(this).val().replace(/^.*[\\\/]/, '');
  $(this).closest('.custom-file').find('label.custom-file-label').text(fileName)
})

// *********
// функции модала
// close 
$('.modal-block__head-close').on('click',function(){
  closeModal($(this))
})

function closeModal(elem) {
  elem.closest('.modal-block').hide()
}

// open modal 
$('[data-open-modal-id]').on('click',function(){
  openModal( $(this).attr('data-open-modal-id') )
})

function openModal(id) {
  $(`${id}`).show()
}

// очистить модал
function clearModal(id) {
  $(`#${id}`).find('.modal-block__body').html() = ''
}





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