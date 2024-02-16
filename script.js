"use strict";

const words = [
    ['time', 'время', 'Life is short end time is swift.'],
    ['year', 'год', 'A lot of books are published every year.'],
    ['people', 'люди', 'Healthy people are more productive.'],
    ['way', 'путь, способ', 'We wont a better way.'],
    ['day', 'день', 'We watch TV every day.'],
    ['man', 'мужчина', 'The old man said something.']
    // ['thing', 'вещь', 'It is an unbelievable thing.'],
    // ['life', 'жизнь', 'Spend money and enjoy life!'],
    // ['school', 'школа', 'I always walk to school.'],
    // ['word', 'слово', 'I will keep my word.']
];

let counter = 0;
//находим элементы которые нам понадобятся 
const studyCards = document.querySelector('.study-cards')
const flipCard = document.querySelector('.flip-card');
const slider = document.querySelector('.slider');
const button = document.querySelector('.slider-controls');
const buttonNext = document.querySelector('#next');
const buttonBack = document.querySelector('#back');
const buttonExam = document.querySelector('#exam');
const examsCard = document.querySelector('#exam-cards');
const examMode = document.querySelector('#exam-mode');
const studyMode = document.querySelector('#study-mode');
const shuffleButton = document.querySelector('#shuffle-words');


function createWord() { //функция для создания карточки в режиме "Тренажер"

    const cardFront = document.querySelector('#card-front');
    const wordFront = cardFront.querySelector('h1');
    wordFront.textContent = words[counter][0];

    const cardBack = document.querySelector('#card-back');

    const wordTranslation = cardBack.querySelector('h1');
    wordTranslation.textContent = words[counter][1];

    const example = cardBack.querySelector('span');
    example.textContent = words[counter][2];

    const currentWord = document.querySelector('#current-word');
    currentWord.textContent = counter + 1;

    const totalWord = document.querySelector('#total-word')
    totalWord.textContent = words.length;
}

function generateWord() { //ф-ция изменения слова на другое в режиме "Тренажер"
    const randomIndex = Math.floor((Math.random() * words.length));
    let newWord = words[randomIndex];
    words[counter] = newWord;
    createWord();
}

shuffleButton.addEventListener('click', generateWord);


createWord();

slider.addEventListener('click', () => { //при клике переворот карточки в режиме "Тренажер"
    flipCard.classList.toggle('active');
});


button.addEventListener('click', (event) => { //обраюотчик события на кнопки "влево" "вправо" "Тестирование"
    let action = event.target;
    event.preventDefault();

    if (action === buttonNext) {
        counter++;
    } else if (action === buttonBack) {
        counter--;
    }

    if (action === buttonExam) { // переход в режим проверки знаний 
        studyCards.classList.add('hidden'); //убираем карточки "Тренажер"
        studyMode.classList.add('hidden'); //убираем панель количества слов "тренажер"
        examMode.classList.remove('hidden'); //добавляем счетчик правильных действий в режиме "Тестирование"

        createCards();

        const cards = document.querySelectorAll('.card');
        let hasSelectedCard = false;

        let firstCard, secondCard;

        function selectCard() {

            this.classList.add('correct');

            if (!hasSelectedCard) {
                hasSelectedCard = true;
                firstCard = this;
                return;
            }

            secondCard = this;
            hasSelectedCard = false;

            checkForMatch();

            if (Array.from(cards).every(card => card.className.includes('fade-out'))) {
                setTimeout(() => {
                    alert("Игра окончена");
                    location.reload();
                }, 1000);
            }
        }

        function checkForMatch() { //функция проверки совпадения слов

            let numberFirst = words.indexOf(words.find(arr => arr.includes(firstCard.textContent)));
            let numberSecond = words.indexOf(words.find(arr => arr.includes(secondCard.textContent)));

            if (numberFirst == numberSecond) {
                firstCard.classList.add('fade-out');
                secondCard.classList.add('fade-out');
                return;
            }

            unSelectCard();
        }

        function unSelectCard() { //алгоритм работы при НЕ совпадения слов

            secondCard.classList.add('wrong');
            setTimeout(() => {
                firstCard.classList.remove('correct');
                secondCard.classList.remove('correct', 'wrong');

            }, 500);
            return;
        }

        cards.forEach(card => card.addEventListener('click', selectCard));
    }

    if (counter > 0) {
        buttonBack.disabled = false;
    } else {
        buttonBack.disabled = true;
    }

    if (counter === words.length - 1) {
        buttonNext.disabled = true;
        return;
    } else {
        buttonNext.disabled = false;
    }

    createWord();
});

function createCard(item) { //создание карточки в режиме "Тестирование"
    const divWord = document.createElement('div');
    divWord.classList.add('card');
    divWord.textContent = item;
    return divWord;

}

function createCards() { // создание полотна(карточек) режима "Тестирование"

    const fragment = new DocumentFragment();
    const newArray = [];

    words.forEach((word) => {
        newArray.push(createCard(word[0]));
        newArray.push(createCard(word[1]));
    });

    fragment.append(...newArray.sort(() => Math.random() - 0.5));
    examsCard.innerHTML = "";
    examsCard.append(fragment);
}