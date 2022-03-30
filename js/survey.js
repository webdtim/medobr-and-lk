document.addEventListener('DOMContentLoaded', function() {

  const formSurvey = document.querySelector('form.survey')
  const inptEmail = formSurvey.querySelector('input[type="email"]')
  const regEmail = new RegExp('^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$')

  formSurvey.addEventListener('submit', function(e) {
    e.preventDefault();

  })
  
  function checkInputs() {
    const reqInputs = document.querySelectorAll('input[required]')
    for (let inpt of reqInputs) {
      // if (inpt.value )

    }
    if (regEmail.test(inptEmail.value)) {
      markInput(input)
    } else {
      unmarkInput()
    }
  }

  function markInput(input) {
    input.classList.add('survey__field--error')
  }

  function unmarkInput(input) {
    input.classList.remove('survey__field--error')
  }

})