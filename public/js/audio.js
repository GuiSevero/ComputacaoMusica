function AudioPlayer(sound_url) {
    var context, 
        soundSource, 
        soundBuffer,
        url =  sound_url || 'soundfont/acoustic_grand_piano-mp3/';
        console.log(url);

    // Step 1 - Initialise the Audio Context
    // There can be only one!
    this.init = function() {
        if (typeof AudioContext !== "undefined") {
            context = new AudioContext();
            $('#played-note').html('AudioContext supported. :)');
        } else if (typeof webkitAudioContext !== "undefined") {
            context = new webkitAudioContext();
            $('#played-note').html('AudioContext supported. :)');
        } else {
            throw new Error('AudioContext not supported. :(');
                 $('#played-note').html('AudioContext not supported. :(');
        }
    }

    // Step 2: Load our Sound using XHR
    this.startSound = function (note) {
        // Note: this loads asynchronously
        var request = new XMLHttpRequest();
        var player = this;
        

        request.open("GET", url + note, true);
        request.responseType = "arraybuffer";

        // Our asynchronous callback
        request.onload = function() {
            var audioData = request.response;
            player.audioGraph(audioData);

        };

        request.error = function(err){
            $('#played-note').html('error');
        }

        request.send();
    }

    // Finally: tell the source when to start
    this.playSound = function () {
        // play the source now
        soundSource.noteOn(context.currentTime);
    
    }

     this.stopSound = function() {
        // stop the source now
        soundSource.noteOff(context.currentTime);
    }

    // Events for the play/stop bottons
    //document.querySelector('. ').addEventListener('click', startSound);
    //document.querySelector('.stop').addEventListener('click', stopSound);


    // This is the code we are interested in
    this.audioGraph = function (audioData) {
        // create a sound source
        soundSource = context.createBufferSource();

        // The Audio Context handles creating source buffers from raw binary
        soundBuffer = context.createBuffer(audioData, true/* make mono */);
      
        // Add the buffered data to our object
        soundSource.buffer = soundBuffer;

        volumeNode = context.createGainNode();

        //Set the volume
        volumeNode.gain.value = 5.0;

        // Wiring
        soundSource.connect(volumeNode);
        volumeNode.connect(context.destination);

        // Plug the cable from one thing to the other
        //soundSource.connect(context.destination);

        // Finally
        this.playSound(soundSource);         
    }


    this.init();


}