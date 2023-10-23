import "./styles.css";

function Homepage() {
  return (
    <>
      <nav>
        <a href="/">Home</a>
        <a href="/upload">Upload</a>
        <a href="/allDocuments">All documents</a>
      </nav>
      <div className="img-container">
        <div className="content">Storing medical documents</div>
      </div>
      <div className="container">Hello World</div>
    </>
  );
}
export default Homepage;
