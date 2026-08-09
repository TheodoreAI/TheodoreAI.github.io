// Shared WebGL-availability guard for the procedural 3D scenes.
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// Shows a fallback message in the given loading element and throws, so the
// caller's module stops executing instead of hitting an unhandled
// WebGLRenderer construction error with the loading text stuck on screen.
export function requireWebGLOrFail(loadingEl) {
  if (isWebGLAvailable()) return;
  if (loadingEl) {
    loadingEl.textContent = "Your browser can't display this 3D scene. Try a different browser or device.";
  }
  throw new Error('WebGL is not available in this browser.');
}
