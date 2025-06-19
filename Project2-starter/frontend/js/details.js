"use strict";



const id = new URLSearchParams(window.location.search).get('id');
const url = `http://localhost:3000/blogs/${id}`;
let blogs = [];
const articlesWrapper = document.querySelector('.wrapper');
const notificationContainer = document.querySelector('.notification-container');
const notification = notificationContainer.querySelector('.notification');
const closeBtn = notificationContainer.querySelector('button');

window.addEventListener('DOMContentLoaded', getBlog);

async function getBlog(){
    try{
        const response = await fetch(url);
        if(!response.ok){
            notification.textContent = `Error: ${response.url} ${response.status}`;
            notificationContainer.classList.remove('hidden');
            closeBtn.addEventListener('click', () => {
                notificationContainer.classList.add('hidden');
            })
        }
        blogs = await response.json();
        loadBlog();
    }
    catch(error){
        console.log(error);
    }
}


function loadBlog() {
    const h2 = document.createElement('h2');
    h2.textContent = blogs.title;
    const blogHeader = document.createElement('div');
    blogHeader.classList.add('article-header');
    const profile = document.createElement('img');
    profile.classList.add('avatar');
    profile.src = blogs.profile;
    profile.alt = "profile picture";
    const author = document.createElement('div');
    author.textContent = blogs.author + " · " + new Date(blogs.date).toDateString();
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    const editBtn = document.createElement('a');
    editBtn.classList.add('btn', 'edit');
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.href = `edit.html?id=${blogs.id}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'delete');
    deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteBtn.addEventListener('click', async ()=> {await deleteBlog(blogs.id);});
    btnContainer.append(editBtn, deleteBtn);
    blogHeader.append(profile, author , btnContainer);

    const body = document.createElement('p');
    body.classList.add('article-body');
    body.textContent = blogs.content;

    articlesWrapper.append(h2,blogHeader, body);

}

async function deleteBlog(id){
    try{
        const response = await fetch(url, {
            method: 'DELETE',
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