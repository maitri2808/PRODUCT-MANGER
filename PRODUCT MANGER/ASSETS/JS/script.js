function loadProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

const form = document.querySelector("form");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const image = document.querySelector("#image");
const catagory = document.querySelector("#catagory");
const display = document.querySelector("#allProduct");
const sortLowToHighBtn = document.querySelector("#sortLowToHigh");
const sortHighToLowBtn = document.querySelector("#sortHighToLow");
const searchInput = document.querySelector("#searchInput");

let isEditMode = false;
let currentEditId = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (isEditMode) {
    const updatedProduct = {
      title: title.value,
      price: price.value,
      image: image.value,
      catagory: catagory.value
    };
    editProduct(currentEditId, updatedProduct);

    // Reset edit mode
    isEditMode = false;
    currentEditId = null;
    form.reset();
  } else {
    // Add new product
    const product = {
      id: Date.now(), // Unique ID for each product
      title: title.value,
      price: price.value,
      image: image.value,
      catagory: catagory.value
    };

    const allProduct = loadProducts();
    allProduct.push(product);
    saveProducts(allProduct);
  }

  addProductToDoList();
});

// Display products (used by both search and regular display)
function displayProducts(products) {
  let result = "";
  products.map((item) => {
    result += `
        <div class="card" style="width: 18rem;">
            <img src="${item.image}" class="card-img-top" alt="${item.title}">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">Price: $${item.price}</p>
                <p class="card-text">Category: ${item.catagory}</p>
                <button class="btn btn-warning edit-btn" data-id="${item.id}">Edit</button>
            </div>
        </div>`;
  });
  display.innerHTML = result;
}

// Edit product function using splice
function editProduct(id, updatedProduct) {
  const allProduct = loadProducts();
  const index = allProduct.findIndex(product => product.id === id);
  if (index !== -1) {
    allProduct.splice(index, 1, { ...allProduct[index], ...updatedProduct });
    saveProducts(allProduct);
    addProductToDoList();
  }
}

// Sorting functions
function sortProductsLowToHigh() {
  const products = loadProducts();
  products.sort((a, b) => a.price - b.price);
  saveProducts(products);
  addProductToDoList();
}

function sortProductsHighToLow() {
  const products = loadProducts();
  products.sort((a, b) => b.price - a.price);
  saveProducts(products);
  addProductToDoList();
}

// Search products by title
function searchProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const allProducts = loadProducts();
  const filteredProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
}

// Update addProductToDoList to use displayProducts
function addProductToDoList() {
  const allProduct = loadProducts();
  displayProducts(allProduct);
}

// Event listeners
sortLowToHighBtn?.addEventListener('click', sortProductsLowToHigh);
sortHighToLowBtn?.addEventListener('click', sortProductsHighToLow);
searchInput.addEventListener('input', searchProducts);

// Handle edit button click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const id = Number(e.target.dataset.id);
    const allProduct = loadProducts();
    const product = allProduct.find(p => p.id === id);

    if (product) {
      // Enter edit mode
      isEditMode = true;
      currentEditId = id;

      // Populate form with product data
      title.value = product.title;
      price.value = product.price;
      image.value = product.image;
      catagory.value = product.catagory;
    }
  }
});

addProductToDoList();
