const root = 'http://jsonplaceholder.typicode.com';
const model = {
    usersClickCounter: 0,
    commentsList: null,
    postsList: null,
    usersList: null,

    load(type) {
        return $.ajax({
            url: `${root}/${type}`,
            method: 'GET',
        });
    },

    normalize() {
        for (const post of this.postsList) {
            post.comments = [];
            for (const comment of this.commentsList) {
                if (post.id === comment.postId) post.comments.push(comment);
            }
        }

        for (const user of this.usersList) {
            user.posts = [];
            for (const post of this.postsList) {
                if (user.id === post.userId) {
                    user.posts.push(post);
                }
            }
        }
    },
};

const view = {
    // remove dependency on view from modules,
    // create handlers for needed events on top level and pass it inside functions
    onUserClick(user) {
        this.showPosts(user.posts);
    },

    showUsers(users) {
        showUserList(users, this.onUserClick.bind(this));
    },

    showPosts: showPostList,
    showComment: showCommentList,
    closeComment: closeCommentList,
};

model.load('users')
    .then((data) => {
        model.usersList = data;
        return model.load('posts');
    }).then((data) => {
        model.postsList = data;
        return model.load('comments');
    }).then((data) => {
        model.commentsList = data;
        model.normalize();
        view.showUsers(model.usersList);
    });
