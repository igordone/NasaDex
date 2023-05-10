const slider = document.querySelectorAll('.slider');
const first = document.getElementById('first');
const video = document.querySelector('.vdo');
const date = document.getElementById('date');
const text = document.getElementById('text-img');
const title = document.getElementById('imgName');

const hd_btn = document.getElementById('hd-btn');
const modal_btn = document.getElementById('modal-btn');
const modal_content = document.getElementById('content-text-modal');

const prev_btn = document.getElementById('prev-btn');
const next_btn = document.getElementById('next-btn');

let currentSlide = 0;

function hideSlider() {
    slider.forEach(item => item.classList.remove('on'));
}
function showSlider(){
    slider[currentSlide].classList.add('on');
}

function addDay(value) {
    let dataString = date.textContent;
    let partsData = dataString.split("-");
    let year = parseInt(partsData[0]);
    let month= parseInt(partsData[1]) - 1; 
    let day= parseInt(partsData[2]);
    let newDate = new Date(year , month, day);
    if(value){
        newDate.setDate(newDate.getDate() +1);
    }else{
        newDate.setDate(newDate.getDate() -1);
    }
    console.log(newDate);

    year = newDate.getFullYear();
    month = ("0" + (newDate.getMonth() + 1)).slice(-2); // adicionar um zero à esquerda se o mês for menor que 10
    day = ("0" + newDate.getDate()).slice(-2); // adicionar um zero à esquerda se o dia for menor que 10
    dataString = year + "-" + month + "-" + day;

    return dataString;
}

function nextSlider() {
    var dateUrl = addDay(true);
    fetchNasa(dateUrl);
}

function prevSlider() {
    if(title.textContent === 'Not Found =)') {
        fetchNasa(getCurrentDate());
    }else{
        var dateUrl = addDay(false);
        fetchNasa(dateUrl);
    }
}
next_btn.addEventListener('click', nextSlider);
prev_btn.addEventListener('click', prevSlider);

window.onload = function() {
    fetchNasa(getCurrentDate());
}

function getCurrentDate() {
    var newDate = new Date();
    let year = newDate.getFullYear();
    let month = ("0" + (newDate.getMonth() + 1)).slice(-2); // adicionar um zero à esquerda se o mês for menor que 10
    let day = ("0" + newDate.getDate()).slice(-2); // adicionar um zero à esquerda se o dia for menor que 10
    dataString = year + "-" + month + "-" + day;
    return dataString;
}

function fetchNasa(data) {
    try{
        fetch(`https://api.nasa.gov/planetary/apod?api_key=xqEI1M7Eb21v6ofQcyp5f2egqrOPKhmuUmwCrX82&date=${data}`) //substituir a data por ${data}
        .then(response => response.json())
        .then(data => createSlider(data));
    }catch(error){
        console.log('erro:', error);
    } 
}

let lastModal_title;
let lastModal_text;

modal_btn.addEventListener('click', () => {
    
    let estilo = window.getComputedStyle(modal_content); //pega as infos de estilo do elemento modal_content;
    let visibility = estilo.getPropertyValue('visibility'); //Pega o valor da propriedade de 'visibility';
    console.log('modal >>', visibility);
    if(visibility === 'hidden' ){
        modal_content.style.visibility = 'visible';
        title.classList.add('add-title-img');
        text.classList.add('add-text-img');
    }else{
        modal_content.style.visibility='hidden';
        title.classList.remove('add-title-img');
        text.classList.remove('add-text-img');
    }
});

let lastUrl;

hd_btn.addEventListener('click', () => {
    if (lastUrl) {
        console.log(lastUrl);
        window.open(lastUrl);
    }
});

function createSlider(apiData) {
    lastUrl = apiData.hdurl;
    lastModal_title = apiData.title;
    lastModal_text = apiData.explanation;

    if(apiData.url){
        first.style.backgroundImage = `url(${apiData.url})`;
        date.innerHTML = apiData.date;

        title.innerHTML = lastModal_title;
        text.innerHTML = lastModal_text;

        if(apiData.media_type === 'video'){
            video.src = apiData.url;
            first.style.visibility = 'hidden';
            video.style.visibility = 'visible';
        }else {
            first.style.visibility = 'visible';
            video.style.visibility = 'hidden';
        }

    }else{
        title.innerHTML = 'Not Found =)';
        first.style.backgroundImage = `url(./img/ReyChiquita2.gif)`
        date.innerHTML = 'Come back tomorrow for a new image'
    }
}