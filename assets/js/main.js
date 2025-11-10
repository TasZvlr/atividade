
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.getElementById("menu-btn");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
  }

  const links = document.querySelectorAll(".nav a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  });

  loadAPIRecipes();
  loadRecipeDetail();
});


const API_KEY = "29bb2c71b5f94758930f7ba4ee9012c4"; 

async function loadAPIRecipes(){
  const root = document.getElementById("recipes-root");
  if(!root) return;

  root.innerHTML = "<p>Carregando receitas...</p>";

  const params = new URLSearchParams(location.search);
  const cat = params.get("cat");

  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=35`;

  if(cat){
    url += `&query=${cat}`;
  }

  try{
    const res = await fetch(url);
    const data = await res.json();

    if(!data.results || data.results.length == 0){
      root.innerHTML = "<p>Nenhuma receita encontrada 😕</p>";
      return;
    }

    root.innerHTML = "";
    data.results.forEach(meal=>{
      root.innerHTML += `
      <div class="card">
        <img src="${meal.image}" style="width:100%;border-radius:8px;">
        <h3>${meal.title}</h3>
        <a class="btn" href="recipe-detail.html?id=${meal.id}">Ver Receita</a>
      </div>`;
    });

  }catch(e){
    root.innerHTML = "<p>Erro ao carregar receitas 🔁</p>";
  }
}

async function loadRecipeDetail() {
  const root = document.getElementById("recipe-detail");
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    root.innerHTML = "<p>Receita inválida ❌</p>";
    return;
  }

  root.innerHTML = "<p>Carregando receita...</p>";

  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
    );
    const meal = await res.json();

    root.innerHTML = `
    <div class="card">
      <img src="${meal.image}" alt="" style="width:100%;border-radius:8px;">
      <h2>${meal.title}</h2>
      <p><strong>Tempo de preparo:</strong> ${meal.readyInMinutes} min</p>
      <h3>Ingredientes</h3>
      <ul>
        ${meal.extendedIngredients.map(i => `<li>${i.original}</li>`).join("")}
      </ul>
      <h3>Modo de preparo</h3>
      <p>${meal.instructions || "Sem instruções disponíveis 😕"}</p>
    </div>
    `;

  } catch (err) {
    root.innerHTML = "<p>Erro ao carregar detalhes 😥</p>";
  }
}