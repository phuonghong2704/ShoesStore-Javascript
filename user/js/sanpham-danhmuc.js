const productURL = "http://localhost:3000/products";
const url = "http://localhost:3000/";
const productDOM = document.getElementById("productUI");
const button = document.querySelector(".btnp");
const itemsTotal = document.getElementById("cart-number");
const cartTotal = document.getElementById("cart-total");
const cartUI = document.getElementById("cartUI");
const overlay = document.getElementById("overlay");
const cartShow = document.getElementById("cart");
const btnDeleteItemInCart = document.getElementsByClassName("deleteCart");
const btnDeleteAllInCart = document.getElementById("deleteAllCart");
const orderUI = document.getElementById("orderUI");
let cart = [];

let buttonDOM = [];

class UI {
  displayProduct(obj) {
    let results = "";
    obj.forEach(({ id, name, price, image }) => {
      results += `
        <div class="col-md-4 col-sm-6 col-12 mb-3>
            <div class="card" style="width: 18rem;">
                <img src="${image}" class="d-block w-100" alt="..." data-bs-toggle="modal" data-bs-target="#detail" data-id=${id} onclick="displayDetail(this)">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <h6 class="card-title">$${price}.00</h6>
                    <a class="add-cart btn btnp btn-secondary mt-2 deleteCart" data-id=${id}>Add to cart</a>
                </div>
            </div>
        </div>
            `;
    });
    productDOM.innerHTML = results;
  }

