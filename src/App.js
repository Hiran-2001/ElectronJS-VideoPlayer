import { useEffect, useState } from "react";
import "./App.css";
import Modal from "react-modal";
import { TailSpin } from "react-loader-spinner";

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [videoBuffer, setVideoBuffer] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let imagePath = "/home/efin/SampleImages";

  useEffect(() => {
    window.electron.ipcRenderer.send("folder-path", imagePath);
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setVideoBuffer(null);
    setModalIsOpen(false);
  };

  window.electron.ipcRenderer.on("load-image", (event, data) => {
    const imageContainer = document.getElementById("imageContainer");
    if (data.error) {
      return;
    } else {
      imageContainer.innerHTML = "";

      data.images.forEach(({ buffer, fileName }) => {
        const imgElement = document.createElement("img");
        const blob = new Blob([buffer], { type: "image" });
        const imgUrl = URL.createObjectURL(blob);

        imgElement.src = imgUrl;
        imgElement.alt = fileName;
        imgElement.classList.add("img");
        imageContainer.appendChild(imgElement);

        let folderPath = "/home/efin/SampleVideos";
        imgElement.addEventListener("click", () => {
          setIsLoading(true);
          window.electron.ipcRenderer.send(
            "open-video-window",
            window.electron.path.join(
              folderPath,
              fileName.replace(/\.\w+$/, ".mp4")
            )
          );
          openModal();
        });
      });
    }
  });

  window.electron.ipcRenderer.on("video-buffer", (event, data) => {
    setVideoBuffer(data?.videoBuffer);
    
      setTimeout(()=>{
        setIsLoading(false);
      },500)
    
  });

  // console.log(images);
  return (
    <div className="App">
      <div>
        <div id="imageContainer"></div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="video Modal"
        >
          {videoBuffer && isLoading === false ? (
            <div className="videoDiv">
              <button className="btn" onClick={closeModal}>
                X
              </button>
              <video id="video-tag" autoPlay>
                <source src={`data:video/mp4;base64,${videoBuffer}`} />
              </video>
            </div>
          ) : (
            <div className="loader">
              <TailSpin
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>

          )}
        </Modal>
      </div>
    </div>
  );
}

export default App;
