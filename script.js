// script.js
class ThoughtsSharingApp {
    constructor() {
        // Replace with your JSONBin.io API key and bin ID
        this.API_KEY = '$2a$10$ZTJEYKZcZEuS2f3tD.eMpe4C2n7F2bRNm.tc6D.mRP1JBzT5VP296';
        this.BIN_ID = '675d3ae6e41b4d34e46532f0';
        this.API_URL = `https://api.jsonbin.io/v3/b/${this.675d3ae6e41b4d34e46532f0}`;
        
        this.username = localStorage.getItem('username') || '';
        this.posts = [];
        this.setupEventListeners();
        this.loadPosts();
    }

    setupEventListeners() {
        document.getElementById('post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPost();
        });

        // Refresh posts every 30 seconds
        setInterval(() => this.loadPosts(), 30000);
    }

    async loadPosts() {
        try {
            const response = await fetch(this.API_URL, {
                headers: {
                    'X-Master-Key': this.$2a$10$ZTJEYKZcZEuS2f3tD.eMpe4C2n7F2bRNm.tc6D.mRP1JBzT5VP296
                }
            });
            const data = await response.json();
            this.posts = data.record.posts || [];
            this.updateUI();
        } catch (error) {
            console.error('Error loading posts:', error);
            document.getElementById('posts-container').innerHTML = 
                'Error loading posts. Please try again later.';
        }
    }

    async savePosts() {
        try {
            await fetch(this.API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.$2a$10$ZTJEYKZcZEuS2f3tD.eMpe4C2n7F2bRNm.tc6D.mRP1JBzT5VP296
                },
                body: JSON.stringify({ posts: this.posts })
            });
        } catch (error) {
            console.error('Error saving posts:', error);
            alert('Error saving post. Please try again.');
        }
    }

    async createPost() {
        if (!this.username) {
            alert('Please set a username first!');
            return;
        }

        const titleInput = document.getElementById('post-title');
        const contentInput = document.getElementById('post-content');

        const post = {
            id: Date.now(),
            title: titleInput.value,
            content: contentInput.value,
            username: this.username,
            timestamp: new Date().toISOString(),
            likes: 0
        };

        this.posts.unshift(post);
        await this.savePosts();
        this.updateUI();

        titleInput.value = '';
        contentInput.value = '';
    }

    async deletePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post && post.username === this.username) {
            this.posts = this.posts.filter(p => p.id !== postId);
            await this.savePosts();
            this.updateUI();
        } else {
            alert('You can only delete your own posts!');
        }
    }

    async likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            await this.savePosts();
            this.updateUI();
        }
    }

    setUsername(username) {
        this.username = username;
        localStorage.setItem('username', username);
        this.updateUI();
    }

    updateUI() {
        const container = document.getElementById('posts-container');
        container.innerHTML = this.posts.map(post => `
            <div class="post">
                <div class="post-header">
                    <h3>${this.escapeHtml(post.title)}</h3>
                    <small>By ${this.escapeHtml(post.username)} on ${new Date(post.timestamp).toLocaleDateString()}</small>
                </div>
                <p>${this.escapeHtml(post.content)}</p>
                <div class="post-actions">
                    <button onclick="app.likePost(${post.id})">
                        ❤️ ${post.likes}
                    </button>
                    ${post.username === this.username ? 
                        `<button class="delete-btn" onclick="app.deletePost(${post.id})">
                            Delete
                        </button>` : 
                        ''
                    }
                </div>
            </div>
        `).join('');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize app
const app = new ThoughtsSharingApp();

// Global function for setting username
function setUsername() {
    const username = document.getElementById('username').value;
    if (username) {
        app.setUsername(username);
    } else {
        alert('Please enter a username!');
    }
}
