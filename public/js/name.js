try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; //to check if browser supports SpeechRecognition class
    var namerecognition = new SpeechRecognition(); //create an object 
}
catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}
const nametextarea = document.querySelector("#name-textarea")
const namestart = document.querySelector("#start-record-btn-name")
const namepause = document.querySelector("#pause-record-btn-name")
const namesave = document.querySelector("#save-note-btn-name");
const nameinstructions = document.querySelector("#recording-instructions-name")
const namenotes = document.querySelector("#notes-name")
let namecontent = "";
let namecontentstorage = [];

// document.getElementById('name-textarea').onkeyup = function(event) {
//     if (this.value.length === 0) {
//         namerecognition.start();
//     }
//   }

//Voice Recognition
namerecognition.continuous = true; //to listen continuously 

namerecognition.onresult = function (event) {
    console.log("YUUUUUUu");
    let currentname = event.resultIndex;
    let transcriptname = event.results[currentname][0].transcript;
    namecontent += transcriptname;
    nametextarea.textContent = namecontent;
    console.log(namecontent);
}

namerecognition.onstart = function () {
    nameinstructions.innerHTML = "Voice recognition activated. Try speaking into the microphone.";
}

namerecognition.onspeechend = function () {
    nameinstructions.innerHTML = "You were quiet for a while so voice recognition turned itself off.";
}

namerecognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        nameinstructions.innerHTML = "No speech was detected. Try again.";
    }
}

//App buttons and input
namestart.addEventListener("click", function () {
    if (namecontent.length) {
        namecontent += " ";
    }
    namerecognition.start()
})
namepause.addEventListener("click", function () {
    namerecognition.stop();
    nameinstructions.innerHTML = "Voice recognition paused.";
})

nametextarea.addEventListener("input", function () {
    namecontent = this.value;
})

namesave.addEventListener("click", function () {
    namerecognition.stop();
    if (!namecontent.length) {
        nameinstructions.innerHTML = "Could not save empty note. Please add a message to your note.";
    }
    else {
        savename(namecontent);
        namecontent = "";
        //renderNotes
        rendername(getAllname());
        // console.log("woedrftj");
        // console.log(nametextarea.textContent);
        nametextarea.textContent = "";
        nameinstructions.innerHTML = "Note saved successfully.";
    }
})

//notesList.on
namenotes.addEventListener("click", function (event) {
    event.preventDefault();
    let nametarget = event.target;
    let namecurrenttarget = event.currentTarget
    let arr = nametarget.id.split(" ");
    let idx = arr[0]
    let guide = arr[1]
    if (guide == "listen-note") {
        let nameread = namecurrenttarget.children[idx].childNodes[3].textContent;
        readOutLoudname(nameread)
    }
    else if (guide == "delete-note") {
        let namedelete = namecurrenttarget.children[idx].childNodes[3].textContent;
        deletename(namedelete);
    }
})

//Speech Synthesis
function readOutLoudname(message) {
    console.log("name read out called")
    var speech = new SpeechSynthesisUtterance(`${message}`);
    window.speechSynthesis.speak(speech);
}

//Helper Functions
function rendername(namenotestemp) {
    var htmlname = "";
    if (namenotestemp.length) {
        namenotestemp.map(function (notename) {
            htmlname += `<li class="note">
            <p class="header" style="margin-top: 15px;">
            <span class="data" style="font-size: 20px; margin-top: 15px; font-color: black;">${notename.content}</span>
            <a href="#" id="${notename.listnum} listen-note" title="Listen to Note" style="font-size: 20px; margin-top: 15px;">Listen to Note</a>
            </p>
            <p class="content">${notename.content}</p>
        </li>`;
        })
    }
    else {
        htmlname = '<li><p class="content">You don\'t have any name notes yet.</p></li>';
    }
    namenotes.innerHTML = htmlname;
}

function savename(namecontent) {
    namecontentstorage.push("name-" + namecontent);
}

function getAllname() {
    let namenotestemp = [];
    let namenoteskey;
    for (var i = 0; i < namecontentstorage.length; i++) {
        namenoteskey = namecontentstorage[i];
        if (namenoteskey.substring(0, 5) == "name-") {
            namenotestemp.push({
                listnum: i,
                content: namecontentstorage[i].replace("name-", "")
            });
        }
    }
    return namenotestemp;
}

// function deletename(data) {
//     console.log(namecontentstorage)
//     namecontentstorage = namecontentstorage.filter(function (namedata) {
//         return namedata != "name-" + data
//     })
//     console.log(namecontentstorage)
// }
const getfinalnamelist = () => {
    return namecontentstorage;
};


