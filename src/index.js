// used to keep track of what dog is being edited
let currentId;

document.addEventListener('DOMContentLoaded', () => {
  fetchDogs();
  document.querySelector("#dog-form").addEventListener("submit", handleSubmit);

})

function fetchDogs() {
  fetch("http://localhost:3000/dogs")
    .then(resp => resp.json())
    .then(result => renderDogs(result))
}

function renderDogs(dogs) {
  const tableBody = document.querySelector("#table-body");
  let newRow;

  tableBody.innerHTML = "";
  dogs.forEach(dog => {
    newRow = tableBody.insertRow();
    newRow.innerHTML = renderOneDog(dog);
    newRow.className = "dog-data";
    btn = document.getElementById(dog.id);
    btn.addEventListener("click", handleEdit);
  });
}

function renderOneDog(oneDog) {
  return `<td>${oneDog.name}</td><td>${oneDog.breed}</td><td>${oneDog.sex}</td><td><button id=${oneDog.id}>Edit</button></td>`
  
}

function handleEdit(event) {

  currentId = event.target.id;
  console.log("handleEdit()");

  fetch(`http://localhost:3000/dogs/${currentId}`)
    .then(resp => resp.json())
    .then(result => {
      renderEditForm(result);
    }
  );

}

function renderEditForm(dog) {
  setInput("name", dog.name);
  setInput("breed", dog.breed);
  setInput("sex", dog.sex);

}

const setInput = (input, value) => 
// sets value of an input field
  document.getElementById("dog-form").elements[input].value = value;

const getInput = (input) =>
// gets value of an input field
  document.getElementById("dog-form").elements[input].value;

function handleSubmit(event) {

  console.log("handleSubmit()")

  event.preventDefault();

  const dataObj = {
    name: getInput("name"), 
    breed: getInput("breed"), 
    sex: getInput("sex")
  }

  fetch(`http://localhost:3000/dogs/${currentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataObj)
  })
  .then(res => res.json())
  .then(result => {
    event.target.reset();
    fetchDogs();
  })
  .catch(err => {
    alert(`Dog update failed with error: ${err.message}`)
  })

}
