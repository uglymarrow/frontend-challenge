const main_div = document.querySelector(".main");
const gallery = document.getElementById("gallery");
const fav_block = document.getElementById("fav_block");
const main_link = document.getElementById("all_link");
const favorite_link = document.getElementById("fav_link");
const btn = document.querySelector(".btn");

const CARD_NUMBERS = 15;
let card_id = 0;

const url = "https://api.thecatapi.com/v1/images/search";

async function fetchImage() {
  res = "";
  try {
    const response = await fetch(url);
    const data = await response.json();
    res = data[0].url;
  } catch (e) {
    res = "error";
  }
  return res;
}

function makeHeartFilled(svg) {
  svg.firstChild.setAttribute(
    "d",
    "M20 36.7L17.1 34.06C6.8 24.72 0 18.56 0 11C0 4.84 4.84 0 11 0C14.48 0 17.82 1.62 20 4.18C22.18 1.62 25.52 0 29 0C35.16 0 40 4.84 40 11C40 18.56 33.2 24.72 22.9 34.08L20 36.7Z"
  );
}

function makeHeartEmpty(svg) {
  svg.firstChild.setAttribute(
    "d",
    "M29 0C25.52 0 22.18 1.62 20 4.18C17.82 1.62 14.48 0 11 0C4.84 0 0 4.84 0 11C0 18.56 6.8 24.72 17.1 34.08L20 36.7L22.9 34.06C33.2 24.72 40 18.56 40 11C40 4.84 35.16 0 29 0ZM20.2 31.1L20 31.3L19.8 31.1C10.28 22.48 4 16.78 4 11C4 7 7 4 11 4C14.08 4 17.08 5.98 18.14 8.72H21.88C22.92 5.98 25.92 4 29 4C33 4 36 7 36 11C36 16.78 29.72 22.48 20.2 31.1Z"
  );
}

function createLikeButton(msg) {
  const heart_btn = document.createElement("button");
  heart_btn.classList.add("like-btn");
  heart_btn.addEventListener("click", clickLikeButton);
  heart_btn.addEventListener("mouseover", hoverLikeButton);
  heart_btn.addEventListener("mouseout", unhoverLikeButton);

  const svg_heart = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svg_heart.setAttribute("width", "40");
  svg_heart.setAttribute("height", "37");
  svg_heart.setAttribute("viewBox", "0 0 40 37");
  svg_heart.setAttribute("fill", "none");

  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  iconPath.setAttribute("fill", "#F24E1E");
  svg_heart.appendChild(iconPath);

  if (msg == "empty") makeHeartEmpty(svg_heart);

  if (msg == "filled") makeHeartFilled(svg_heart);

  heart_btn.appendChild(svg_heart);
  return heart_btn;
}

function hoverCard(event) {
  const cur_card = event.target.closest("div");
  const like_btn = cur_card.lastChild;
  const svg = like_btn.lastChild;
  
  if (localStorage[cur_card.id] != undefined) {
    makeHeartFilled(svg);
  } else {
    makeHeartEmpty(svg);
  }
}

function addCards(number) {
  for (let i = 0; i < number; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = card_id;
    card.setAttribute("tabindex", "1");
    card.addEventListener("mouseenter", hoverCard);

    const image = document.createElement("img");
    image.classList.add("cat-img");

    fetchImage().then((res) => (image.src = res));
    card.appendChild(image);

    card.appendChild(createLikeButton("empty"));

    gallery.append(card);
    card_id++;
  }
}

function loadFavorites() {
  while (fav_block.firstChild) {
    fav_block.removeChild(fav_block.firstChild);
  }

  for (let i = 0; i < localStorage.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = localStorage.key(i);

    card.setAttribute("tabindex", "1");

    const image = document.createElement("img");
    image.classList.add("cat-img");

    image.src = localStorage.getItem(card.id);
    card.appendChild(image);

    card.appendChild(createLikeButton("filled"));

    fav_block.append(card);
    main_div.append(fav_block);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  main_link.classList.add("navbar-link-main");
  addCards(CARD_NUMBERS);
  localStorage.clear();
});

main_link.addEventListener("click", () => {
  favorite_link.classList.remove("navbar-link-main");
  fav_block.style.display = "none";
  main_link.classList.add("navbar-link-main");

  gallery.style.display = "flex";
  btn.style.display = "block";
});

favorite_link.addEventListener("click", () => {
  main_link.classList.remove("navbar-link-main");
  favorite_link.classList.add("navbar-link-main");

  gallery.style.display = "none";
  btn.style.display = "none";

  fav_block.style.display = "flex";
  loadFavorites();
});

btn.addEventListener("click", () => {
  addCards(10);
});

function clickLikeButton(event) {
  const cur_card = event.target.closest("div");
  const like_btn = event.target.closest("button");
  const svg = like_btn.lastChild;

  if (localStorage[cur_card.id] != undefined) {
    makeHeartEmpty(svg);
    localStorage.removeItem(cur_card.id);
  } else {
    makeHeartFilled(svg);
    localStorage.setItem(cur_card.id, cur_card.firstChild.src);
  }
}

function hoverLikeButton(event) {
  const like_btn = event.target.closest("button");
  const svg = like_btn.lastChild;

  makeHeartFilled(svg);
}

function unhoverLikeButton(event) {
  const cur_card = event.target.closest("div");

  const like_btn = event.target.closest("button");
  const svg = like_btn.lastChild;

  if (localStorage[cur_card.id] == undefined) 
    makeHeartEmpty(svg);
  else 
    makeHeartFilled(svg);
}
