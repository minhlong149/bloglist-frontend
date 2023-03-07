import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

function App() {
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newURL, setNewURL] = useState('');

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  function logOut() {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      blogService.setToken(user.token);
      setUsername('');
      setPassword('');
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
    } catch (exception) {
      console.log('Wrong credentials');
    }
  };

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title: newTitle,
        author: newAuthor,
        url: newURL,
      };
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setNewTitle('');
      setNewAuthor('');
      setNewURL('');
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };

  const Login = (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const BlogForm = (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          name="title"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">Author: </label>
        <input
          type="text"
          name="author"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">Url: </label>
        <input
          type="text"
          name="author"
          value={newURL}
          onChange={({ target }) => setNewURL(target.value)}
        />
      </div>
      <input type="submit" value="Create"></input>
    </form>
  );

  const Blogs = (
    <div>
      <h2>blogs</h2>
      <button onClick={() => logOut()}>Log out</button>
      <p>{user?.name} logged in</p>
      {BlogForm}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  return <>{user === null ? Login : Blogs}</>;
}

export default App;
