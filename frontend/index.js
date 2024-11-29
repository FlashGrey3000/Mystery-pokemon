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




const options = ["Bulbasaur","Ivysaur","Venusaur","Charmander","Charmeleon","Charizard","Squirtle","Wartortle","Blastoise","Caterpie","Metapod","Butterfree","Weedle","Kakuna","Beedrill","Pidgey","Pidgeotto","Pidgeot","Rattata","Raticate","Spearow","Fearow","Ekans","Arbok","Pikachu","Raichu","Sandshrew","Sandslash","Nidoran","Nidorina","Nidoqueen","Nidoran","Nidorino","Nidoking","Clefairy","Clefable","Vulpix","Ninetales","Jigglypuff","Wigglytuff","Zubat","Golbat","Oddish","Gloom","Vileplume","Paras","Parasect","Venonat","Venomoth","Diglett","Dugtrio","Meowth","Persian","Psyduck","Golduck","Mankey","Primeape","Growlithe","Arcanine","Poliwag","Poliwhirl","Poliwrath","Abra","Kadabra","Alakazam","Machop","Machoke","Machamp","Bellsprout","Weepinbell","Victreebel","Tentacool","Tentacruel","Geodude","Graveler","Golem","Ponyta","Rapidash","Slowpoke","Slowbro","Magnemite","Magneton","Farfetch'd","Doduo","Dodrio","Seel","Dewgong","Grimer","Muk","Shellder","Cloyster","Gastly","Haunter","Gengar","Onix","Drowzee","Hypno","Krabby","Kingler","Voltorb","Electrode","Exeggcute","Exeggutor","Cubone","Marowak","Hitmonlee","Hitmonchan","Lickitung","Koffing","Weezing","Rhyhorn","Rhydon","Chansey","Tangela","Kangaskhan","Horsea","Seadra","Goldeen","Seaking","Staryu","Starmie","Mr. Mime","Scyther","Jynx","Electabuzz","Magmar","Pinsir","Tauros","Magikarp","Gyarados","Lapras","Ditto","Eevee","Vaporeon","Jolteon","Flareon","Porygon","Omanyte","Omastar","Kabuto","Kabutops","Aerodactyl","Snorlax","Articuno","Zapdos","Moltres","Dratini","Dragonair","Dragonite","Mewtwo","Mew"];
const input = document.getElementById('autocomplete');
const suggestions = document.getElementById('suggestions');

input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    suggestions.innerHTML = '';

    if (query) {
        const filteredOptions = options.filter(option => option.toLowerCase().includes(query));
        
        filteredOptions.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option;
            li.addEventListener('click', () => {
                input.value = option; // Set input value to selected suggestion
                suggestions.innerHTML = ''; // Clear suggestions
            });
            suggestions.appendChild(li);
        });
    }
});
