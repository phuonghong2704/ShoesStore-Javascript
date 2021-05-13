const carts = JSON.parse(localStorage.getItem('carts'));
const cartUI = document.getElementById('cartUI');

const showCart =(carts) =>{
    let htmls = '';
    carts.forEach((product, index) => {
      htmls += `
      <tr>
      <td>${index+1}</td>
      <td>${product.name}</td>
      <td><img src="${product.image}" width="50px"></td>
      <td><i class="fas fa-minus-circle"></i><span width="100px">${product.quantity}</span><i class="fas fa-plus-circle"></i></td>
      <td>$${product.price}.00</td>
      <td><button type="button" class="btn-close" aria-label="Close"></button></td>
      </tr>
      `
    });
    cartUI.innerHTML = htmls;
}
showCart(carts)
