"use strict";
const MAX_LENGTH = 50;//maximum length of the blog content shown on the page, i.e., if the blog content is longer, truncate it.
const PAGE_LIMIT = 12;//number of blogs per page

//global variables
const url =  'http://localhost:3000/blogs';
let blogs = [];
let blogsPerPage = 0;
let numberOfButtons = 0;
let currentPage = 0;
let search = '';

//DOM elements
const articlesWrapper = document.querySelector(".articles-wrapper");
const pagination = document.querySelector('.pagination-container');
const paginatedBlogs = document.createElement('div');
const searchBar = document.querySelector('input');
const notificationContainer = document.querySelector('.notification-container');
const notification = notificationContainer.querySelector('.notification');
const closeBtn = notificationContainer.querySelector('button');


window.addEventListener('DOMContentLoaded', getBlogs);

async function getBlogs() {
    
    
    try{

        
        const response = await fetch(`${url}?_sort=date&_page=${currentPage}&_limit=${PAGE_LIMIT}&q=${search}`);
        
        
        if(!response.ok){
            notification.textContent = `Error: ${response.url} ${response.status}`;
            notificationContainer.classList.remove('hidden');
            closeBtn.addEventListener('click', () => {
                notificationContainer.classList.add('hidden');
            })

        }
        
        const totalCount = response.headers.get('X-Total-Count');
        blogsPerPage = PAGE_LIMIT;
        numberOfButtons = totalCount / blogsPerPage;

        blogs = await response.json();
        blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        if(!paginatedBlogs.hasChildNodes()){
            paginateBlogs();
        }
        loadBlogs();
        

        
    }
    catch(error){
        console.log(error);
    }

}

function loadBlogs() {
    const fragment = document.createDocumentFragment();
    
    blogs.forEach(blog => fragment.append(generateBlogs(blog)));
    
    articlesWrapper.innerHTML = '';
    articlesWrapper.append(fragment);
}

function generateBlogs(blog){
    

    
    const blogContainer = document.createElement('article');
    blogContainer.classList.add('card');
    blogContainer.addEventListener('click', () => {
        window.location.href = `details.html?id=${blog.id}`;
    });
    const header = document.createElement('div');
    header.classList.add('card-header');

    const img = document.createElement('img');
    img.classList.add('avatar');
    img.src = blog.profile 
    img.alt = "profile picture";

    const author = document.createElement('div');
    author.textContent = blog.author + " · " + new Date(blog.date).toDateString();

    header.append(img, author);
    blogContainer.append(header);

    const blogBody = document.createElement('div');
    blogBody.classList.add('card-body');
            
    const title = document.createElement('h3');
    title.textContent = blog.title;

    const body = document.createElement('p');
    if (blog.content.length > MAX_LENGTH) {
        body.textContent = blog.content.substring(0, MAX_LENGTH) + '... ';
    } else {
        body.textContent = blog.content;
    }

            
    blogBody.append(title, body);
    blogContainer.append(blogBody);

    return blogContainer;

}

function paginateBlogs() {
    
    
    for (let i = 0; i < numberOfButtons; i++) {
        const paginateButton = document.createElement('button');
        paginateButton.classList.add('page-btn');
       if(i === currentPage){
            paginateButton.classList.add('active');
        }
        paginateButton.textContent = i + 1;
        paginatedBlogs.append(paginateButton);
    }

    pagination.append(paginatedBlogs);
}

pagination.addEventListener('click', (e) => {
    if (e.target.classList.contains('page-btn')) {
        currentPage = e.target.textContent;
        e.target.classList.add('active');
        const parent = e.target.parentNode;
        const siblings = Array.from(parent.children).filter(child => child !== e.target);
        siblings.forEach(child => child.classList.remove('active'));
        getBlogs();
    }
});

searchBar.addEventListener('change', searchBlogs);

function searchBlogs(e) {

    if(e.target.value === ''){
        search = '';
        currentPage = 0;
    } else {
        search = e.target.value;
        currentPage = blogs.findIndex(blog => blog.title === search || blog.author === search) + 1;
    }

    paginatedBlogs.innerHTML = '';
    getBlogs();

}
