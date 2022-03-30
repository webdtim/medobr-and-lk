// локальные скрипты

document.addEventListener('DOMContentLoaded', function() {
  // кнопки переключения
  const btnFirstAccr = document.querySelector('#first-accr');
  const btnPeriodAccr = document.querySelector('#period-accr');
  // чеклисты
  const firstListAccr = document.querySelector('#first-accr-list')
  const listAccr = document.querySelector('#accr-list')
  // кнопки проверки
  const btnFirstCheck = document.querySelector('#check-first')
  const btnCheck = document.querySelector('#check')
  // плашка внизу экрана
  const needHelp = document.querySelector('.need-help')

  window.addEventListener("scroll", function() {
    let heightToBanner = 400

    if (document.documentElement.clientWidth >= 1200) heightToBanner = 800

    if(window.pageYOffset > 400 && window.pageYOffset < $('.checklist-block--banner').offset().top - heightToBanner) {
      needHelp.classList.add('need-help--open')
    } else {
      needHelp.classList.remove('need-help--open')
    }
  });

  btnFirstAccr.addEventListener('click', e => {
    if (e.target.closest('.tooltip-info')) return
    changeBtnStatus(e.target)
    showBlockAccr('#first-accr-block')
  })

  btnPeriodAccr.addEventListener('click', e => {
    if (e.target.closest('.tooltip-info')) return
    changeBtnStatus(e.target)
    showBlockAccr('#accr-block')
  })

  btnFirstCheck.addEventListener('click', e => {
    goToThreeStep(firstListAccr)
  })

  btnCheck.addEventListener('click', () => {
    goToThreeStep(listAccr)
  })

  document.querySelector('.need-help').addEventListener('click', () => {
    scrollTo('.checklist-block--banner')
  })

  if (document.documentElement.clientWidth < 1200) {
    const allInfoMark = document.querySelectorAll('.tooltip-info__icon')
    for (let mark of allInfoMark) {
      mark.addEventListener('click', e => {
        console.log('click info')
      })
    }
  }

  function goToThreeStep(list) {
    if (isAllcheckedList(list)) {
      hideThreeStep('#error')
      showNextStep('#all-suc')
    } else {
      hideThreeStep('#all-suc')
      showNextStep('#error')
    }
  }

  function scrollTo(id) {
    $('html, body').animate({
      scrollTop: $(id).offset().top - 90
    }, 500);
  }

  function showBlockAccr(id) {
    document.querySelector(id).classList.add('accr-block--open')
    scrollTo(id)
  }

  function hideThreeStep(id) {
    document.querySelector(id).classList.add('checklist-block--hide')
  }

  function showNextStep(blockContent) {
    document.querySelector(blockContent).classList.remove('checklist-block--hide')
    scrollTo(blockContent)
  }
  
  function isAllcheckedList(wrapper) {
    const allCheckboxes = wrapper.querySelectorAll('input[type="checkbox"]')
    const allChecked = wrapper.querySelectorAll('input[type="checkbox"]:checked')
    return (allChecked.length === allCheckboxes.length) ? true : false
  }

  function changeBtnStatus(btn) {
    const btnElem = btn.closest('.checklist-block__btn')
    const btns = document.querySelectorAll('.checklist-block__btn')
    const allActiveWrapers = document.querySelectorAll('.accr-block')
    const className = 'checklist-block__btn--active'

    if (!btn.classList.contains(className)) {
      removeAllActiveClasses(btns, className)
      removeAllActiveClasses(allActiveWrapers, 'accr-block--open')
      addActiveClass(btnElem, className)
      // удаляем шаг 3
      hideThreeStep('#all-suc')
      hideThreeStep('#error')
    }
  }

  function addActiveClass(elem, className) {
    elem.classList.add(className)
  }

  function removeAllActiveClasses(elements, className) {
    for (let elem of elements) {
      if (elem.classList.contains(className)) {
        elem.classList.remove(className)
      }
    }
  }

  // modal
  const btnsOpenModal = document.querySelectorAll('[data-target-modal]')

  for (let btn of btnsOpenModal) {
    btn.addEventListener('click', function(e) {
      if (document.documentElement.clientWidth >= this.dataset.onlyUpWidth) {
        //не открываем
      } else {
      // меняем текст
        $('.modal-amo__text').text(this.querySelector('.tooltip-info__text').innerHTML)
        if (this.closest('.checklist-block__btn')) {
          // для главных кнопок
          $('.modal-amo__title').text(this.closest('.checklist-block__btn').querySelector('p').innerHTML)
        } else {
          // для списка
          $('.modal-amo__title').text(this.closest('li.checklist__li ').querySelector('span').innerHTML)
        }

        openModal(this.dataset.targetModal)
      }
    })
  }

  $('[data-target-close]').on('click', function() {
    const targetId = this.dataset.targetClose
    closeModal(targetId)
  })

  function openModal(id) {
    console.log(id)
    const modal = document.querySelector(`#${id}`)
    if(modal) {
      modal.classList.add(`modal-amo--open`)
      blockedBody()
    }
  }

  function closeModal(id) {
    const modal = document.querySelector(`#${id}`)
    if(modal) {
      modal.classList.remove(`modal-amo--open`)
      unblockedBody()
    }
  }

  function blockedBody() {
    document.querySelector('body').classList.add('body--no-scroll')
  }

  function unblockedBody() {
    document.querySelector('body').classList.remove('body--no-scroll')
  }
})
