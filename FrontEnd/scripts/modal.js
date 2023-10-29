///////////// INDEX /////////////

// Récupération des works depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

function generateIndex(works) {
  for (let i = 0; i < works.length; i++) {
    const icon = works[i];

    if (document.querySelector(".icons-gallery")) {
      // Récupération de l'élément du DOM qui accueillera les fiches
      const sectionGalleryModal = document.querySelector(".icons-gallery");
      // Création d’une balise dédiée à un work
      const workElement = document.createElement("div");
      workElement.dataset.id = works[i].id;
      workElement.classList.add("icon-modal");
      workElement.setAttribute("id", `work-project-${works[i].id}`);
      // Création de la balise img
      const imageElement = document.createElement("img");
      imageElement.src = icon.imageUrl;
      // Création de l'icône Delete
      const trashElement = document.createElement("button");

      trashElement.dataset.id = works[i].id;
      trashElement.classList.add("js-delete-btn");

      // fonction callback nécessaire (arrow function)
      trashElement.addEventListener("click", (event) => deleteWork(event, workElement));

      trashElement.classList.add("delete-btn");
      trashElement.innerHTML=`<i class="fas fa-trash-alt"></i>`;

      // On rattache la balise icon a la section Gallery
      sectionGalleryModal.appendChild(workElement);
      workElement.appendChild(imageElement);
      workElement.appendChild(trashElement);
    }
  }
}

/////////// DELETE ////////////////

