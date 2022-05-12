$('body').on('click', '.spoiler__title', function(e) {
  $(this).closest('.spoiler').toggleClass('open')
})

$('body').on('click', '.route__btn', function(e) {
  const btn = $(this)
  const route = btn.closest('.route')
  if (route.hasClass('open')) {
    btn.text('Показать все программы')
    route.removeClass('open')
  } else {
    btn.text('Скрыть все программы')
    route.addClass('open')
  }
})