let mediaRecorder;
let localStream;
let chunks = [];
let recordedNumber;
window.AudioContext = window.AudioContext || window.webkitAudioContext;  
const audioCtx = new AudioContext();
let source;
let audioBuffer = [];
//const audio = document.getElementById("audio");
const snr = new Tone.NoiseSynth().toMaster();
const bass = new Tone.MembraneSynth().toMaster();
const cym = new Tone.PluckSynth().toMaster();
const metal = new Tone.MetalSynth().toMaster();
const poly = new Tone.PolySynth().toMaster();




function recordingStart(){
    recordedNumber = document.getElementById("drum-number");
    navigator.mediaDevices.getUserMedia({audio: true }).then(function (stream) {
        localStream = stream;
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm'
        });
        mediaRecorder.start();
        console.log("Status: " + mediaRecorder.state);                    
    }).catch(function (err) {
            console.log(err);
    });
}

function recordingStop(){
    if (mediaRecorder.state != 'inactive'){
        mediaRecorder.stop();   
        console.log("Status: " + mediaRecorder.state);
    }

    mediaRecorder.ondataavailable = function (event) {
        //audio.src = window.URL.createObjectURL(event.data);//audio tag
        chunks.push(event.data);
    }
    localStream.getTracks().forEach(track => track.stop());

    mediaRecorder.onstop = function(event) {
        let blob = new Blob(chunks);//blob化
        let reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = () => {
            audioCtx.decodeAudioData(reader.result).then(buf => {
                
                audioBuffer[Number(recordedNumber.value)] = buf;
                chunks=[];
                console.log(buf.getChannelData(0));
            })
        }
    }
}

cym.triggerAttack("g7");//一番最初音がならないのを回避するため
function playVoice(index) {
    source = audioCtx.createBufferSource();
    source.buffer = audioBuffer[index];
    source.connect(audioCtx.destination);    
    source.start();
}

function A() {
    if (audioBuffer[0] !== undefined) {
        playVoice(0);
    }else {
        bass.triggerAttackRelease("C0",'16n');
    }
}

function B() { 
    if (audioBuffer[1] !== undefined) {
        playVoice(1);
    }else {
        snr.triggerAttackRelease('16n');
    }

}

function C() {
    if (audioBuffer[2] !== undefined) {
        playVoice(2);
    }else {
        cym.triggerAttack("g7");
    }
    
}

function D() {
    if (audioBuffer[3] !== undefined) {
        playVoice(3);
    }else {
        metal.triggerAttackRelease("C0",'16n');
    }
}

function E() {
    if (audioBuffer[4] !== undefined) {
        playVoice(4);
    }else {
        metal.triggerAttackRelease("g3",'16n');
    }
}

function F() {
    if (audioBuffer[5] !== undefined) {
        playVoice(5);
    }else {
        poly.triggerAttackRelease("a7",'16n');
    }
}

window.addEventListener("keypress", e=>{
    if (e.key === "a") {
        document.getElementById("A").classList.add("pressing");
        A();
    }else if (e.key === "b") {
        document.getElementById("B").classList.add("pressing");
        B();
    }else if (e.key === "c") {
        document.getElementById("C").classList.add("pressing");
        C();
    }else if (e.key === "d") {
        document.getElementById("D").classList.add("pressing");
        D();
    }else if (e.key === "e") {
        document.getElementById("E").classList.add("pressing");
        E();
    }else if (e.key === "f") {
        document.getElementById("F").classList.add("pressing");
        F();
    }
});

window.addEventListener("keyup", e=>{
    if (e.key === "a") {
        document.getElementById("A").classList.remove("pressing");
    }else if (e.key === "b") {
        document.getElementById("B").classList.remove("pressing");
    }else if (e.key === "c") {
        document.getElementById("C").classList.remove("pressing");
    }else if (e.key === "d") {
        document.getElementById("D").classList.remove("pressing");
    }else if (e.key === "e") {
        document.getElementById("E").classList.remove("pressing");
    }else if (e.key === "f") {
        document.getElementById("F").classList.remove("pressing");
    }
});