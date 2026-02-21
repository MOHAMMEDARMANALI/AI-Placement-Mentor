import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);
  /* useEffect(() => {
    fetch("http://localhost:5000/api/ai-test")
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []); */

  return (
    <h1>AI Placement Mentor</h1>
  );
}

export default App;
