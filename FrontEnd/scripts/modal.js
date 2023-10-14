///////////// INDEX /////////////

// Récupération des works depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

function generateIndex(works) {
  for (let i = 0; i < works.length; i++) {
    const icon = works[i];
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
    trashElement.classList.add("delete-btn");
    trashElement.innerHTML=`<i class="fas fa-trash-alt"></i>`;

    // On rattache la balise icon a la section Gallery
    sectionGalleryModal.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(trashElement);
  }
}

/////////// DELETE ////////////////

async function fetchDelete(workId) {
  await fetch(`http://localhost:5678/api/works/${workId}`, { method: 'DELETE' });
}

function deleteWork() {
  const buttonsDelete = document.querySelectorAll(".js-delete-btn");

  buttonsDelete.forEach((button) =>
    button.addEventListener("click",() => {
      try {
        const workId = button.dataset.id;
        const work = document.getElementById(`work-project-${workId}`);
        const response = fetchDelete(workId);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        work.remove();

      } catch(error) {
        // message erreur projet non supprimé
        window.alert("Le projet n'a pas pu être supprimé.");
      }
    })
  );
}


///////////// NEW ////////////////
// interaction via les modal
// attendu ne doit pas recharger la page
// toutes les modifs doivent se faire avec le dom, et uniquement la partie concernée par la modification.

// Récupération des categories depuis l'API
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategories.json();

function addProject() {
  // build flèche retour
  // add event listener pour reconstruire title, button
  // generate index pour content

  // regarder comment ajouter l'image au form
  // categorie select
  // collection ?

  const buttonAdd = document.querySelector(".js-add-btn");

  buttonAdd.addEventListener("click",() => {
    console.log("add");

    const title = document.querySelector(".title-modal");
    const content = document.querySelector(".content");
    const button = document.querySelector(".js-add-btn");
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
          <i class="fa-regular fa-image"></i>
          <input type="file" id="photo" name="photo" accept="image/png, image/jpeg"/>
          <label id="photo-label" for="photo">
            + Ajouter photo
          </label>
          <div id="photo-type">jpg, png : 4mo max</div>
        </div>
        <div class="inputs">
          <label for="title">Titre</label>
          <input type="text" name="title" id="title">
        </div>
        <div class="inputs">
          <label for="categorie">Catégorie</label>
          <select name="categorie" id="categorie">
            <option value=""></option>
          </select>
        </div>
      </form>
    `;

    categories.forEach(category => {
      const selectValue = document.createElement("option");
      const selectElement = document.getElementById("categorie");

      selectValue.innerHTML =`${category.name}`;
      selectValue.setAttribute("value", `${category.name}`);
      selectElement.insertAdjacentHTML("beforeend", selectValue.outerHTML);
    });

    button.innerText = "Valider";
    button.classList.remove("btn");
    button.classList.add("validate-btn");

    button.addEventListener("click", () => {
      const form = document.querySelector(".add-form");
      console.log(form);
      // form.submit();
    })

  });

}

addProject();

////////// CREATE /////////////

  // prévisualisation de la photo
  // de nouveau un bouton valider
  // submit le form
  // fetch post method




///////////// OPEN AND CLOSE MODAL //////////////

function callModal() {
  const modal = document.querySelector('#modal');

  if (document.querySelector('.js-open-button')) {
    const openModal = document.querySelector('.js-open-button');
    openModal.addEventListener("click", () => {
      modal.showModal();
    })
  }
  const closeModal = document.querySelector('.js-close-button');
  closeModal.addEventListener("click", () => {
    modal.close();
  })

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  generateIndex(works);
}

callModal();