const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const Menu = electron.Menu;

const {ipcMain} = electron;

const path = require('path')
const url = require('url')
var fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  
  //Quit app when main window is closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    addWindow = null;
  })

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

//------------- ALL NEW WINDOW HANDLERS ----------------//

// Handle new report window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 400,
    height: 400,
    title:'Dodaj nowy pomiar'
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'newReport.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Handle set parameters window
function createSetParametersWindow(){
  addWindow = new BrowserWindow({
    width: 450,
    height: 900,
    title:'Ustaw parametry'
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'setParameters.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Handle show all reports window
function indexReports(){
  addWindow = new BrowserWindow({
    width: 700,
    height: 600,
    title:'Wszystkie pomiary'
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'indexReports.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Handle import file window
function createImportFileWindow(){
  addWindow = new BrowserWindow({
    width: 400,
    height: 350,
    title:'Import pliku'
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'importFile.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}

//------------- IPC MAIN RENDERER ACTIONS ----------------//

//catch form data measureData:add
ipcMain.on('measureData:add', function(e, tableData){
  //sends table data to main page
  mainWindow.webContents.send('measureData:add', tableData);
  //closes window with form
  addWindow.close();
  mainWindow.reload();
});

//catch action from setParameters.html
ipcMain.on('close:window', function(e) {
  addWindow.close();
  mainWindow.reload();
})

//reloads window
ipcMain.on('reload:window', function(e) {
  mainWindow.reload();
})

//saves given content to 
ipcMain.on('save:file', function(e, data) {
  var path = app.getAppPath();
  path = path.split("\\");
  path = path[0]+"\\"+path[1]+"\\"+path[2]+"\\Desktop\\";
  var fileName = data.name;
  try {
    fs.appendFileSync(path+fileName, data.content, 'utf-8');
  } catch (e) {
    mainWindow.webContents.send('file:failed', e);
  }
})

ipcMain.on('getSavedFilePath', function(e, fileName) {
  var path = app.getAppPath();
  path = path.split("\\");
  path = path[0]+"\\"+path[1]+"\\"+path[2]+"\\Desktop\\";
  mainWindow.webContents.send('file:saved', path+fileName);
})

ipcMain.on('import:file', function(e) {
  createImportFileWindow();
})
//------------- MENU SETTINGS ----------------//

// Create menu template
const mainMenuTemplate = [
  {
    //reports list
    label: "Lista pomiarów",
    accelerator:process.platform == 'darwin' ? 'Command+L' : 'Ctrl+L',
    click(){
      indexReports();
    }
  }, {
    //new report
    label: "Nowy pomiar",
    accelerator:process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
    click(){
      createAddWindow();
    }
  }, {
    label: "Opcje",
    submenu: [
      {
        //set parameters
        label: "Ustawienia parametrów",
        accelerator:process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
        click(){
          createSetParametersWindow();
        }
      }, {
        //import
        label: "Importuj plik",
        click() {
          createImportFileWindow();
        }
      }, {
        //export
        label: "Eksportuj plik",
        click() {
          mainWindow.webContents.send('export:file');
        }
      }
    ]
  } 
];

//on mac first element is going to be electron, we don't want that so to avoid display default first element 
//we can pass first as empty list element
if(process.platform == 'darwin') {
  //unshift is an array method which adds element of the begining of the array - push adds to the end
  mainMenuTemplate.unshift({});
}

//Adds developer tool to app only if it's not in production
if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Narzędzia programistyczne',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}