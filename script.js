// script.js
document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const postsList = document.getElementById('posts-list');
    
    // Load posts from localStorage
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    // Display existing posts
    displayPosts();
    
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        
        const post = {
            id: Date.now(),
            title,
            content,
            date: new Date().toLocaleDateString(),
            likes: 0
        };
        
        posts.unshift(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        
        displayPosts();
        postForm.reset();
    });
    
    function displayPosts() {
        postsList.innerHTML = posts.map(post => `
            <div class="post">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <div class="post-footer">
                    <small>Posted on: ${post.date}</small>
                    <button onclick="likePost(${post.id})" class="like-button">
                        ❤️ ${post.likes}
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Make likePost function global
    window.likePost = function(postId) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            localStorage.setItem('posts', JSON.stringify(posts));
            displayPosts();
        }
    };
});
