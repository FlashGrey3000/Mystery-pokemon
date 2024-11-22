let chunks = [];
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
                console.log("Transcribed Text: ", data.text);
            })
            .catch(error => {
                console.error("Error caught: ", error);
            });
        } catch (error) {
            console.error(err);
        }
    };
});


let coffee = document.getElementById("coffee");
let chatBox = document.getElementById("chat-box");

coffee.addEventListener('click', function (e) {
    const baseUrl = "http://127.0.0.1:8000/item";

    fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 8, name: chatBox.textContent, price: 1500.0, tax: 7.5 }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.sale_type) {
                chatBox.innerHTML = "<p class=\"chat-text\">"+data.sale_type+"</p>";
            } else {
                chatBox.textContent = "no sale ongoing...";
            }
        })
        .catch(error => {
            console.error("Error caught:", error);
            chatBox.innerHTML = "An error occurred. Please try again later.";
        });
});

