try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var prescriptionrecognition = new SpeechRecognition();
}
catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}
const prescriptiontextarea = document.querySelector("#prescription-textarea")
const prescriptionstart = document.querySelector("#start-record-btn-prescription")
const prescriptionpause = document.querySelector("#pause-record-btn-prescription")
const prescriptionsave = document.querySelector("#save-note-btn-prescription");
const prescriptioninstructions = document.querySelector("#recording-instructions-prescription")
const prescriptionnotes = document.querySelector("#notes-prescription")
let prescriptioncontent = "";
let prescriptioncontentstorage = [];

// document.getElementById('prescription-textarea').onkeyup = function(event) {
//     if (this.value.length === 0) {
//         prescriptioncontent = "";
//         prescriptioncontentstorage = [];
//       // variable resetting here
//     }
//   }

//Voice Recognition
prescriptionrecognition.continuous = true;

prescriptionrecognition.onresult = function (event) {
    let currentprescription = event.resultIndex;
    let transcriptprescription = event.results[currentprescription][0].transcript;
    prescriptioncontent += transcriptprescription;
    prescriptiontextarea.textContent = prescriptioncontent;
}
prescriptionrecognition.onstart = function () {
    prescriptioninstructions.innerHTML = "Voice recognition activated. Try speaking into the microphone.";
}

prescriptionrecognition.onspeechend = function () {
    prescriptioninstructions.innerHTML = "You were quiet for a while so voice recognition turned itself off.";
}

prescriptionrecognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        prescriptioninstructions.innerHTML = "No speech was detected. Try again.";
    }
}

//App buttons and input
prescriptionstart.addEventListener("click", function () {
    if (prescriptioncontent.length) {
        prescriptioncontent += " ";
    }
    prescriptionrecognition.start()
})
prescriptionpause.addEventListener("click", function () {
    prescriptionrecognition.stop();
    prescriptioninstructions.innerHTML = "Voice recognition paused.";
})

prescriptiontextarea.addEventListener("input", function () {
    prescriptioncontent = this.value;
})

prescriptionsave.addEventListener("click", function () {
    prescriptionrecognition.stop();
    // if (!prescriptioncontent.length) {
    //     prescriptioninstructions.innerHTML = "Could not save empty note. Please add a message to your note.";
    // }
    // else {
        saveprescription(prescriptioncontent);
        prescriptioncontent = "";
        //renderNotes
        renderprescription(getAllprescription());
        prescriptiontextarea.textContent = "";
        prescriptioninstructions.innerHTML = "Note saved successfully.";
    // }
})

//notesList.on
prescriptionnotes.addEventListener("click", function (event) {
    event.preventDefault();
    let prescriptiontarget = event.target;
    let prescriptioncurrenttarget = event.currentTarget
    let arr = prescriptiontarget.id.split(" ");
    let idx = arr[0]
    let guide = arr[1]
    if (guide == "listen-note") {
        let prescriptionread = prescriptioncurrenttarget.children[idx].childNodes[3].textContent;
        readOutLoudprescription(prescriptionread)
    }
    else if (guide == "delete-note") {
        let prescriptiondelete = prescriptioncurrenttarget.children[idx].childNodes[3].textContent;
        deleteprescription(prescriptiondelete);
    }

})

//Speech Synthesis
function readOutLoudprescription(message) {
    console.log("prescription read out called")
    var speech = new SpeechSynthesisUtterance(`${message}`);
    window.speechSynthesis.speak(speech);
}

//Helper Functions
function renderprescription(prescriptionnotestemp) {
    var htmlprescription = "";
    if (prescriptionnotestemp.length) {
        prescriptionnotestemp.map(function (noteprescription) {
            htmlprescription += `<li class="note">
            <p class="header" style="margin-top: 15px;">
            <span class="data" style="font-size: 20px; margin-top: 15px; font-color: black;">${noteprescription.content}</span>
            <a href="#" id="${noteprescription.listnum} listen-note" title="Listen to Note" style="font-size: 20px; margin-top: 15px;">Listen to Note</a>
            </p>
            <p class="content">${noteprescription.content}</p>
        </li>`;
        })
    }
    else {
        htmlprescription = '<li><p class="content">You don\'t have any prescription notes yet.</p></li>';
    }
    prescriptionnotes.innerHTML = htmlprescription;
}

function saveprescription(prescriptioncontent) {
    prescriptioncontentstorage.push("prescription-Crocin");
}

function getAllprescription() {
    let prescriptionnotestemp = [];
    let prescriptionnoteskey;
    for (var i = 0; i < prescriptioncontentstorage.length; i++) {
        prescriptionnoteskey = prescriptioncontentstorage[i];
        if (prescriptionnoteskey.substring(0, 13) == "prescription-") {
            prescriptionnotestemp.push({
                listnum: i,
                content: prescriptioncontentstorage[i].replace("prescription-", "")
            });
        }
    }
    return prescriptionnotestemp;
}

function deleteprescription(data) {
    console.log(prescriptioncontentstorage)
    prescriptioncontentstorage = prescriptioncontentstorage.filter(function (prescriptiondata) {
        return prescriptiondata != "prescription-" + data
    })
    console.log(prescriptioncontentstorage)
}

const getfinalprescriptionlist = () => {
    return prescriptioncontentstorage;
};