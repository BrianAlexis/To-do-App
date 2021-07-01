// SELECTORS
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

// EVENT LISTENERS

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);

// Para cuando carge el DOM ejecute la funcion getTodos que trae todo del local storage y lo plasma en la pantalla, haciendo que cuando se recargue la pagina nuestros archivos esten ahi.
document.addEventListener("DOMContentLoaded", getTodos);


// FUNCTIONS

function addTodo(event){
    // Prevent form from submitting
    event.preventDefault();

    // Vamos a crear en el HTML un div con un clase todo, que va a contener un li, un button de delete y un button de checked todo en JS

    // Todo Div
    // Creamos un div, con la clase "todo".
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // Create LI
    const newTodo = document.createElement("li");
    // Para poner el valor que el usuario ingreso en el input:
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item")

    todoDiv.appendChild(newTodo);

    // Agregar el valor del todo al local storage
    saveLocalTodos(todoInput.value);

    
    // Check Mark Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // Check Trash Button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // Tenemos que poner el li y los dos button que creamos acá dentro del UL de nuestro HTML que está con la clase: .todo-list, si no hacemos esto nuestra lista va a quedar fuera del UL
    todoList.appendChild(todoDiv)

    
    //Limpiar INPUT VALUE
    todoInput.value = "";
}

function deleteCheck(e){
    const item = e.target;

    // Borrar TODO
    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        // Cuando se elimine, creamos una clase llamada .removed
        todo.classList.add("removed");

        // Para eliminar los todos del local storage:
        removeLocalTodos(todo);

        // Animacion para cuando la transicion termine, se elimine el todo y todo lo demas se vaya para arriba y no se queda todo el todo pegado todo para abajo.
        todo.addEventListener("transitionend", function(){
            todo.remove();
        })
    }

    // Check Mark
    // Hacemos que cuando apretemos en el boton, cambie a la clase ".completed", y le aplicamos estilos en CSS
    if(item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}


// FUNCION DEL FILTRADO
// Creamos un switch con los valores all y completed, DEBEN tener el mismo nombre del value del HTML que creamos con la clase .filter-todo
// Y al display de estilo le ponemos flex para que los elementos vayan uno al lado del otro (manteniendo su diseño), de lo contrario si le ponemos block, obviamente se van a posicionar uno abajo del otro.


function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function(todo){
        switch(e.target.value) {
            
            case "all":
                todo.style.display = "flex"
                break;

            case "completed":
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;

            case "uncompleted":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        };
    });
}

// GUARDAR EN LOCALSTORAGE

function saveLocalTodos(todo){
    // Checkear si hay algo en la lista, si no hay nada va a crear un array vacio. Si no va a crear un objeto JSON y lo va a parsear 
    let todos;
    if(localStorage.getItem("todos") === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Nuestros todos estan guardados en local storage, pero cuando recargamos la page no lo vemos, acá se soluciona.

function getTodos(){
    
    if(localStorage.getItem("todos") === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    
    todos.forEach(function(todo){
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // Create LI
    const newTodo = document.createElement("li");
    // Para poner el valor que el usuario ya ingreso en el input y está en el local storage:
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item")
    todoDiv.appendChild(newTodo);

    // Check Mark Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // Check Trash Button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // Tenemos que poner el li y los dos button que creamos acá dentro del UL de nuestro HTML que está con la clase: .todo-list, si no hacemos esto nuestra lista va a quedar fuera del UL
    todoList.appendChild(todoDiv)
    });
}

// Para eliminar del local storage los to-Do que eliminamos.
function removeLocalTodos(todo){
    
    if(localStorage.getItem("todos") === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    // Para saber en que index y que texto contiene lo que vamos a eliminar
    const todoIndex = todo.children[0].innerText;
    // Por que posicion queremos eliminar el elemento, y el 1 es CUANTOS
    todos.splice(todos.indexOf(todoIndex), 1);

    // Para que finalmente lo elimine del local
    localStorage.setItem("todos", JSON.stringify(todos));
}

function duplicateTodoCheck(todo) {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    for (var i = 0; i < todos.length; i++){
        if (todos[i]["todo"] === todo) {
            return "duplicate";
        }
    }
}

function markCompleted(todo) {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.children[0].innerText;
    let index = todos.findIndex(obj => obj.todo==todoIndex);
    if(todos[index].status === "uncompleted") {
        todos[index].status = "completed";
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    else {
        todos[index].status = "uncompleted";
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}
