function createElemWithText(elType = "p", elText = "", elClass){
    const newElement = document.createElement(elType);
    newElement.textContent = elText;
    if (elClass) {
        newElement.classList.add(elClass);
    } 
    return newElement
}


function createSelectOptions(data) {
    if (!data) return;
    const userArray = [];
        data.forEach(users => {
        const newOption = document.createElement("option");
        newOption.value = users.id
        newOption.textContent = users.name
        userArray.push(newOption)
    })
    return userArray;
}

function toggleCommentSection(postId) {
    if (!postId) return;
    console.log(postId)
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if (document.querySelector(`section[data-post-id='${postId}']`)) {
        section.classList.toggle('hide')
    };
    return section;
}

function toggleCommentButton(postId) {
    if (!postId) return;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (document.querySelector(`button[data-post-id='${postId}']`)) {
        if (button.textContent === "Show Comments") {   
            button.textContent = "Hide Comments"
        } else {button.textContent = "Show Comments"}
    }    
    return button;
}

function deleteChildElements(parentElement) {
    if (!parentElement) return;
    
    let child = parentElement.lastElementChild
    while (child) {
        parentElement.removeChild(child)
        child = parentElement.lastElementChild
    };
    return parentElement;
}

function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (buttons) {
        for (let i = 0; i < buttons.length; i++) {
            const postId = buttons[i].dataset.postId
            if (buttons[i].dataset.postId) { 
                buttons[i].addEventListener("click", (e) => {
                    toggleComments(e, postId)
                }, false)
            }
        }
    }
    return buttons;
}

function removeButtonListeners() { 
    const buttons = document.querySelectorAll("main button");
    if (buttons) {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].dataset.id) {
                postId = buttons[i].dataset.id
                buttons[i].removeEventListener ("click", function (e) {
                    toggleComments(e, postId)
                }, false)
            }
        }
    }
    return buttons; 
}

function createComments(comments) {
    if (!comments) return;
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement("article");
        const h3 = createElemWithText('h3', comment.name);
        const p1 = createElemWithText('p', comment.body);
        const p2 = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3)
        article.append(p1)
        article.append(p2)
        fragment.append(article)
    })
    return fragment
}

function populateSelectMenu(data) {
    if (!data) return;
    const selectMenu = document.getElementById("selectMenu");
    const optionData = createSelectOptions(data)
    for (i = 0; i <= optionData.length; i++) {
        selectMenu.append(optionData[i])
    }
    return selectMenu
}

const getUsers = async () => {
    const userData = await fetch("https://jsonplaceholder.typicode.com/users");
    const jsonData = await userData.json();
    try {
        if (!jsonData) {
            throw new Error("User data not uploaded!")
        }
     } catch(err) {
        console.error(err)
     }
    
     return jsonData
}

const getUserPosts = async (userId) => {
    if (!userId) return;
    const postData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
    const jsonData = await postData.json();
    try {
        if (!jsonData) {
            throw new Error("Post data not uploaded!")
        }
     } catch(err) {
        console.error(err)
     }

     return jsonData
}


const getUser = async (userId) => {
    if (!userId) return;
    const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const jsonData = await userData.json()
    try {
        if (!jsonData) {
            throw new Error("User data not uploaded!")
        }
     } catch(err) {
        console.error(err)
     }
     return jsonData
}

const getPostComments = async (postId) => {
    if (!postId) return;
    const postComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
    const jsonComments = await postComments.json();
    try {
        if (!jsonComments) {
            throw new Error("Post data not uploaded!")
        }
     } catch(err) {
        console.error(err)
     }
    
     return jsonComments
}

const displayComments = async (postId) => {
    if (!postId) return;
    const newSection = document.createElement("section");
    newSection.dataset.postId = postId;
    newSection.classList.add("comments");
    newSection.classList.add("hide");
    let comments = await getPostComments(postId);
    let fragment = createComments(comments);
    newSection.append(fragment);
    return newSection

}

const createPosts = async (postData) => {
    if (!postData) return;
    const newFragment = document.createDocumentFragment();    
    for (let i = 0; i < postData.length; i++) {
        post = postData[i]
        article = document.createElement("article");
        const h2 = createElemWithText("h2", `${post.title}`);
        const postBody = createElemWithText("p", `${post.body}`);
        const getPostId = createElemWithText("p", `Post ID: ${post.id}`);
        let author = await getUser(post.userId);
        const authorName = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        const catchphrase = createElemWithText("p", `${author.company.catchPhrase}`);
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = `${post.id}`;
        let section = await displayComments(post.id);
        article.append(h2, postBody, getPostId, authorName, catchphrase, button, section)
        newFragment.append(article);
    }
    return newFragment

}

const displayPosts = async (postData) => {
    const main = document.querySelector("main");
    let element = (postData) ? await createPosts(postData) :
        createElemWithText("p", "Select an Employee to display their posts.", "default-text")
    main.append(element);
    return element
}

function toggleComments(event, postId) {
    if (!event, !postId) return;
    event.target.listener = true;
    section = toggleCommentSection(postId);
    button = toggleCommentButton(postId);
    return [section, button];
}

const refreshPosts = async (postData) => {  
    if (!postData) return;               
    const removeButtons = removeButtonListeners(); 
    const main = deleteChildElements(document.querySelector('main'));    
    const fragment = await displayPosts(postData)
    const addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons]

}

const selectMenuChangeEventHandler = async (event) => { 
    if (!event) return;
    select = document.querySelector("select");
    select.disabled = true;
    userId = event?.target?.value || 1;
    posts = await getUserPosts(userId);
    refreshPostsArray = await refreshPosts(posts);
    select.disabled = false
    return [userId, posts, refreshPostsArray];

}

const initPage = async () => {
    users = await getUsers();
    select = populateSelectMenu(users);
    return [users, select]
}

function initApp() {   
    initPage()
    select = document.getElementById("selectMenu");
    select.addEventListener("change", function (e) {selectMenuChangeEventHandler(e)})
    

}

document.addEventListener("DOMContentLoaded", initApp())