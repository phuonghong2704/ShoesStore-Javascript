const orderUrl = "http://localhost:3000/orders";
const detailUrl = "http://localhost:3000/orderDetails";

const fetchApi = async (url, option) => {
  const res = await fetch(url, option);
  return res.json();
};

const getOrders = async () => {
  const option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetchApi(orderUrl, option);
  showOrders(res);
};
const showOrders = (data) => {
  let tableBody = document.getElementById("tableProduct");
  tableBody.innerHTML = "";
  let htmls = data.map((order) => {
    return `
    <tr>
    <td><input type="checkbox" name="check"></td>
    <th scope="row">${order.id}</th>
    <td>${order.name}</td>
    <td>${order.address}</td>
    <td>${order.mobile}</td>
    <td>
        <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#showDetails" onclick="getDetailById(${order.id})">Chi tiết</button>
        <button type="button" class="btn btn-danger" onclick="deleteOrder(this)" data-id=${order.id}>Xóa</button>
    </td>
</tr>
          `;
  });
  tableBody.innerHTML += htmls.join("");
};

const getDetailById = async (id) => {
  const detailsUrl = `${detailUrl}?orderId=${id}`;
  const option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetchApi(detailsUrl, option);
  showDetail(res);
};

const showDetail = (data) => {
  let tableBody = document.getElementById("tableDetail");
  tableBody.innerHTML = "";
  let htmls = data.map((detail) => {
    return `
    <tr>
    <td><input type="checkbox" name="check"></td>
    <th scope="row">${detail.id}</th>
    <td>${detail.product_id}</td>
    <td>${detail.quantity}</td>
    <td>$${detail.unit_price}.00</td>
</tr>
          `;
  });
  tableBody.innerHTML += htmls.join("");
};

const deleteOrder = async (element) => {
  let id = element.getAttribute("data-id");
  let ordersUrl = `${orderUrl}/${id}`;
  const option = {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    cache: "no-cache",
  };
  const res = await fetchApi(ordersUrl, option);
  showOrders(res);
};

getOrders();
