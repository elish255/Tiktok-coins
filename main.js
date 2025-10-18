// --- Replace this firebaseConfig with your project's config ---
const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT.firebaseapp.com",
projectId: "YOUR_PROJECT",
storageBucket: "YOUR_PROJECT.appspot.com",
messagingSenderId: "SENDER_ID",
appId: "APP_ID",
};


firebase.initializeApp(firebaseConfig);
const functions = firebase.functions();
const firestore = firebase.firestore();


// images
document.getElementById('heroThumb').style.backgroundImage = "url('IMG_20251016_202950_325.jpg')";


const PACKAGES = [
{ id: 1, coins: '75,000', price: 75, desc: 'Starter pack', img: 'Screenshot_20251016_205743_Telegram.jpg' },
{ id: 2, coins: '200,000', price: 120, desc: 'Popular choice', img: 'IMG_20251012_133318_337.jpg' },
{ id: 3, coins: '500,000', price: 200, desc: 'Best price per coin', img: 'IMG_20251012_133318_337.jpg' },
{ id: 4, coins: '700,000', price: 250, desc: 'Wholesale tier', img: 'IMG_20251012_133318_337.jpg' },
];


const container = document.getElementById('cardsContainer');
const modal = document.getElementById('modal');
const selPackageEl = document.getElementById('selPackage');
const orderCoinsEl = document.getElementById('orderCoins');
const orderPriceEl = document.getElementById('orderPrice');
const confirmBtn = document.getElementById('confirmBtn');
const closeModalBtn = document.getElementById('closeModal');
const successBox = document.getElementById('successBox');
let selectedPackage = null;


function openModal(pkg){
selectedPackage = pkg;
selPackageEl.textContent = pkg.coins + ' coins — ' + pkg.desc;
orderCoinsEl.textContent = pkg.coins + ' coins';
orderPriceEl.textContent = '$' + pkg.price;
successBox.style.display = 'none';
modal.style.display = 'flex';
document.getElementById('username').value = '';
}
function closeModal(){ modal.style.display = 'none'; selectedPackage = null; }


PACKAGES.forEach(pkg=>{
const card = document.createElement('div');
card.className = 'card';
card.innerHTML = `
<div class="img" style="background-image:url('${pkg.img}')"></div>
<div class="meta">
<div class="pack">${pkg.coins} coins</div>
<div style="font-size:13px; color:#64748b; margin-top:6px">${pkg.desc}</div>
<div class="price" style="margin-top:8px">$${pkg.price}</div>
</div>
<div class="action">
<button class="btn btn-primary" data-id="${pkg.id}">Buy</button>
<button class="btn btn-ghost" data-id="info-${pkg.id}">Details</button>
</div>
`;
container.appendChild(card);
card.querySelector('.btn-primary').addEventListener('click', ()=> openModal(pkg));
card.querySelector('.btn-ghost').addEventListener('click', ()=> alert(`${pkg.coins} — $${pkg.price}\n${pkg.desc}`));
});


closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });


// --- Create order via Firebase Cloud Function ---
confirmBtn.addEventListener('click', async ()=>{
const username = document.getElementById('username').value.trim();
const payMethod = document.getElementById('payment').value;
if(!selectedPackage){ alert('No package selected'); return; }
if(!username){ alert('Enter TikTok username'); return; }


// Call HTTPS function `createOrder`
try{
confirmBtn.disabled = true;
confirmBtn.textContent = 'Preparing...';


const createOrder = functions.httpsCallable('createOrder');
const res = await createOrder({
packageId: selectedPackage.id,
coins: selectedPackage.coins,
price: select