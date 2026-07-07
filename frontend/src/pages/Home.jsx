import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to KADA Forum</h1>
        <p>Korea-ASEAN Digital Academy Discussion Board</p>
        <p className="hero-subtitle">
          Connect with fellow students, share knowledge, and discuss topics
          about Web Development, AI/ML, DevOps, and more.
        </p>
        <Link to="/posts" className="btn-primary">
          Browse Posts
        </Link>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Share Knowledge</h3>
          <p>Post your questions and insights with the community.</p>
        </div>
        <div className="feature">
          <h3>Learn Together</h3>
          <p>Discuss topics from the KADA curriculum.</p>
        </div>
        <div className="feature">
          <h3>Build Network</h3>
          <p>Connect with fellow KADA students and mentors.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
