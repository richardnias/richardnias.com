import AudioContext from './audioContext'

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

const Detector = {
  canvas: {
    isSupported: !!window.CanvasRenderingContext2D,
    message: 'Canvas is not supported by this browser'
  },
  webgl: {
    isSupported: (function () {
      try {
        var canvas = document.createElement('canvas')
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
      } catch (e) {
        return false
      }
    })(),
    message: 'WebGL is not supported by this browser'
  },
  audioContext: {
    isSupported: AudioContext,
    message: 'AudioContext is not supported by this browser'
  },
  getUserMedia: {
    isSupported: navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
    message: 'MediaDevices interface not available'
  }
}

export default Detector
