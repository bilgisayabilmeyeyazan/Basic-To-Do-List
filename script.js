document.addEventListener("DOMContentLoaded", showTasks);

document.querySelector("form").addEventListener("submit", (event)=>{
    event.preventDefault();
    addTask();
        updateProgressStatus();

})

function addTask(){
    let taskInput = document.getElementById("taskInput");
    let task = taskInput.value.trim();
    if(!task) return;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskObj = {
        taskText: task,
        completed: false
    }
    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    showTasks();
    updateProgressStatus();
    taskInput.value = "";
}

function showTasks(){
    let taskList = document.getElementById("taskList");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    taskList.innerHTML = "";

    tasks.forEach((task, index)=>{
        let li = document.createElement("li");

        li.innerHTML = `
          <input type="checkbox" id="task-${index}" />
          <label for="task-${index}" class="checkbox-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="transparent"
            >
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
          </label>
          <label for="task-${index}" class="task-item-text">${task.taskText}</label>
          <button class="del-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="var(--light-faded-task-color)"
            >
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
              />
            </svg>
          </button>
        `
        li.className = "task-item";

        let delBtn = li.querySelector(".del-button");
        delBtn.onclick = () => removeTask(index);
 
        
        let checkbox = li.querySelector("input");
        checkbox.addEventListener("change", ()=>{
            tasks[index].completed = checkbox.checked;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            updateProgressStatus();
        })
        checkbox.checked = task.completed;

       taskList.appendChild(li);
    })
    updateProgressStatus();
}


function removeTask(index){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
    updateProgressStatus();
}

function updateProgressStatus(){
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const completedTasks = tasks.filter((task)=>task.completed).length;
  const progress = tasks.length>0 ? (completedTasks / tasks.length) * 100 : 0;
  const progressBar = document.querySelector(".progress");
  const progressStat = document.querySelector(".stat");
  const statPhrase = document.querySelector(".stat-phrase");

  progressBar.style.width = `${progress}%`;


  if(tasks.length) {  
    progressStat.textContent = `${Math.round(progress*10)/10}%`;
    if(tasks.length === completedTasks){
      statPhrase.textContent = `Well Done!`;
      celebration();
    } else if(progress > 0 && progress < 50){
      statPhrase.textContent = `Keep it up!`;
    } else if(progress >= 50){
      statPhrase.textContent = `Almost there!`;
    } 
  }else {
      statPhrase.textContent = "";
      progressStat.textContent = "";
    }
  }

function celebration(){
  const defaults = {
    spread: 360,
    ticks: 200,
    gravity: 0.1,
    decay: 0.95,
    startVelocity: 10,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };
  
  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });
  
    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }
  
  setTimeout(shoot, 0);
  setTimeout(shoot, 500);
  setTimeout(shoot, 1000);
}