up.compiler('.volume', function (volumeKnob) {
  let audioContext, inputGain, oldValue;
  
  function connectAudioContext(evt){
    audioContext = evt.audioContext;
  }

  function connectInputGain(evt){
    inputGain = evt.inputGain;
  }

  function mute(){
    oldValue = inputGain.gain.value;
    inputGain.gain.setValueAtTime(0, audioContext.currentTime);
  }

  function unmute(){
    inputGain.gain.setValueAtTime(oldValue, audioContext.currentTime);
  }

  function onVolumeChange(evt){
    if(!inputGain){
      return; // The machine has not been initialized yet
    }
    const newVolume = volumeKnob.getValue();
    inputGain.gain.setValueAtTime(newVolume, audioContext.currentTime);
    up.emit('status-text-changed', {text: `Volume: ${ parseInt(newVolume * 100) }%`, instant: true});
  };

  up.on('audioContext:connected', connectAudioContext);
  up.on('inputgain:connected', connectInputGain);
  up.on('button-value-changed', 'knob.volume', onVolumeChange);
  up.on('reset:off', mute);
  up.on('reset:on', unmute);
});
