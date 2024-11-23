let chunks = [];
let chatBox = document.getElementById("chat-box");
let transcribedText = "";
window.onerror = (message, source, lineno, colno, error) => {
    console.error("Global Error Caught:", { message, source, lineno, colno, error });
};
window.onunhandledrejection = (event) => {
    console.error("Unhandled Promise Rejection:", event.reason);
};

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const recorder = new MediaRecorder(stream);
    document.getElementById('recordbtn').addEventListener('click', (event) => {
        event.preventDefault();
        if (recorder.state === "inactive") {
            recorder.start();
            chunks = [];
            console.log("Recording...", chunks);
        } else {
            recorder.stop();
            console.log("Stopped recording.", chunks);
        }
    });    
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('uploadFile', audioBlob, 'audio.webm');
        try {
            fetch('http://localhost:8000/api/stt', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                transcribedText = transcribedText+"<p class=\"chat-text\">You: "+data.text+"</p>";
                console.log("Transcribed Text: ", data.text);
                chatBox.innerHTML = transcribedText;
            })
            .catch(error => {
                console.error("Error caught: ", error);
            });
        } catch (error) {
            console.error(err);
        }
    };
});

