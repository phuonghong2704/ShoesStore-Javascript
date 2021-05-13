const cateURL = "http://localhost:3000/category/";

const fetchApi = async (url, option) => {
  const res = await fetch(url, option);
  return res.json();
};

const getCate = async () => {
  const option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetchApi(cateURL, option);
  showCate(res);
};

const getCateById = async (id) => {
  const catesUrl = cateURL + id;
  const option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetchApi(catesUrl, option);
  showFormEdit(res);
};

const showCate = (data) => {
  let tableBody = document.getElementById("tableProduct");
  tableBody.innerHTML = "";
  let htmls = data.map((cate) => {
    return `
    <tr>
    <td><input type="checkbox" name="check"></td>
    <th scope="row">${cate.id}</th>
    <td>${cate.name}</td>
    <td>
        <button type="button" class="btn btn-info" data-id=${cate.id} data-bs-toggle="modal" data-bs-target="#editCata" onclick="getCateById(${cate.id})">Sửa</button>
        <button type="button" class="btn btn-danger" data-id=${cate.id} onclick="deleteCate(this)">Xóa</button>
    </td>
</tr>
        `;
  });
  tableBody.innerHTML += htmls.join("");
};

const showFormEdit = (cate) => {
  let editForm = document.getElementById("editForm");
  editForm.innerHTML = "";
  let html = `
            <div class="mb-3">
                <label for="" class="form-label">ID danh mục</label>
                <input type="number" class="form-control" id="idE" name="id" readonly value="${cate.id}" readonly>
            </div>
            <div class="mb-3">
                <label for="" class="form-label">Tên danh mục</label>
                <input type="text" class="form-control" id="nameE" name="name" value="${cate.name}">
            </div>
        `;
  editForm.innerHTML = html;
};
const validateAddFrom = () => {
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  if (!id || !name) {
    alert("Vui lòng điền đầy đủ thông tin");
  } else {
    alert("Thêm thành công");
    return addCate();
  }
};
const validateEditFrom = () => {
  const id = document.getElementById("idE").value;
  const name = document.getElementById("nameE").value;
  if (!id || !name) {
    alert("Vui lòng điền đầy đủ thông tin");
  } else {
    alert("Sửa thành công");
    return editCate();
  }
};

const addCate = async () => {
  let data = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
  };
  let option = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const res = await fetchApi(cateURL, option);
  showCate(res);
};

const editCate = async () => {
  let idE = document.getElementById("idE").value;
  const data = {
    id: document.getElementById("idE").value,
    name: document.getElementById("nameE").value,
  };
  const catesUrl = cateURL + idE;
  const option = {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const res = await fetchApi(catesUrl, option);
  showCate(res);
};

const deleteCate = async (element) => {
  let id = element.getAttribute("data-id");
  let catesUrl = cateURL + id;
  const option = {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetchApi(catesUrl, option);
  showCate(res);
};

document.getElementById("add-btn").addEventListener("click", (e) => {
  e.preventDefault();
  validateAddFrom();
});
document.getElementById("update-btn").addEventListener("click", () => {
  validateEditFrom();
});
const render = () => {
  getCate();
};

render();
