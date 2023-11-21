const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  fs: require('fs'),
  path: require('path'),
  ipcRenderer: {...ipcRenderer,on: ipcRenderer.on},
  
  openDirectoryDialog: async () => {
    return await ipcRenderer.invoke('openDirectoryDialog');
  },
});