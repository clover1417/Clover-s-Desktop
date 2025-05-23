export type WindowType = 
  | 'about'
  | 'gallery'
  | 'stuff'
  | 'imageViewer'
  | 'patreon'
  | 'contact'
  | string;

let activeWindowId: string | null = null;
const windowZIndices: Map<string, number> = new Map();
const activeWindows: Set<string> = new Set();

type WindowCallback = () => void;
interface WindowCallbacks {
  onClose?: WindowCallback;
  onReset?: WindowCallback;
  onFocus?: WindowCallback;
  onBlur?: WindowCallback;
}

const windowCallbacks: Record<string, WindowCallbacks> = {};

const windowMountStatus: Map<string, boolean> = new Map();

export function registerWindow(windowType: WindowType, callbacks: WindowCallbacks): void {
  const windowId = windowType.toString();
  windowCallbacks[windowId] = callbacks;
  activeWindows.add(windowId);
  windowMountStatus.set(windowId, true);
}

export function unregisterWindow(windowType: WindowType): void {
  const windowId = windowType.toString();
  
  windowMountStatus.set(windowId, false);
  
  delete windowCallbacks[windowId];
  activeWindows.delete(windowId);
  windowZIndices.delete(windowId);

  if (activeWindowId === windowId) {
    activeWindowId = null;
    if (activeWindows.size > 0) {
      const nextWindow = Array.from(activeWindows)[0];
      bringToFront(nextWindow);
    }
  }
  
  cleanupGlobalHandlers();
}

function cleanupGlobalHandlers(): void {
  document.onmousemove = null;
  document.onmouseup = null;
  document.onmousedown = null;
}

export function bringToFront(windowId: string): number {
  if (windowMountStatus.get(windowId) === false) {
    console.warn(`Attempted to bring unmounted window to front: ${windowId}`);
    return 1;
  }
  
  const previousActiveId = activeWindowId;
  activeWindowId = windowId;
  activeWindows.add(windowId);
  
  if (previousActiveId && previousActiveId !== windowId) {
    const prevCallbacks = windowCallbacks[previousActiveId];
    if (prevCallbacks?.onBlur) {
      prevCallbacks.onBlur();
    }
  }
  
  for (const id of activeWindows) {
    windowZIndices.set(id, id === windowId ? 2 : 1);
  }
  
  const callbacks = windowCallbacks[windowId];
  if (callbacks?.onFocus) {
    callbacks.onFocus();
  }
  
  return 2;
}

export function sendToBack(windowId: string): number {
  if (windowMountStatus.get(windowId) === false) {
    console.warn(`Attempted to send unmounted window to back: ${windowId}`);
    return 1;
  }
  
  windowZIndices.set(windowId, 1);
  
  if (activeWindowId === windowId) {
    activeWindowId = null;
    
    const callbacks = windowCallbacks[windowId];
    if (callbacks?.onBlur) {
      callbacks.onBlur();
    }
  }
  
  return 1;
}

export function getZIndex(windowId: string): number {
  if (windowMountStatus.get(windowId) === false) {
    console.warn(`Attempted to get z-index of unmounted window: ${windowId}`);
    return 1;
  }
  
  if (!windowZIndices.has(windowId)) {
    if (activeWindowId === null) {
      activeWindowId = windowId;
      windowZIndices.set(windowId, 2);
      
      const callbacks = windowCallbacks[windowId];
      if (callbacks?.onFocus) {
        callbacks.onFocus();
      }
    } else {
      windowZIndices.set(windowId, 1);
    }
  }
  
  return windowZIndices.get(windowId) || 1;
}

export function isWindowActive(windowId: string): boolean {
  return windowMountStatus.get(windowId) === true;
}

export function saveWindowPosition(windowType: WindowType, position: {x: number, y: number}): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = `${windowType}Position`;
    localStorage.setItem(key, JSON.stringify(position));
  } catch (e) {
    console.error('Error saving window position:', e);
  }
}

export function loadWindowPosition(windowType: WindowType): {x: number, y: number} | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = `${windowType}Position`;
    const savedPosition = localStorage.getItem(key);
    if (savedPosition) {
      return JSON.parse(savedPosition);
    }
  } catch (e) {
    console.error('Error loading window position:', e);
  }
  
  return null;
}

export function isPositionValid(position: {x: number, y: number}, width: number, height: number): boolean {
  if (typeof window === 'undefined') return false;
  
  const minX = -width + 100;
  const maxX = window.innerWidth - 100;
  const minY = 0;
  const maxY = window.innerHeight - 100;
  
  return position.x > minX && position.x < maxX && position.y > minY && position.y < maxY;
}

export function closeAllWindows(): void {
  const windowIds = [...activeWindows];

  windowIds.forEach(windowId => {
    const callbacks = windowCallbacks[windowId];
    if (callbacks?.onClose) {
      try {
        callbacks.onClose();
      } catch (error) {
        console.error(`Error closing ${windowId}:`, error);
      }
    }
  });
  
  activeWindowId = null;
  windowZIndices.clear();
  activeWindows.clear();
  
  cleanupGlobalHandlers();
}

export function resetAllWindowPositions(): void {
  if (typeof window !== 'undefined') {
    const windowIds = Object.keys(windowCallbacks);
    
    windowIds.forEach(windowId => {
      const callbacks = windowCallbacks[windowId];
      const typedWindowType = windowId as WindowType;
      
      localStorage.removeItem(`${typedWindowType}Position`);
      
      if (callbacks?.onReset) {
        try {
          callbacks.onReset();
        } catch (error) {
          console.error(`Error resetting ${windowId}:`, error);
        }
      }
    });
  }
} 