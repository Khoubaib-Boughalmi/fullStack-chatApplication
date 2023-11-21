import { Link } from "react-router-dom"

export const NavBar = () => {
  return (
    <nav>
        <Link to="/" style={{ margin: 10 }}>Home</Link>
        <Link to="/blog" style={{ margin: 10 }}>Blog</Link>
        <Link to="/posts" style={{ margin: 10 }}>Posts</Link>
    </nav>
  )
}
