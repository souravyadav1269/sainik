const products=[
{id:1,name:"Classic Black Frame",brand:"Salinaka",price:49.99,type:"featured",image:"assets/defaultBanner.jpg"},
{id:2,name:"Modern Clear Glasses",brand:"Clarity",price:59.99,type:"featured",image:"assets/banner-girl-1.png"},
{id:3,name:"Aviator Sunglasses",brand:"Sunline",price:79.99,type:"featured",image:"assets/banner-guy.png"},
{id:4,name:"Everyday Round Frame",brand:"Salinaka",price:44.99,type:"featured",image:"assets/defaultBanner.jpg"},
{id:5,name:"Premium Black Shades",brand:"Sunline",price:89.99,type:"recommended",image:"assets/banner-girl.png"},
{id:6,name:"Urban Metal Frame",brand:"Clarity",price:69.99,type:"recommended",image:"assets/defaultBanner.jpg"},
{id:7,name:"Classic Brown Frame",brand:"Salinaka",price:54.99,type:"recommended",image:"assets/banner-girl-1.png"},
{id:8,name:"Minimalist Clear Frame",brand:"Clarity",price:64.99,type:"recommended",image:"assets/defaultBanner.jpg"}
];
let cart=JSON.parse(localStorage.getItem("salinaka-cart")||"[]"), currentProduct=null, authMode="signin";

const $=id=>document.getElementById(id);
const money=n=>"$"+n.toFixed(2);

function card(p){
 return `<article class="product-card"><div class="product-img" data-product="${p.id}"><img src="${p.image}" alt="${p.name}"></div><div class="product-info"><h3 class="product-name">${p.name}</h3><p class="brand">${p.brand}</p><h4 class="price">${money(p.price)}</h4><button class="btn small add" data-add="${p.id}">Add to basket</button></div></article>`;
}
function render(list,id){$(id).innerHTML=list.length?list.map(card).join(""):`<div class="empty">No products found.</div>`}
function save(){localStorage.setItem("salinaka-cart",JSON.stringify(cart));renderCart()}
function renderCart(){
 $("cartCount").textContent=cart.reduce((a,p)=>a+p.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map(p=>`<div class="cart-row"><img src="${p.image}" alt=""><div class="cart-row-info"><h4>${p.name}</h4><div>${money(p.price)}</div><div class="qty"><button data-minus="${p.id}">−</button><span>${p.qty}</span><button data-plus="${p.id}">+</button></div></div><button class="remove" data-remove="${p.id}">Remove</button></div>`).join(""):`<div class="empty">Your basket is empty.</div>`;
 $("cartTotal").textContent=money(cart.reduce((a,p)=>a+p.price*p.qty,0));
}
function add(id){
 const p=products.find(x=>x.id===id); if(!p)return;
 const old=cart.find(x=>x.id===id);
 if(old)old.qty++;else cart.push({...p,qty:1});
 save();
}
function renderAll(filter=""){
 let list=products.filter(p=>!filter||p.name.toLowerCase().includes(filter.toLowerCase())||p.brand.toLowerCase().includes(filter.toLowerCase()));
 const sort=$("sortSelect").value;
 if(sort==="price-asc")list.sort((a,b)=>a.price-b.price);
 if(sort==="price-desc")list.sort((a,b)=>b.price-a.price);
 render(products.filter(p=>p.type==="featured"),"featuredProducts");
 render(products.filter(p=>p.type==="recommended"),"recommendedProducts");
 render(list,"shopProducts");
}
document.addEventListener("click",e=>{
 const addBtn=e.target.closest("[data-add]"); if(addBtn){add(+addBtn.dataset.add);return}
 const img=e.target.closest("[data-product]"); if(img){
  const p=products.find(x=>x.id===+img.dataset.product);currentProduct=p;
  $("modalImage").src=p.image;$("modalName").textContent=p.name;$("modalBrand").textContent=p.brand;$("modalPrice").textContent=money(p.price);$("productModal").classList.add("open");return
 }
 if(e.target.matches("[data-plus]")){const p=cart.find(x=>x.id===+e.target.dataset.plus);if(p)p.qty++;save()}
 if(e.target.matches("[data-minus]")){const p=cart.find(x=>x.id===+e.target.dataset.minus);if(p){p.qty--;if(p.qty<=0)cart=cart.filter(x=>x.id!==p.id)}save()}
 if(e.target.matches("[data-remove]")){cart=cart.filter(x=>x.id!==+e.target.dataset.remove);save()}
 const close=e.target.closest("[data-close]");if(close)$(close.dataset.close).classList.remove("open");
 if(e.target.matches("[data-filter]")){setTimeout(()=>{ $("searchInput").value=""; renderAll("")},0)}
});
$("cartBtn").onclick=()=>$("cartDrawer").classList.add("open");
$("modalAdd").onclick=()=>{if(currentProduct)add(currentProduct.id);$("productModal").classList.remove("open")};
$("searchInput").addEventListener("input",e=>{renderAll(e.target.value);location.hash="shop"});
$("sortSelect").onchange=()=>renderAll($("searchInput").value);
$("clearSearch").onclick=()=>{$("searchInput").value="";$("sortSelect").value="default";renderAll("")};
function openAuth(mode){authMode=mode;$("authTitle").textContent=mode==="signup"?"Create Account":"Sign In";$("authSubmit").textContent=mode==="signup"?"Sign Up":"Sign In";$("switchAuth").textContent=mode==="signup"?"Already have an account? Sign in":"Create an account";$("authModal").classList.add("open")}
$("signinBtn").onclick=()=>openAuth("signin");$("signupBtn").onclick=()=>openAuth("signup");
$("switchAuth").onclick=()=>openAuth(authMode==="signup"?"signin":"signup");
$("checkoutBtn").onclick=()=>alert("This static version does not connect to Firebase checkout.");
window.addEventListener("scroll",()=>document.body.scrollTop>70||document.documentElement.scrollTop>70?$("navigation").classList.add("scrolled"):$("navigation").classList.remove("scrolled"));
renderAll();renderCart();