  getButton() {
    const buttons = [...document.querySelectorAll(".add-cart")];
    buttonDOM = buttons;
    buttons.forEach((button) => {
      const id = button.dataset.id;
      const inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disable = true;
      }
      button.addEventListener("click", (e) => {
        e.target.innerHTML = "In Cart";
        e.target.disable = true;

        //get product form products
        const cartItem = { ...Storage.getProduct(id), amount: 1 };
        //Add the product to cart
        cart = [...cart, cartItem];
        //Store the product in local storage
        Storage.saveCart(cart);
        //setItem Value
        this.setItemValue(cart);
        //display the items in the cart
        this.addToCart(cartItem);
      });
    });
  }

  setItemValue(cart) {
    let itemTotal = 0;
    let tempTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemTotal += item.amount;
    });

    itemsTotal.innerText = itemTotal;
    cartTotal.innerText = `$${parseFloat(tempTotal.toFixed(2))}.00`;
    Storage.saveCartNumber(itemTotal);
  }

  addToCart({ id, name, price, image, amount }) {
    cartUI.innerHTML += `
        <tr>
        <td></td>
        <td>${name}</td>
        <td><img src="${image}" width="50px"></td>
        <td><i class="fas fa-minus-circle decrease" data-id="${id}"></i><span width="100px" class="quantity">${amount}</span><i class="fas fa-plus-circle increase" data-id="${id}"></i></td>
        <td data-price=${price} class="cart-price">$${price * amount}.00</td>
        <td data-id=${id} class="remove_item"><button type="button" class="btn-close"  aria-label="Close"></button></td>
        </tr>
        `;
  }
  setApp() {
    cart = Storage.getCart();
    this.setItemValue(cart);
    this.populate(cart);
  }

  populate(cart) {
    cart.forEach((item) => this.addToCart(item));
  }

  cartLogic() {
    //clear Cart
    btnDeleteAllInCart.addEventListener("click", () => {
      this.clearCart();
    });
    //cart Functionality
    cartUI.addEventListener("click", (e) => {
      const target = e.target.closest("td");
      const target2 = e.target.closest("i");
      const targetElement = target.classList.contains("remove_item");
      if (!target) return;
      if (targetElement) {
        const id = target.dataset.id;
        this.removeItem(id);
        cartUI.removeChild(target.parentElement);
      } else if (target2.classList.contains("increase")) {
        const id = target2.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount++;
        Storage.saveCart(cart);
        this.setItemValue(cart);
        target2.previousElementSibling.innerText = tempItem.amount;
        target.nextElementSibling.innerText = `$${
          tempItem.amount * target.nextElementSibling.dataset.price
        }.00`;
      } else if (target2.classList.contains("decrease")) {
        {
          const id = target2.dataset.id;
          let tempItem = cart.find((item) => item.id === id);
          tempItem.amount--;
          if (tempItem.amount > 0) {
            Storage.saveCart(cart);
            this.setItemValue(cart);
            target2.nextElementSibling.innerText = tempItem.amount;
            target.nextElementSibling.innerText = `$${
              tempItem.amount * target.nextElementSibling.dataset.price
            }.00`;
          } else {
            this.removeItem(id);
            cartUI.removeChild(target2.parentElement.parentElement);
          }
        }
      }
    });
  }
  clearCart() {
    const cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartUI.children.length > 0) {
      cartUI.removeChild(cartUI.children[0]);
    }
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id === id);
    this.setItemValue(cart);
    Storage.saveCart(cart);
    let button = this.singleButton(id);
    button.disable = true;
    button.innerText = "Add To Cart";
  }
  singleButton(id) {
    return buttonDOM.find((button) => button.dataset.id === id);
  }

  async displayOrder() {
    let carts = await Storage.getCart();
    let ui = await this.orderUI(carts);
    return ui;
  }
  orderUI(carts) {
    let htmls = ``;
    carts.forEach((cart) => {
      htmls += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
            ${cart.amount} x ${cart.name}
            <span class="badgep-3 mb-2 bg-secondary text-white rounded-pill">$${
              cart.price * cart.amount
            }.00</span>
        </li>
            `;
    });
    orderUI.innerHTML = htmls;
  }
}
class Storage {
  static saveProduct(obj) {
    localStorage.setItem("products", JSON.stringify(obj));
  }

  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem("products"));
    return products.find((item) => item.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("carts", JSON.stringify(cart));
  }
  static saveCartNumber(number) {
    localStorage.setItem("cart-number", number);
  }

  static getCart() {
    let carts = localStorage.getItem("carts");
    if (carts) {
      return JSON.parse(carts);
    } else {
      return (carts = []);
    }
  }
}
class Products {
  async getProduct() {
    try {
      const results = await fetch(productURL);
      const data = await results.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}

const fetchApi = async (url, option) => {
  const res = await fetch(url, option);
  return res.json();
};

const checkout = async () => {
  const data = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    mobile: document.getElementById("mobile").value,
  };
  const orderURL = url + "orders";
  const option = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const res = await fetchApi(orderURL, option);
  postOrderDetail(res.id);
};
const postOrderDetail = async (idOrder) => {
  let storage = localStorage.getItem("carts");
  if (storage) {
    cart = JSON.parse(storage);
  }

  let orderDetails = [];
  for (let index = 0; index < cart.length; index++) {
    const item = cart[index];
    let orderDetail = {
      orderId: idOrder,
      product_id: item.id,
      quantity: item.amount,
      unit_price: item.price,
    };
    orderDetails.push(orderDetail);
  }
  let promises = orderDetails.map((item) => {
    return postOrderDetailAsync(item);
  });

  await Promise.all(promises);
  localStorage.removeItem("carts");
  cart = [];
  alert("Bạn đã đặt hàng thành công!");
};
const postOrderDetailAsync = async (data) => {
  const detailsUrl = url + "orderDetails";
  const option = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  await fetchApi(detailsUrl, option);
};
const validateFormOrderAndCheckOut = () => {
  let id = document.getElementById("id").value;
  let name = document.getElementById("name").value;
  let address = document.getElementById("address").value;
  let mobile = document.getElementById("mobile").value;
  let validatePhone = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
  let cart = localStorage.getItem("carts");
  if ((!id, !name, !address, !mobile)) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return false;
  } else if (name.length < 5) {
    alert("Tên phải lớn hơn 5 kí tự");
    return false;
  } else if (!mobile.match(validatePhone)) {
    alert("Số điện thoại không hợp lệ");
    return false;
  } else if (!cart) {
    alert("Giỏ hàng trống");
    return false;
  } else if (JSON.parse(cart).length < 0) {
    alert("Giỏ hàng trống");
    return false;
  } else checkout();
};

const displayDetail = (e) => {
  id = e.getAttribute("data-id");
  console.log(id);
  let product = Storage.getProduct(id);
  console.log(product);
  let detailUI = document.getElementById("detailUI");
  html = `
            <div class="col-md-4">
            <img src="${product.image}"
                width="100%" alt="...">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h4 class="card-title">${product.name}</h4>
                <h5 class="card-title">$${product.price}.00</h5>
                <p class="card-text">$${product.description}.</p>
                <p class="card-text"><small class="text-muted">${product.idCata}></p>
            </div>
        </div>
            `;
  detailUI.innerHTML = html;
};

document.addEventListener("DOMContentLoaded", async () => {
  const ui = new UI();
  const products = new Products();
  ui.setApp();
  ui.cartLogic();
  const productsObj = await products.getProduct();
  ui.displayProduct(productsObj);
  ui.getButton();
  Storage.saveProduct(productsObj);
});
document.getElementById("btnOrder").addEventListener("click", (e) => {
  e.preventDefault();
  return validateFormOrderAndCheckOut();
});
document.getElementById("orderFrom").addEventListener("click", () => {
  const ui = new UI();
  return ui.displayOrder();
});
