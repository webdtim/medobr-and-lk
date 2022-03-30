document.addEventListener('DOMContentLoaded', function(){

    //Табы - контейнер .has-tabs
    //контролы - data-tab-target="#id"
    //контент-табы - data-tab-content=""

    const tabsControls = document.querySelectorAll('[data-tab-target]')

    tabsControls.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabParent = tab.closest('.has-tabs')
            const tabContents = tabParent.querySelectorAll('[data-tab-content]')
            const currTabs = tabParent.querySelectorAll('[data-tab-target]')
            tabContents.forEach(tabContent => {
                tabContent.classList.remove('active')
            })

            currTabs.forEach(tab => {
                tab.classList.remove('active')
            })

            const target = tabParent.querySelector(tab.dataset.tabTarget)
            tab.classList.add('active')
            target.classList.add('active')
        })
    })

    //ищу все фильтры
    const filterDiv = document.querySelectorAll('.filter');
    
    for (let filterDivItem of filterDiv) {
        //Сворачиваю каждый фильтр
        filterDivItem.classList.add('folded');

        const labels = filterDivItem.getElementsByClassName('filter__label');

        filterDivItem.querySelector('.filter__labels-wrapper').style.maxHeight = labels[0].clientHeight * 10 + 'px';

        for (let index = 0; index < labels.length; index++) {
            if (index > 4) {
                labels[index].classList.add('hidden');
            }
        }
    }


    //ПОИСК внутри фильтров
    const searchInputs = document.querySelectorAll('.filter__search-field');

    searchInputs.forEach(sInput => {
        sInput.addEventListener('input', () => {
            searchFunc(sInput)
        })

    })

    function searchFunc(sInput) {
        //Ищу айдишник блока  по которому буду искать, на основе даты
        const searchArea = document.querySelector(sInput.dataset.searchTarget)
        //Ищу все элементы среди которых буду искать
        const searchElems = searchArea.querySelectorAll('.filter__label')

        searchElems.forEach(elem => {
            const inputSpan = elem.querySelector('span')
            
            console.log(inputSpan.innerText.toUpperCase())

            if (inputSpan.textContent.toUpperCase().includes(sInput.value.toUpperCase())) {
                elem.classList.remove('hidden')
            } else {
                elem.classList.add('hidden')
            }

            // console.log(inputSpan.innerText.toUpperCase().includes(sInput.value.toUpperCase()))

        })
    }
    ///////////////////////////////////////////////////
});

/* Функция кнопки для показа скрытых инпутов (баттон блока присылает айди враппера) */
function unfoldFilter(blockID) {
    const block = document.getElementById(blockID);
    const labels = block.getElementsByClassName('filter__label');

    if (block.classList.contains('folded')) {
        block.classList.remove('folded');
        for (let index = 0; index < labels.length; index++) {
            labels[index].classList.remove('hidden');
        }
    } else {
        block.classList.add('folded');
        for (let index = 0; index < labels.length; index++) {
            if (index > 4) {
                labels[index].classList.add('hidden');
            }
        }
    }

}


/* Открытие мобильного меню */
function toogleMobileNav() {
    const nav = document.getElementById('filters-wrap');

    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
    } else {
        nav.classList.add('active');
    }
}
///////////////////////////////