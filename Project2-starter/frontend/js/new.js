"use strict";

let blog = {};

const form = document.querySelector('form');
const titleValue = form.querySelector('#title');
const contentValue = form.querySelector('#content');
const authorValue = form.querySelector('#author');
const submitBtn = form.querySelector('button');
const notificationContainer = document.querySelector('.notification-container');
const notification = notificationContainer.querySelector('.notification');
const closeBtn = notificationContainer.querySelector('button');
const url = 'http://localhost:3000/blogs';

window.addEventListener('DOMContentLoaded', getBlogs);

async function getBlogs() {
    
    
    try{
        const response = await fetch(`${url}?_sort=-date`);
        
        
        if(!response.ok){
            notification.textContent = `Error: ${response.url} ${response.status}`;
            notificationContainer.classList.remove('hidden');
            closeBtn.addEventListener('click', () => {
                notificationContainer.classList.add('hidden');
            })

        }
        

        blog = await response.json();
        

        
    }
    catch(error){
        console.log(error);
    }

}



submitBtn.addEventListener('click', addBlog);

async function addBlog(e) {
    if(form.reportValidity()){
        e.preventDefault();

        let title = titleValue.value;
        let content = contentValue.value;
        let author = authorValue.value;
        let date = new Date()
        let profile = 'images/default.jpeg';

        blog = {
            title,
            author,
            date,
            profile,
            content
        };

        try{
            const response = await fetch(`${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blog),
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


