const productURL = "http://localhost:3000/products/";

const fetchApi = async (url, option) => {
  const res = await fetch(url, option);
  return res.json();
};
const getProducts = async () => {
  const option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetchApi(productURL, option);
  showProducts(res);
};

const getProductById = async (id) => {
  const productsUrl = productURL + id;
  const option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetchApi(productsUrl, option);
  showFormEdit(res);
};

const searchProduct = async (e) => {
  const name = e.value;
  const productsUrl = `http://localhost:3000/products?name=${name}`;
  const option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetchApi(productsUrl, option);
  showProducts(res);
};

const showProducts = (data) => {
  let tableBody = document.getElementById("tableProduct");
  tableBody.innerHTML = "";
  let htmls = data.map((product) => {
    return `
        <tr>
        <td><input type="checkbox" name="check"></td>
        <th scope="row">${product.id}</th>
        <td>${product.name}</td>
        <td>${product.idCata}</td>
        <td>$${product.price}.00</td>
        <td>${product.description}</td>
        <td><img src="${product.image}" width="50rem"></td>
        <td>
            <button type="button" class="btn btn-info" onclick="getProductById(${product.id})" data-id=${product.id} data-bs-toggle="modal" data-bs-target="#editProduct">Sửa</button>
            <button type="button" class="btn btn-danger" onclick="deleteProduct(this)" id="delete" data-id=${product.id}>Xóa</button>
        </td>
    </tr>
        `;
  });
  tableBody.innerHTML += htmls.join("");
};

const showFormEdit = (product) => {
  let editForm = document.getElementById("editForm");
  editForm.innerHTML = "";
  let html = `
        <div class="mb-3">
        <label for="" class="form-label">ID Sản Phẩm</label>
        <input type="number" class="form-control" id="idE" name="id" readonly value="${product.id}">
    </div>
    <div class="mb-3">
    <label for="" class="form-label">Tên danh mục</label>
    <input type="text" class="form-control" id="idCataE" name="idCata" value="${product.idCata}">
</div>
    <div class="mb-3">
        <label for="" class="form-label">Tên sản phẩm</label>
        <input type="text" class="form-control" id="nameE" name="name" value="${product.name}">
    </div>
    <div class="mb-3">
        <label for="" class="form-label">Giá</label>
        <input type="number" class="form-control" id="priceE" name="price" value="${product.price}">
    </div>
    <div class="mb-3">
        <label for="" class="form-label">Mô tả</label>
        <textarea type="text" class="form-control" id="descriptionE"
            name="description">${product.description}</textarea>
    </div>
    <div class="mb-3">
        <label for="" class="form-label">Hình ảnh</label>
        <input type="text" class="form-control" id="imageE" name="image" value="${product.image}">
    </div>
        `;
  editForm.innerHTML = html;
};
const validateAddFrom = () => {
  const id = document.getElementById("id").value;
  const idCata = document.getElementById("idCata").value;
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;
  if (!id || !idCata || !name || !price || !description || !image) {
    alert("Vui lòng điền đầy đủ thông tin");
  } else {
    alert("Thêm thành công");
    return addProduct();
  }
};
const validateEditFrom = () => {
  const id = document.getElementById("idE").value;
  const idCata = document.getElementById("idCataE").value;
  const name = document.getElementById("nameE").value;
  const price = document.getElementById("priceE").value;
  const description = document.getElementById("descriptionE").value;
  const image = document.getElementById("imageE").value;
  if (!id || !idCata || !name || !price || !description || !image) {
    alert("Vui lòng điền đầy đủ thông tin");
  } else {
    alert("Sửa thành công");
    return editProduct();
  }
};

const addProduct = async () => {
  let data = {
    id: document.getElementById("id").value,
    idCata: document.getElementById("idCata").value,
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    description: document.getElementById("description").value,
    image: document.getElementById("image").value,
  };
  let option = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const res = await fetchApi(productURL, option);
  showProducts(res);
};

const editProduct = async () => {
  let idE = document.getElementById("idE").value;
  const data = {
    id: document.getElementById("idE").value,
    idCata: document.getElementById("idCataE").value,
    name: document.getElementById("nameE").value,
    price: document.getElementById("priceE").value,
    description: document.getElementById("descriptionE").value,
    image: document.getElementById("imageE").value,
  };
  const productsUrl = productURL + idE;
  const option = {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const res = await fetchApi(productsUrl, option);
  showProducts(res);
};

const deleteProduct = async (element) => {
  let id = element.getAttribute("data-id");
  let productsUrl = productURL + id;
  const option = {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetchApi(productsUrl, option);
  showProducts(res);
};

document.getElementById("add-btn").addEventListener("click", (e) => {
  e.preventDefault();
  validateAddFrom();
});
document.getElementById("update-btn").addEventListener("click", () => {
  validateEditFrom();
});
const render = () => {
  getProducts();
};

render();
