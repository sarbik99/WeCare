import { useState } from "react";
import { Button } from "./ui/Button ";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";


const userInfo = [];
const moderatorInfo = [{ email: "mod@example.com", password: "mod123" }];

export default function Hailpamon() {
  const [showPopup, setShowPopup] = useState(true);
  const [isExistingUser, setIsExistingUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [postContent, setPostContent] = useState("");

  const handleLoginSignup = () => {
    if (isExistingUser) {
      const user = userInfo.find(u => u.email === email && u.password === password);
      const mod = moderatorInfo.find(m => m.email === email && m.password === password);
      if (user || mod) {
        setLoggedInUser(user || mod);
        setShowPopup(false);
      } else {
        alert("Invalid credentials!");
      }
    } else {
      userInfo.push({ email, password });
      setLoggedInUser({ email, password });
      setShowPopup(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setShowPopup(true);
    setIsExistingUser(null);
  };

  const handlePost = () => {
    if (postContent.trim()) {
      setPendingPosts([...pendingPosts, { id: Date.now(), content: postContent, comments: [] }]);
      setPostContent("");
    }
  };

  const handleApprovePost = (id) => {
    const post = pendingPosts.find(p => p.id === id);
    setPosts([...posts, post]);
    setPendingPosts(pendingPosts.filter(p => p.id !== id));
  };

  const handleComment = (postId, comment) => {
    if (comment.trim()) {
      setPosts(posts.map(post => post.id === postId ? { ...post, comments: [...post.comments, comment] } : post));
    }
  };

  return (
    <div className="p-4">
      {loggedInUser && (
        <div className="absolute top-4 right-4">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      )}
      
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <Card className="p-4">
            <CardContent>
              <h2 className="text-xl font-bold">{isExistingUser === null ? "Welcome" : isExistingUser ? "Login" : "Sign Up"}</h2>
              {isExistingUser === null ? (
                <>
                  <Button onClick={() => setIsExistingUser(true)}>Login</Button>
                  <Button onClick={() => setIsExistingUser(false)}>Sign Up</Button>
                </>
              ) : (
                <>
                  <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                  <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                  <Button onClick={handleLoginSignup}>{isExistingUser ? "Login" : "Sign Up"}</Button>
                  <Button onClick={() => setIsExistingUser(null)}>Back</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {loggedInUser && !moderatorInfo.some(m => m.email === loggedInUser.email) && (
        <div>
          <textarea className="w-full h-32 p-2 border rounded" placeholder="Share your thoughts..." value={postContent} onChange={e => setPostContent(e.target.value)} />
          <Button onClick={handlePost}>Post</Button>
        </div>
      )}

      {loggedInUser && moderatorInfo.some(m => m.email === loggedInUser.email) && (
        <div>
          <h2 className="text-xl">Pending Posts</h2>
          {pendingPosts.map(post => (
            <Card key={post.id} className="m-2 p-4">
              <CardContent>
                <p>{post.content}</p>
                <Button onClick={() => handleApprovePost(post.id)}>Approve</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-xl">Approved Posts</h2>
        {posts.map(post => (
          <Card key={post.id} className="m-2 p-4">
            <CardContent>
              <p>{post.content}</p>
              <Input placeholder="Comment..." onChange={e => setPostContent(e.target.value)} />
              <Button onClick={() => handleComment(post.id, postContent)}>Comment</Button>
              <div className="ml-4 border-l pl-4">
                {post.comments.map((comment, index) => (
                  <p key={index}>{comment}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
