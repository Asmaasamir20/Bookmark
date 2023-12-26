// ---------------------------- inputs tag nafso ---------------------------------------
let websiteNameInput = document.getElementById("websiteName");
let websiteUrlInput = document.getElementById("websiteUrl");
let searchInput = document.getElementById("searchInput");
let inputs = document.getElementsByClassName("form-control");
let addBtn = document.getElementById("addBtn");
let websites = [];
// -------------------------------  START validation  ---------------------------------
let nameAlert = document.getElementById("nameAlert");
let rejexName = /^[a-zA-Z]{3,9}(?:\s[a-zA-Z]{3,9})*$/;
let urleAlert = document.getElementById("urleAlert");
let rejexUrl = /^(https?|ftp):\/\/[^\s\/$.?#][^\s]*$/;

function validateInput(rejex, input, alert) {
  if (rejex.test(input.value)) {
    //valide

    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    addBtn.removeAttribute("disabled");
    alert.classList.add("d-none");
    addValidation();
  } else {
    //not valide

    input.classList.add("is-invalid");
    addBtn.disabled = "true";
    alert.classList.remove("d-none");
  }
}
function addValidation() {
  for (var i = 0; i < inputs.length - 1; i++) {
    if (inputs[i].value == "") {
      addBtn.disabled = "true";
    } else {
      if (
        rejexName.test(websiteNameInput.value) &&
        rejexUrl.test(websiteUrlInput.value)
      ) {
        addBtn.removeAttribute("disabled");
        inputs[i].classList.add("is-valid");
        inputs[i].classList.remove("is-invalid");
      } else {
        addBtn.disabled = "true";
      }
    }
  }
}
websiteNameInput.onkeyup = function () {
  validateInput(rejexName, websiteNameInput, nameAlert);
};
websiteUrlInput.onkeyup = function () {
  validateInput(rejexUrl, websiteUrlInput, urleAlert);
};
// -------------------------------  end validation  ---------------------------------

// second proses retrive
if (JSON.parse(localStorage.getItem("websitesList")) != null) {
  websites = JSON.parse(localStorage.getItem("websitesList"));
  displayWebsite();
}
// -------------------------------  START CREATE WEBSITE  -----------------------------
// ----------- ONCLICK -----------
addBtn.onclick = function () {
  if (addBtn.innerHTML == "Add") {
    addWebsite();
  } else {
    updateWebsiteInfo();
  }
  displayWebsite();
  clearForm();
  addValidation();
};
// -------------------   ADD WEBSITE DATA   ----------------------
function addWebsite() {
  let isNameValid = rejexName.test(websiteNameInput.value);
  let isUrlValid = rejexUrl.test(websiteUrlInput.value);
  if (isNameValid && isUrlValid) {
    let isNameUnique = websites.every(
      (website) =>
        website.name.toLowerCase() !== websiteNameInput.value.toLowerCase()
    );

    if (isNameUnique) {
      let website = {
        name: websiteNameInput.value,
        url: websiteUrlInput.value
      };
      websites.push(website);

      // THE FIRST STEP IN THE PROCESS RETRIVE ---> set data
      localStorage.setItem("websitesList", JSON.stringify(websites));

      // Clear the is-invalid class
      websiteNameInput.classList.remove("is-invalid");
      websiteUrlInput.classList.remove("is-invalid");

      // Clear the input values
      clearForm();
    } else {
      websiteNameInput.classList.add("is-invalid");
      nameAlert.classList.remove("d-none");
    }
  } else {
    // Add the is-invalid class
    websiteNameInput.classList.add("is-invalid");
    websiteUrlInput.classList.add("is-invalid");
  }
}
// ------------------    DISPLAY WEBSITE DATA  -------------------
function displayWebsite() {
  let container = "";
  for (let i = 0; i < websites.length; i++) {
    container += `

      <div class="col-sm-6 col-md-4">
      <div class="box py-4 my-4 rounded-5">
        <div class="index-box rounded-4">
          <h5 class="index pt-3">${[i + 1]}</h5>
        </div>

        <h4 class="pb-4">${websites[i].name}</h4>

        <div class="btn-box d-flex justify-content-around px-lg-1">
          <a href="${websites[i].url}" target="_blank" id="link">
            <button
              class="btn btn-success text-white text-center"
              id="visitBtn"
              name="visit"
            >
              <i class="fa-solid fa-eye"></i></button
          ></a>

          <a href="#0">
            <button
            onclick="getWebsiteInfo(${i})"
              class="btn btn-warning text-black"
              name="update text-center"
            >
            <i class="fa-solid fa-pencil"></i>
            </button>
          </a>

          <a href="#0">
            <button
            onclick=" deleteWebsite(${i})"
              class="btn btn-danger text-white"
              name="delete text-center"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </a>
        </div>
      </div>
    </div>
          `;
  }
  document.getElementById("row").innerHTML = container;
}
// ------------------     CLEAR FORM VALUE   ----------------------
function clearForm() {
  for (let i = 0; i < inputs.length - 1; i++) {
    inputs[i].value = "";
  }
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("is-valid");
  }
}
// -------------------------------  END CREATE PROCESS  -------------------------------
// -------------------------------  START UPDATE PRODUCT  -----------------------------
let currentWebsite;
let currentIndex = 0;
function getWebsiteInfo(index) {
  currentIndex = index;
  currentWebsite = websites[index];
  websiteNameInput.value = currentWebsite.name;
  websiteUrlInput.value = currentWebsite.url;
  addBtn.innerHTML = "Update";
  addBtn.className = " btn btn-warning";
}
function updateWebsiteInfo() {
  let website = {
    name: websiteNameInput.value,
    url: websiteUrlInput.value
  };
  websites[currentIndex] = website;
  localStorage.setItem("websitesList", JSON.stringify(websites));
  addBtn.innerHTML = "Add";
  addBtn.className = "btn addBtn";
}
//-------------------------------   END UPDATE PRODUCT  -------------------------------
// -------------------------------  START DELETE PRODUCT  -----------------------------
function deleteWebsite(index) {
  websites.splice(index, 1);
  displayWebsite();
  localStorage.setItem("websitesList", JSON.stringify(websites));
}
// -------------------------------  END DELETE PRODUCT  -------------------------------
// -------------------------------  START SEARCH PRODUCT  -----------------------------
searchInput.onkeyup = function () {
  let container = "";
  for (let i = 0; i < websites.length; i++) {
    if (
      websites[i].name.toLowerCase().includes(searchInput.value.toLowerCase())
    ) {
      container += `
      <div class="col-md-4">
        <div class="box p-5 my-4 rounded-5">
          <div class="index-box">
            <h5 class="index">${[i + 1]}</h5>
          </div>
          <h4>${websites[i].name}</h4>
          <a href="${websites[i].url}" target="_blank" id="link">
            <button class="btn btn-success text-white text-center" id="visitBtn" name="visit">
              <i class="fa-solid fa-eye"></i></button
          ></a>

          <button onclick="getWebsiteInfo(${i})" class="btn btn-warning text-black" name="update text-center" >
            <i class="fa-solid fa-square-pen"></i>
          </button>

          <button onclick=" deleteWebsite(${i})" class="btn btn-danger text-white" name="delete text-center">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      `;
    }
  }
  document.getElementById("row").innerHTML = container;
};
// -------------------------------  END SEARCH PRODUCT  -----------------------------
