const url = "http://localhost:3000/";

const fetchApi = async (url, option) => {
  return await fetch(url, option);
};

const getProductByCata = async (id) => {
  const productsUrl = `${url}products?idCata=${id}`;
  const option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetchApi(productsUrl, option);
  return res.json();
};

const getProducts = async () => {
  const option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetchApi(`${url}products`, option);
  return res.json();
};

async function chartProductByView() {
  let products = await getProducts();
  const names = [];
  const views = [];
  products.forEach((product) => {
    let name = product.name;
    names.push(name);
    let view = product.view;
    views.push(view);
  });
  const chart = document.getElementById("productByView");
  const labels = names;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First Dataset",
        data: views,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  return new Chart(chart, config);
}

function chartByCata() {
  const cata = ["man", "woman", "design"];
  const dataByCata = [];
  cata.forEach(async (nameCata) => {
    const res = await getProductByCata(nameCata);
    dataByCata.push(res.length);
  });
  const chart = document.getElementById("productsByCata");
  const data = {
    labels: cata,
    datasets: [
      {
        label: "Sản phẩm theo danh mục",
        data: dataByCata,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const config = {
    type: "doughnut",
    data: data,
  };

  return new Chart(chart, config);
}

getProducts();
chartByCata();
chartProductByView();