async function fetchDelete(userToken, workId) {
  // passer le bearer
  return await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${userToken}`,
    },
  });
}

async function deleteWork(event, workElement) {

  console.log(workElement);

  try {
    const workId = workElement.dataset.id;
    const work = document.getElementById(`work-project-${workId}`);
    const userToken = window.localStorage.getItem("token").replace(/['"]+/g, '');
    const response = await fetchDelete(userToken, workId);
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    work.remove();

  } catch(error) {
    console.log(error);
    // message erreur projet non supprimé
    window.alert("Le projet n'a pas pu être supprimé.");
  }

}

///////////// NEW ////////////////
// interaction via les modal
// attendu ne doit pas recharger la page
// toutes les modifs doivent se faire avec le dom, et uniquement la partie concernée par la modification.

// Récupération des categories depuis l'API
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategories.json();
console.log(categories);

function setPreviousImage() {
  console.log("set previous");
  const inputContentImage = document.querySelector(".input-image");
  const inputPhoto = document.getElementById("photo");
  const previewImage = document.createElement("img");

  // const photo = inputPhoto.files[0]

  inputPhoto.onchange = event => {
    const [files] = inputPhoto.files;
    console.log(inputPhoto);
    console.log(inputPhoto.files[0]);

    // const image = event.target.files[0];
    // const reader = new FileReader();

    const divBeforePreview = document.getElementById("before-preview");

    if (files) {
      // Création de preview image
      previewImage.src = URL.createObjectURL(files);
      console.log("file");
      previewImage.setAttribute("id", "preview-image");

      divBeforePreview.style.display = "none";

      // AJout du file dans localStorage
      // reader.addEventListener('load', () => {
      //   localStorage.setItem('image', reader.result);
      // });
      // if (image) {
      //   reader.readAsDataURL(image);
      // }

      // inputContentImage.innerHTML = "";
      inputContentImage.insertAdjacentHTML("afterbegin", previewImage.outerHTML);

    }
  }
}

async function fetchPost(userToken, formData) {
  // return important pour recevoir la réponse du fetch
  return await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: formData,
  });
}

function addElementOnGallery(response) {
  // Création et ajout du work
  const sectionGallery = document.querySelector('.gallery');
  const workElement = document.createElement("figure");
  workElement.dataset.id = response.id;
  const imageUrl = response.imageUrl;
  const title = response.title ?? "(aucun titre)";
  workElement.innerHTML=
    `<img src="${imageUrl}" alt="${title}">
    <figcaption> ${title}</figcaption>`
  ;
  sectionGallery.appendChild(workElement);

  // Fermeture de la modal
  const modal = document.querySelector('#modal');
  modal.close();
}

function createProject() {

  console.log("buttonPost");

  const footer = document.querySelector(".footer-modal");
  const buttonValidate = document.createElement("input");
  buttonValidate.setAttribute("form", "form-new");
  buttonValidate.value = "Valider";
  buttonValidate.type = "submit";

  console.log(buttonValidate);

  footer.insertAdjacentHTML("afterbegin", buttonValidate.outerHTML);

  const newForm = document.getElementById("form-new");

  newForm.addEventListener("submit", async (event) => {
    try {
      event.preventDefault();
      console.log("fetch");
      const userToken = window.localStorage.getItem("token").replace(/['"]+/g, '');

      const formData = new FormData(newForm);
      console.log(formData);
      // const test = localStorage.getItem('image')

      // On peut cacher l'élément avec propriété > visible
      // ou variable
      // const photo = inputPhoto.files[0]
      // formData.append("image", photo);

      // Appel de la fonction fetch avec toutes les informations nécessaires
      const response = await fetchPost(userToken, formData);

      // il faut le json pour un fetch et refabriquer l'objet en json et l'utiliser si besoin
      const parsedResponse = await response.json();
      console.log(parsedResponse);

      // j'ajoute à partir de ma response l'élément dans ma section icons-gallery content et je ferme ma modal
      addElementOnGallery(parsedResponse);

      // corrige le preview de la photo

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch(error) {
      // message erreur projet non ajouté
      console.log(error);
      window.alert("Le projet n'a pas pu être ajouté.");
    }
  })
}

function addProject() {
  if (document.querySelector(".js-add-btn")) {

    const buttonAdd = document.querySelector(".js-add-btn");

    buttonAdd.addEventListener("click",() => {
      console.log("add");

      const title = document.querySelector(".title-modal");
      const content = document.querySelector(".content");
      const headerModal = document.querySelector(".header-modal");

      const arrow = document.createElement("i");
      arrow.classList.add("fa-solid");
      arrow.classList.add("fa-arrow-left");
      arrow.classList.add("header-fa");
      headerModal.insertAdjacentHTML("afterbegin", arrow.outerHTML);
      headerModal.style.justifyContent = "space-between";

      title.innerText = "Ajout photo";

      content.innerHTML = `
        <form action="#" method="post" class="add-form form-modal" id="form-new">
          <div class="input-image">
            <div id="before-preview">
              <i class="fa-regular fa-image"></i>
              <input type="file" id="photo" name="image" accept="image/png, image/jpeg"/>
              <label id="photo-label" for="photo">
                + Ajouter photo
              </label>
              <div id="photo-type">jpg, png : 4mo max</div>
            </div>
          </div>
          <div class="inputs">
            <label for="title">Titre</label>
            <input type="text" name="title" id="title">
          </div>
          <div class="inputs">
            <label for="category">Catégorie</label>
            <select name="category" id="category">
              <option value=""></option>
            </select>
          </div>
        </form>
      `;
      // <input type="submit" value="Valider" style="display:none">

      categories.forEach(category => {
        const selectValue = document.createElement("option");
        const selectElement = document.getElementById("category");

        selectValue.innerHTML =`${category.name}`;
        selectValue.setAttribute("value", `${category.id}`);
        selectElement.insertAdjacentHTML("beforeend", selectValue.outerHTML);
      });

      setPreviousImage();

      buttonAdd.remove();

      createProject();
    });


  }
}

addProject();

///////////// OPEN AND CLOSE MODAL //////////////

function callModal() {
  const modal = document.querySelector('#modal');

  if (document.querySelector('.js-open-button')) {
    const openModal = document.querySelector('.js-open-button');
    openModal.addEventListener("click", () => {
      modal.showModal();
      generateIndex(works);
    })
  }
  if (document.querySelector('.js-close-button')) {
    const closeModal = document.querySelector('.js-close-button');
    closeModal.addEventListener("click", () => {
      modal.close();
    })
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

callModal();
