let codeCheck

$('body').on('click','#donthavepass', function() {
  changeModalTitle('login', 'Получение пароля')
  nextStepInModal($(this))
})

$('body').on('click','[data-target-modal-id]', function() {
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
          const email = $('#email-inpt').val()
          fetch(`https://medobr.com/ajax/lk/sendcode.php?email=${email}`)
          // // тестовый промис
          // let promise = new Promise(function(resolve, reject) {
          //   setTimeout(() => resolve({status: 'ok'}), 500);
          // })
          // promise
            .then(response => response.json())
            .then(data => {
              console.log(data)
              if (data.status === 'ok') {
                console.log('email существует, мы выслали код подтверждения')
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
          codeCheck = `${$('#code1').val()}${$('#code2').val()}${$('#code3').val()}${$('#code4').val()}`
          // sendRequest('https://medobr.com/ajax/lk/entercode.php', `code=${codeCheck}`)
          // sendRequest('https://medobr.com/ajax/lk/entercode.php', 'code=1408')
          // тестовый промис
          let promise = new Promise(function(resolve, reject) {
            setTimeout(() => resolve({status: 'ok'}), 500);
          })
          promise
            .then(data => {
              console.log(data)
              if (data.status === 'ok') {
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
          const passNew = $('#pass-new').val()
          const passRepeat = $('#pass-repeat').val()
          console.log('отправляем новый пароль');
        //   fetch(`https://medobr.com/ajax/lk/sendcode.php?code=${codeCheck}&setpasswd=Y&password=${passNew}&&password_repeat=${passRepeat}`, {
        //     credentials: 'include'
        //   })
        // //   sendRequest('https://medobr.com/ajax/lk/entercode.php', `code=${codeCheck}&setpasswd=Y&password=${passNew}&&password_repeat=${passRepeat}`)
        //     .then(response => response.json())
        //     .then(data => {
        //       console.log(data)
        //       if (data.status === 'ok') {
        //         alert('Новый пароль установлен!')
        //         // closeModal(elem)
        //         window.location.href = 'https://medobr.com/lk/'
        //       } else if (data.error) {
        //         alert(data.error)
        //       }
        //     })
          sendRequest('https://medobr.com/ajax/lk/entercode.php', `code=${codeCheck}&setpasswd=Y&password=${passNew}&&password_repeat=${passRepeat}`)
          // тестовый промис
          // let promise = new Promise(function(resolve, reject) {
          //   setTimeout(() => resolve({status: 'ok'}), 500);
          // })
          // promise
            .then(data => {
              console.log(data)
              if (data.status === 'ok') {
                alert('Новый пароль установлен!')
                // closeModal(elem)
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
        if (data.error) {
            alert(data.error)
        }
        return data
      })
      .catch(err => {
        console.error(err)
        alert(err.error)
      });
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
$('body').on('keyup', '.modal-block__code-wrap input', function(e) {
  const curInput = $(this)

  if (e.key === 'Backspace') {
    curInput.val('')
    curInput.closest('label').prev().focus()
    return
  } else if (e.key === 'Delete') {
    curInput.val('')
    return
  }

  const allInput = $('.modal-block__code-wrap input')
  const value = curInput.val()

  if ( value.length < 2 ) {
    curInput.val(value[0])
  } else if ( curInput[0] === allInput[3] ) {
    curInput.val(value[0])
    console.log('go to next step')
  } else {
    for (let i = 0; i < value.length; i++) {
      const input = $('.modal-block__code-wrap input')[i]
      input.value = value[i]
  
      if (i === allInput.length - 1 ) {
        console.log('go to next step')
      } else if (i === value.length) {
        input.nextElementSibling.focus()
      }
    }
  }
})

$('body').on('keydown', '.modal-block__code-wrap input', function(e) {
  if (e.key === 'Backspace' || e.key === 'Delete') return

  const curInput = $(this)
  const value = curInput.val()

  if (value.length >= 1) {
    curInput.closest('label').next().focus()
  }
})

// загрузка файлов
$('body').on('change', '.custom-file-input', function(){
  var fileName = $(this).val().replace(/^.*[\\\/]/, '');
  $(this).closest('.custom-file').find('label.custom-file-label').text(fileName)
})

// *********
// функции модала
// close 
$('body').on('click', '.modal-block__head-close', function(){
  closeModal($(this))
})

//УБРАЛ АРТЕМ - СБИВАЛО С ТОЛКУ
// $('[data-close-cur-modal="true"]').on('click',function(){
//   closeModal($(this))
// })

function closeModal(elem) {
  elem.closest('.modal-block').hide()
}

// open modal 
$('body').on('click','[data-open-modal-id]', function(){
  openModal( $(this).attr('data-open-modal-id') )
})

function openModal(id) {
  $(`${id}`).show()
}

// очистить модал
function clearModal(id) {
  $(`#${id}`).find('.modal-block__body').html() = ''
}