try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var diagnosisrecognition = new SpeechRecognition();
}
catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}
const diagnosistextarea = document.querySelector("#diagnosis-textarea")
const diagnosisstart = document.querySelector("#start-record-btn-diagnosis")
const diagnosispause = document.querySelector("#pause-record-btn-diagnosis")
const diagnosissave = document.querySelector("#save-note-btn-diagnosis");
const diagnosisinstructions = document.querySelector("#recording-instructions-diagnosis")
const diagnosisnotes = document.querySelector("#notes-diagnosis")
let diagnosiscontent = "";
let diagnosiscontentstorage = [];

// document.getElementById('diagnosis-textarea').onkeyup = function(event) {
//     if (this.value.length === 0) {
//         diagnosiscontent = "";
//         diagnosiscontentstorage = [];
//       // variable resetting here
//     }
//   }

//Voice Recognition
diagnosisrecognition.continuous = true;

diagnosisrecognition.onresult = function (event) {
    let currentdiagnosis = event.resultIndex;
    let transcriptdiagnosis = event.results[currentdiagnosis][0].transcript;
    diagnosiscontent += transcriptdiagnosis;
    diagnosistextarea.textContent = diagnosiscontent;
}
diagnosisrecognition.onstart = function () {
    diagnosisinstructions.innerHTML = "Voice recognition activated. Try speaking into the microphone.";
}

diagnosisrecognition.onspeechend = function () {
    diagnosisinstructions.innerHTML = "You were quiet for a while so voice recognition turned itself off.";
}

diagnosisrecognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        diagnosisinstructions.innerHTML = "No speech was detected. Try again.";
    }
}

//App buttons and input
diagnosisstart.addEventListener("click", function () {
    if (diagnosiscontent.length) {
        diagnosiscontent += " ";
    }
    diagnosisrecognition.start()
})
diagnosispause.addEventListener("click", function () {
    diagnosisrecognition.stop();
    diagnosisinstructions.innerHTML = "Voice recognition paused.";
})

diagnosistextarea.addEventListener("input", function () {
    diagnosiscontent = this.value;
})

diagnosissave.addEventListener("click", function () {
    diagnosisrecognition.stop();
    // if (!diagnosiscontent.length) {
    //     diagnosisinstructions.innerHTML = "Could not save empty note. Please add a message to your note.";
    // }
    // else {
        savediagnosis(diagnosiscontent);
        diagnosiscontent = "";
        //renderNotes
        renderdiagnosis(getAlldiagnosis());
        diagnosistextarea.textContent = "";
        diagnosisinstructions.innerHTML = "Note saved successfully.";
    // }
})

//notesList.on
diagnosisnotes.addEventListener("click", function (event) {
    event.preventDefault();
    let diagnosistarget = event.target;
    let diagnosiscurrenttarget = event.currentTarget
    let arr = diagnosistarget.id.split(" ");
    let idx = arr[0]
    let guide = arr[1]
    if (guide == "listen-note") {
        let diagnosisread = diagnosiscurrenttarget.children[idx].childNodes[3].textContent;
        readOutLouddiagnosis(diagnosisread)
    }
    else if (guide == "delete-note") {
        let diagnosisdelete = diagnosiscurrenttarget.children[idx].childNodes[3].textContent;
        deletediagnosis(diagnosisdelete);
    }
})

//Speech Synthesis
function readOutLouddiagnosis(message) {
    console.log("diagnosis read out called")
    var speech = new SpeechSynthesisUtterance(`${message}`);
    window.speechSynthesis.speak(speech);
}

//Helper Functions
function renderdiagnosis(diagnosisnotestemp) {
    var htmldiagnosis = "";
    if (diagnosisnotestemp.length) {
        diagnosisnotestemp.map(function (notediagnosis) {
            htmldiagnosis += `<li class="note">
            <p class="header" style="margin-top: 15px;">
            <span class="data" style="font-size: 20px; margin-top: 15px; font-color: black;">${notediagnosis.content}</span>
            <a href="#" id="${notediagnosis.listnum} listen-note" title="Listen to Note" style="font-size: 20px; margin-top: 15px;">Listen to Note</a>
            </p>
            <p class="content">${notediagnosis.content}</p>
        </li>`;
        })
    }
    else {
        htmldiagnosis = '<li><p class="content">You don\'t have any diagnosis notes yet.</p></li>';
    }
    diagnosisnotes.innerHTML = htmldiagnosis;
}

function savediagnosis(diagnosiscontent) {
    diagnosiscontentstorage.push("diagnosis-Fever" );
}

function getAlldiagnosis() {
    let diagnosisnotestemp = [];
    let diagnosisnoteskey;
    for (var i = 0; i < diagnosiscontentstorage.length; i++) {
        diagnosisnoteskey = diagnosiscontentstorage[i];
        if (diagnosisnoteskey.substring(0, 10) == "diagnosis-") {
            diagnosisnotestemp.push({
                listnum: i,
                content: diagnosiscontentstorage[i].replace("diagnosis-", "")
            });
        }
    }
    return diagnosisnotestemp;
}

function deletediagnosis(data) {
    diagnosiscontentstorage = diagnosiscontentstorage.filter(function (diagnosisdata) {
        return diagnosisdata != "diagnosis-" + data
    })
}

const getfinaldiagnosislist = () => {
    return diagnosiscontentstorage;
};