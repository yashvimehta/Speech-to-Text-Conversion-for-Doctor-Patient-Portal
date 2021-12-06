try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var advicerecognition = new SpeechRecognition();
}
catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}
const advicetextarea = document.querySelector("#advice-textarea")
const advicestart = document.querySelector("#start-record-btn-advice")
const advicepause = document.querySelector("#pause-record-btn-advice")
const advicesave = document.querySelector("#save-note-btn-advice");
const adviceinstructions = document.querySelector("#recording-instructions-advice")
const advicenotes = document.querySelector("#notes-advice")
let advicecontent = "";
let advicecontentstorage = [];

// document.getElementById('advice-textarea').onkeyup = function(event) {
//     if (this.value.length === 0) {
//         advicecontent = "";
//         advicecontentstorage = [];
//       // variable resetting here
//     }
//   }

//Voice Recognition
advicerecognition.continuous = true;

advicerecognition.onresult = function (event) {
    let currentadvice = event.resultIndex;
    let transcriptadvice = event.results[currentadvice][0].transcript;
    advicecontent += transcriptadvice;
    advicetextarea.textContent = advicecontent;
}
advicerecognition.onstart = function () {
    adviceinstructions.innerHTML = "Voice recognition activated. Try speaking into the microphone.";
}

advicerecognition.onspeechend = function () {
    adviceinstructions.innerHTML = "You were quiet for a while so voice recognition turned itself off.";
}

advicerecognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        adviceinstructions.innerHTML = "No speech was detected. Try again.";
    }
}

//App buttons and input
advicestart.addEventListener("click", function () {
    if (advicecontent.length) {
        advicecontent += " ";
    }
    advicerecognition.start()
})
advicepause.addEventListener("click", function () {
    advicerecognition.stop();
    adviceinstructions.innerHTML = "Voice recognition paused.";
})

advicetextarea.addEventListener("input", function () {
    advicecontent = this.value;
})

advicesave.addEventListener("click", function () {
    advicerecognition.stop();
    if (!advicecontent.length) {
        adviceinstructions.innerHTML = "Could not save empty note. Please add a message to your note.";
    }
    else {
        saveadvice(advicecontent);
        advicecontent = "";
        //renderNotes
        renderadvice(getAlladvice());
        advicetextarea.textContent = "";
        adviceinstructions.innerHTML = "Note saved successfully.";
    }
})

//notesList.on
advicenotes.addEventListener("click", function (event) {
    event.preventDefault();
    let advicetarget = event.target;
    let advicecurrenttarget = event.currentTarget
    let arr = advicetarget.id.split(" ");
    let idx = arr[0]
    let guide = arr[1]
    if (guide == "listen-note") {
        let adviceread = advicecurrenttarget.children[idx].childNodes[3].textContent;
        readOutLoudadvice(adviceread)
    }
    else if (guide == "delete-note") {
        let advicedelete = advicecurrenttarget.children[idx].childNodes[3].textContent;
        deleteadvice(advicedelete);
    }

})

//Speech Synthesis
function readOutLoudadvice(message) {
    console.log("advice read out called")
    var speech = new SpeechSynthesisUtterance(`${message}`);
    window.speechSynthesis.speak(speech);
}

//Helper Functions
function renderadvice(advicenotestemp) {
    var htmladvice = "";
    if (advicenotestemp.length) {
        advicenotestemp.map(function (noteadvice) {
            htmladvice += `<li class="note">
            <p class="header" style="margin-top: 15px;">
            <span class="data" style="font-size: 20px; margin-top: 15px; font-color: black;">${noteadvice.content}</span>
            <a href="#" id="${noteadvice.listnum} listen-note" title="   listen to note" style="font-size: 20px; margin-top: 15px; color:black">Listen to Note</a>
            </p>
            <p class="content">${noteadvice.content}</p>
        </li>`;
        })
    }
    else {
        htmladvice = '<li><p class="content">You don\'t have any advice notes yet.</p></li>';
    }
    advicenotes.innerHTML = htmladvice;
}

function saveadvice(advicecontent) {
    advicecontentstorage.push("advice-" + advicecontent);
}

function getAlladvice() {
    let advicenotestemp = [];
    let advicenoteskey;
    for (var i = 0; i < advicecontentstorage.length; i++) {
        advicenoteskey = advicecontentstorage[i];
        if (advicenoteskey.substring(0, 7) == "advice-") {
            advicenotestemp.push({
                listnum: i,
                content: advicecontentstorage[i].replace("advice-", "")
            });
        }
    }
    return advicenotestemp;
}

function deleteadvice(data) {
    console.log(advicecontentstorage)
    advicecontentstorage = advicecontentstorage.filter(function (advicedata) {
        return advicedata != "advice-" + data
    })
    console.log(advicecontentstorage)
}

const getfinaladvicelist = () => {
    return advicecontentstorage;
};