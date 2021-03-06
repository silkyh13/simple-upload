import React, {useState} from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const [test, setTest] = useState("Not working")

  axios.get("/api/test").then(res => {
    setTest(res.data);
  })

  const fileSelectedHandler = (event) => {
    setSelectedFile(event.target.files[0])
  };
  const fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('image', selectedFile)
    axios.post('/api/image', fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log(res);
      setImages([...images, res.data]);
    })
    .catch((err) => console.error(err.response));
  };

  return (
    <div className="App">
      <input type="file" onChange={fileSelectedHandler}/>
      <button onClick={fileUploadHandler}>Upload</button>
      <div style={{display: "flex", justifyContent: "column"}}>
        {images.map((image, i) => <img key={i} style={{width:"500px"}} src={image} />)}
      </div>

    </div>
  );
}

export default App;