// try {
//     var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     var namerecognition = new SpeechRecognition();
// }
// catch (e) {
//     console.error(e);
//     $('.no-browser-support').show();
//     $('.app').hide();
// }
// const nametextarea = document.querySelector("#name-textarea")
// const namestart = document.querySelector("#start-record-btn-name")
// const namepause = document.querySelector("#pause-record-btn-name")
// const namesave = document.querySelector("#save-note-btn-name");
// const nameinstructions = document.querySelector("#recording-instructions-name")
// const namenotes = document.querySelector("#notes-name")
// let namecontent = "";
// let namecontentstorage = [];

// //Voice Recognition
// namerecognition.continuous = true;

// namerecognition.onresult = function (event) {
//     let currentname = event.resultIndex;
//     let transcriptname = event.results[currentname][0].transcript;
//     // var mobileRepeatBug = (currentname == 1 && transcriptname == event.results[0][0].transcript);
//     // if (!mobileRepeatBug) {
//     namecontent += transcriptname;
//     nametextarea.textContent = namecontent;
//     // }
// }
// namerecognition.onstart = function () {
//     nameinstructions.innerHTML = "Voice recognition activated. Try speaking into the microphone.";
// }

// namerecognition.onspeechend = function () {
//     nameinstructions.innerHTML = "You were quiet for a while so voice recognition turned itself off.";
// }

// namerecognition.onerror = function (event) {
//     if (event.error == 'no-speech') {
//         nameinstructions.innerHTML = "No speech was detected. Try again.";
//     }
// }

// //App buttons and input
// namestart.addEventListener("click", function () {
//     if (namecontent.length) {
//         namecontent += " ";
//     }
//     namerecognition.start()
// })
// namepause.addEventListener("click", function () {
//     namerecognition.stop();
//     nameinstructions.innerHTML = "Voice recognition paused.";
// })

// nametextarea.addEventListener("input", function () {
//     namecontent = this.value;
// })

// namesave.addEventListener("click", function () {
//     namerecognition.stop();
//     if (!namecontent.length) {
//         nameinstructions.innerHTML = "Could not save empty note. Please add a message to your note.";
//     }
//     else {
//         savename(namecontent);
//         namecontent = "";
//         //renderNotes
//         rendername(getAllname());
//         nametextarea.textContent = "";
//         nameinstructions.innerHTML = "Note saved successfully.";
//     }
// })

// //notesList.on
// namenotes.addEventListener("click", function (event) {
//     event.preventDefault();
//     let nametarget = event.target;
//     let namecurrenttarget = event.currentTarget
//     let arr = nametarget.id.split(" ");
//     let idx = arr[0]
//     let guide = arr[1]
//     if (guide == "listen-note") {
//         // console.log(namecurrenttarget.children)
//         let nameread = namecurrenttarget.children[idx].childNodes[3].textContent;
//         // console.log(nameread)
//         readOutLoudname(nameread)
//     }
//     else if (guide == "delete-note") {
//         let namedelete = namecurrenttarget.children[idx].childNodes[3].textContent;
//         deletename(namedelete);
//     }

// })

// //Speech Synthesis
// function readOutLoudname(message) {
//     console.log("name read out called")
//     var speech = new SpeechSynthesisUtterance(`${message}`);
//     window.speechSynthesis.speak(speech);
// }

// //Helper Functions
// function rendername(namenotestemp) {
//     var htmlname = "";
//     if (namenotestemp.length) {
//         namenotestemp.map(function (notename) {
//             htmlname += `<li class="note">
//             <p class="header">
//             <span class="data">${notename.content}</span>
//             <a href="#" id="${notename.listnum} listen-note" title="Listen to Note">Listen to Note</a>
//             <a href="#" id="${notename.listnum} delete-note" title="Delete">Delete</a>
//             </p>
//             <p class="content">${notename.content}</p>
//         </li>`;
//         })
//     }
//     else {
//         htmlname = '<li><p class="content">You don\'t have any name notes yet.</p></li>';
//     }
//     namenotes.innerHTML = htmlname;
// }

// function savename(namecontent) {
//     namecontentstorage.push("name-" + namecontent);
// }

// function getAllname() {
//     let namenotestemp = [];
//     let namenoteskey;
//     for (var i = 0; i < namecontentstorage.length; i++) {
//         namenoteskey = namecontentstorage[i];
//         if (namenoteskey.substring(0, 5) == "name-") {
//             namenotestemp.push({
//                 listnum: i,
//                 content: namecontentstorage[i].replace("name-", "")
//             });
//         }
//     }
//     return namenotestemp;
// }

// function deletename(data) {
//     console.log(namecontentstorage)
//     namecontentstorage = namecontentstorage.filter(function (namedata) {
//         return namedata != "name-" + data
//     })
//     console.log(namecontentstorage)
// }
// const getfinalnamelist = () => {
//     return namecontentstorage;
// };