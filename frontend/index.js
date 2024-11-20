let chunks = [];
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const recorder = new MediaRecorder(stream);
    document.getElementById('recordbtn').addEventListener('click', () => {
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
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        audio.play(); // Play the audio for validation
        console.log("Audio URL: ", url);
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        fetch('http://localhost:8000/api/speech-to-text', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            console.log("Transcribed Text: ", data.text);
        })
        .catch(error => {
            console.error("Error caught: ", error);
        });
    };
});
