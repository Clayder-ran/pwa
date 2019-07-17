let movieBox = document.querySelector('.content');
        
function loadAndRenderMovies(){
    fetch('/movie/items').then(res => res.json()).then(items => {
        // 电影列表
        console.log('电影列表: ', items);
        if(items && items.length){
            movieBox.innerHTML = items.map(item => `<li>${item}</li>`).join('');
        }
    }).catch(err => {
        
    })
}


document.querySelector('#movieItems').addEventListener('click', loadAndRenderMovies);
window.addEventListener('load', loadAndRenderMovies);


