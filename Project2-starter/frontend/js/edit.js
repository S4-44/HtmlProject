"use strict";

const id = new URLSearchParams(window.location.search).get('id');
let blog;
const url = `http://localhost:3000/blogs/${id}`;

const form = document.querySelector('form');
const title = form.querySelector('#title');
const content = form.querySelector('#content');
const submitBtn = form.querySelector('button');
const notificationContainer = document.querySelector('.notification-container');
const notification = notificationContainer.querySelector('.notification');
const closeBtn = notificationContainer.querySelector('button');

window.addEventListener('DOMContentLoaded', fetchBlog);

async function fetchBlog(){
    try{
        const response = await fetch(url);
        if(!response.ok){
            notification.textContent = `Error: ${response.url} ${response.status}`;
            notificationContainer.classList.remove('hidden');
            closeBtn.addEventListener('click', () => {
                notificationContainer.classList.add('hidden');
            })
            
        }
        blog = await response.json();
        
        populateblog();
    }
    catch(error){
        console.log(error);
    }
}


function populateblog(){
    title.value = blog.title;
    content.value = blog.content;
}

submitBtn.addEventListener('click', updateBlog);

async function updateBlog(e){
    if(form.reportValidity()){
        e.preventDefault();
        blog.title = title.value;
        blog.content = content.value;

        try{
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blog)
            });
            if(!response.ok){
                throw Error(`Error: ${response.url} ${response.status}`);
            }
            window.location.href = 'index.html';
        }
        catch(error){
            console.log(error);
        }
    }
}