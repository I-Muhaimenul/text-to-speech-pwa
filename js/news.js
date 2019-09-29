import { topHeadlinesUrl } from './newsApi.js';
import './news-article.js';

window.addEventListener('load', () => {
    fetchNews();
});

async function fetchNews() {
    // const topHeadlinesUrl = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=54fe76a8c27843c58e8f0564176a9f8d';
    const res = await fetch(topHeadlinesUrl);
    const json = await res.json();

    const main = document.querySelector('main');

    json.articles.forEach(article => {
        console.log(article);
        const el = document.createElement('news-article');
        el.articles = article;
        main.appendChild(el);
    });
}