// GLOBALS
let colorThemes;
let currentTheme = 0;
if(localStorage.getItem("currentTheme") !== null){
    currentTheme = parseInt(localStorage.getItem("currentTheme"))
}

// DOM
document.addEventListener("DOMContentLoaded", setDefaultTheme());
const ctoggle = document.querySelector("#ctoggle");
ctoggle.addEventListener("click", colorToggle);


// FUNCTIONS
function getThemes() {
    let themes = JSON.parse(localStorage.getItem("cdata"));
    return themes
}
function colorToggle() {
    const themes = getThemes()
    const limit = themes.length-1
    if (currentTheme < limit){
        currentTheme += 1
            }
    else {
        currentTheme = 0
    }
    localStorage.setItem("currentTheme", currentTheme);
    
    // SET THEME
    setTheme(currentTheme)

}

function setTheme(index){
    const themes = getThemes()
    const doc = document.documentElement;
    doc.style.setProperty("--color01", `${themes[index].c1}`)
    doc.style.setProperty("--color02", `${themes[index].c2}`)
    doc.style.setProperty("--color03", `${themes[index].c3}`)
    doc.style.setProperty("--color04", `${themes[index].c4}`)

    if(index == 0){
        document.querySelector("body").style.setProperty("background-image", "var(--bg-col)");
    }
    else {
        document.querySelector("body").style.setProperty("background-image", "var(--bg-grad)");
    }
    
}
function setDefaultTheme() {
  let localdata = localStorage.getItem("cdata");
  if ((localdata === null) | (localdata === [])) {
    colorThemes = [
        { c1: "#999", c2: "#fff", c3: "#000", c4: "#000" },
        { c1: "#000", c2: "#000", c3: "#fff", c4: "#666" },
      { c1: "#97BFB4", c2: "#F5EEDC", c3: "#DD4A48", c4: "#4F091D" },
      
    ];
    localStorage.setItem("cdata", JSON.stringify(colorThemes));
    localStorage.setItem("currentTheme", currentTheme);
  } else {
    colorThemes = JSON.parse(localdata);
  }
  setTheme(currentTheme)
}
