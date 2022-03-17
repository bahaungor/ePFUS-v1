/*Get local storage data if any*/
const pfusItems = JSON.parse(localStorage.getItem("LocalPfusItems")) || []; 
/*Page Definitions*/
const concernFormOverlay = document.querySelector(".concern-form-overlay");
const concernFormContainer = document.querySelector(".concern-form-container");
const concernForm = document.querySelector(".concern-form");
const addConcernBtn = document.querySelector(".add-new-concern");
const concernFormCancelBtn = document.querySelector(".concern-form-cancel-button");
const concernFormSubmitBtn = document.querySelector(".concern-form-submit-button");
const concernsGridContainer = document.querySelector(".concerns-grid-container");
let eachConcernRow;
/*Form Definitions*/
let concernFormRespEng = document.querySelector(".concern-form-resp-eng-input");
let concernFormRank = document.querySelector(".concern-form-rank-input")
let concernFormTitle = document.querySelector(".concern-form-concern-title-input")
let concernFormStatus = document.querySelector("#concern-form-status-input")
let concernFormTime = document.querySelector(".concern-form-time-input")
let concernFormProblem = document.querySelector(".concern-form-problem-clarification-input")
let concernFormRC = document.querySelector(".concern-form-rc-input")
let concernFormCM = document.querySelector(".concern-form-cm-input")
let concernFormReflection = document.querySelector(".concern-form-reflection-input")
let concernFormNextActions = document.querySelector(".concern-form-next-action-input")
let formOpenedForConcern = false;
let index = "";

createGridContainerContent();
function createGridContainerContent(){
    concernsGridContainer.innerHTML = "";
    let i = 0;
    pfusItems.forEach(concern => {
        const concernGrid = document.createElement("div");
        concernGrid.className = "concern-grid";
        concernGrid.dataset.index = i;
        i++;
        const concernTitle = document.createElement("div");
        concernTitle.className = "concern-title";
        concernTitle.textContent = concern.title;
        const concernProblem = document.createElement("div");
        concernProblem.className = "concern-problem";
        concernProblem.textContent = concern.problem;
        const concernRespEng = document.createElement("div");
        concernRespEng.className = "concern-resp-eng";
        concernRespEng.textContent = concern.resp;
        const concernStatus = document.createElement("div");
        concernStatus.className = "concern-status";
        if(concern.status == "Problem Clarification") concernStatus.textContent = "◔";
        if(concern.status == "Rootcause Investigation") concernStatus.textContent = "◑";
        if(concern.status == "Countermeasure Clarification") concernStatus.textContent = "◕";
        if(concern.status == "Closed") concernStatus.textContent = "⬤";
        const concernTime = document.createElement("div");
        concernTime.className = "concern-time";
        if((new Date().getTime()/(100*60*60*24)) - new Date(concern.time) < 15){
            concernTime.textContent = "🙂";
        } else if((new Date().getTime()/(100*60*60*24)) - new Date(concern.time) < 25) {
            concernTime.textContent = "😐";
        } else if((new Date().getTime()/(100*60*60*24)) - new Date(concern.time) > 35) {
            concernTime.textContent = "🙁";
        }
        concernsGridContainer.appendChild(concernGrid);
        concernGrid.appendChild(concernTitle);
        concernGrid.appendChild(concernProblem);
        concernGrid.appendChild(concernRespEng);
        concernGrid.appendChild(concernStatus);
        concernGrid.appendChild(concernTime);
    });
    eachConcernRow = document.querySelectorAll(".concern-grid");
    eachConcernRow.forEach(concernRow => concernRow.addEventListener("click", openConcernForm));
}

addConcernBtn.addEventListener("click", displayConcernForm);
function displayConcernForm(){
    concernFormOverlay.classList.add("pop-up-active");
    concernFormContainer.classList.add("pop-up-active");
}

concernFormCancelBtn.addEventListener("click", hideConcernForm);
function hideConcernForm(){
    concernFormOverlay.classList.remove("pop-up-active");
    concernFormContainer.classList.remove("pop-up-active");
    document.querySelector(".concern-form").reset();
    formOpenedForConcern = false;
}

function Concern(resp, rank, title, status, time, problem, rc, cm, reflection, nextAction){
    this.resp = resp;
    this.rank = rank;
    this.title = title;
    this.status = status;
    this.time = time;
    this.problem = problem;
    this.rc = rc;
    this.cm = cm;
    this.reflection = reflection;
    this.nextAction = nextAction;
}

concernForm.addEventListener("submit", submitConcernForm);
function submitConcernForm(e){
    e.preventDefault();
    console.log("deneme");
    if (formOpenedForConcern){ /*If you are submitting existing form */
        pfusItems[index].resp = concernFormRespEng.value;
        pfusItems[index].rank = concernFormRank.value;
        pfusItems[index].title = concernFormTitle.value;
        pfusItems[index].status = concernFormStatus.value;
        pfusItems[index].problem = concernFormProblem.value;
        pfusItems[index].rc = concernFormRC.value;
        pfusItems[index].cm = concernFormCM.value;
        pfusItems[index].reflection = concernFormReflection.value;
        pfusItems[index].nextAction = concernFormNextActions.value;
    } else { /*If you are submitting new form */
        const newConcern = new Concern(
            concernFormRespEng.value, 
            concernFormRank.value, 
            concernFormTitle.value, 
            concernFormStatus.value, 
            ((new Date().getTime()/(100*60*60*24))), 
            concernFormProblem.value, 
            concernFormRC.value, 
            concernFormCM.value, 
            concernFormReflection.value, 
            concernFormNextActions.value);
            pfusItems.push(newConcern);
    }
    localStorage.setItem("LocalPfusItems", JSON.stringify(pfusItems));
    createGridContainerContent();
    hideConcernForm();
}

function openConcernForm(){
    formOpenedForConcern = true;
    index = this.dataset.index;
    console.log(index);
    displayConcernForm();
    concernFormRespEng.value = pfusItems[index].resp;
    concernFormRank.value = pfusItems[index].rank;
    concernFormTitle.value = pfusItems[index].title;
    if(pfusItems[index].status == "Problem Clarification") concernFormStatus.selectedIndex  = 0;
    if(pfusItems[index].status == "Rootcause Investigation") concernFormStatus.selectedIndex  = 1;
    if(pfusItems[index].status == "Countermeasure Clarification") concernFormStatus.selectedIndex  = 2;
    if(pfusItems[index].status == "Closed") concernFormStatus.selectedIndex  = 3;
    if((new Date()).getTime()/(24*60*60*100) - new Date(pfusItems[index].time).getTime() < 15){
        concernFormTime.value = "🙂";
    } else if((new Date()).getTime()/(24*60*60*100) - new Date(pfusItems[index].time).getTime() < 25) {
        concernFormTime.value = "😐";
    } else if((new Date()).getTime()/(24*60*60*100) - new Date(pfusItems[index].time).getTime() > 35) {
        concernFormTime.value = "🙁";
    }
    concernFormProblem.value = pfusItems[index].problem;
    concernFormRC.value = pfusItems[index].rc;
    concernFormCM.value = pfusItems[index].cm;
    concernFormReflection.value = pfusItems[index].reflection;
    concernFormNextActions.value = pfusItems[index].nextAction;
}