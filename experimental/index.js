// const delay = ms => new Promise(res => setTimeout(res, ms));

const nav = document.querySelector('nav');
document.querySelector("#bgvid").playbackRate = 0.3

async function lazy_load(target){
  await delay(100)
  let lazy_loaders = target.querySelectorAll(".lazy-loading")
  if(lazy_loaders.length > 0){
    lazy_loaders.forEach(x => x.classList.remove('lazy-loading'))
  }
}

const observer = new IntersectionObserver(entries =>{
  entries.forEach(entry =>{
    if(entry.isIntersecting){
      nav.classList.add("nav-transparent");
      lazy_load(entry.target)
    }else if(window.scrollY > 0){
      nav.classList.remove("nav-transparent");
    }
  })
}, {threshold:0.8})
document.querySelectorAll("[data-important-section]").forEach((el) => observer.observe(el))

const text_observer = new IntersectionObserver(async entries =>{
  for (entry of entries) {
    if(entry.isIntersecting && entry.target.dataset.write_text == 'true'){
      entry.target.dataset.write_text = 'false'
      await typewriter_effect(entry.target)
      await delay(100)
    }else if(entry.target.dataset.write_text == 'false'){
      text_observer.unobserve(entry.target)
    }
  }
}, {threshold:0.8})
document.querySelectorAll("[data-write_text]").forEach((el) => text_observer.observe(el))

async function typewriter_effect(text){
  let old_text
  let nodes = text.childNodes
  let text_node
  nodes.forEach(x => {
    if(x.nodeType === 3){
      old_text = x.nodeValue
      x.nodeValue = ''
      text_node = x
    }
  })
  let old_length = old_text.length
  for (let i = 0; i < old_text.length; i++) {
    text_node.nodeValue += old_text[i]
    await delay(Math.max(1000/old_length, 30))
  }
}

let nav_menu_btn = document.querySelector("#hmbgmenubtn")
nav_menu_btn.addEventListener("click", async () =>{
  let nav_mobile_menu = document.querySelector("#nav_mobile_menu")
  if(nav_menu_btn.dataset.state==='closed'){
    nav_menu_btn.dataset.state='open'
    nav_menu_btn.style.transform = 'scale(0.8)'
    let btn_spans = nav_menu_btn.querySelectorAll("span")
    btn_spans[0].style.transform = `translateY(${btn_spans[0].offsetHeight + 6}px) rotate(-45deg)`
    btn_spans[2].style.transform = `translateY(-${btn_spans[2].offsetHeight + 6}px) rotate(45deg)`
    btn_spans[1].style.transform = 'rotate(-45deg)'
    document.querySelectorAll('nav>ul li:not(#hmbgmenu)').forEach((el) =>{
      nav_mobile_menu.appendChild(el)
      el.style.display = "inline-block"
      el.classList.add("lazy-loading")
      lazy_load(nav_mobile_menu)
    })
    nav_mobile_menu.style.display = "flex"
    // nav_mobile_menu.style.gap = '60px'
    await delay(100)
    nav_menu_btn.style.transform = 'scale(1)'
    nav_mobile_menu.style.opacity = "1"

  }else{
    nav_menu_btn.dataset.state='closed'
    nav_menu_btn.style.transform = 'scale(0.8)'
    let btn_spans = nav_menu_btn.querySelectorAll("span")
    btn_spans[0].style = ''
    btn_spans[2].style = ''
    btn_spans[1].style = ''  
    nav_mobile_menu.style.opacity = "0"
    await delay(100)
    nav_menu_btn.style.transform = 'scale(1)'
    await delay(200)
    Array.from(nav_mobile_menu.children).forEach((el) =>{
      document.querySelector('nav>ul').appendChild(el)
      el.style= ""
    })
    nav_mobile_menu.style.display = "none"
  }
})

//------------ Section 1 Carousel ------------//
{
let caro1 = document.querySelector("#carousel1")
let caro1_controls = document.querySelector("#caro1_control")
let caro1_imgs = document.querySelectorAll('#carousel1>div>*')
let caro1_btns = document.querySelectorAll('#carousel1 .carousel_btn')
let caro1_autoplayer_bar = document.querySelector('#carousel1 .carousel_bar')
let is_bar_moving = false

async function move_image(btn){
  let index = Number(btn.dataset.index)
  let rswipe = document.querySelector('#carousel1 #mobile-rswipe-img')
  let lswipe = document.querySelector('#carousel1 #mobile-lswipe-img')
  caro1_imgs.forEach(x => x.dataset['main_image'] = 'false')
  if(index==0){
    caro1_imgs[4].dataset["main_image"] = 'before'
    caro1_imgs[0].dataset["main_image"] = 'true'
    caro1_imgs[1].dataset["main_image"] = 'after'
    caro1_imgs[4].appendChild(rswipe)
    caro1_imgs[1].appendChild(lswipe)
  }else if(index==4){
    caro1_imgs[3].dataset["main_image"] = 'before'
    caro1_imgs[4].dataset["main_image"] = 'true'
    caro1_imgs[0].dataset["main_image"] = 'after'
    caro1_imgs[3].appendChild(rswipe)
    caro1_imgs[0].appendChild(lswipe)
  }else if(index < 4 && index > 0){
    caro1_imgs[index-1].dataset["main_image"] = 'before'
    caro1_imgs[index].dataset["main_image"] = 'true'
    caro1_imgs[index+1].dataset["main_image"] = 'after'
    caro1_imgs[index-1].appendChild(rswipe)
    caro1_imgs[index+1].appendChild(lswipe)
  }
  caro1_btns.forEach(x => x.dataset.selected = 'false')
  caro1_btns[index].dataset.selected = 'true'
  caro1_imgs[index].appendChild(caro1_controls)
  caro1_autoplayer_bar.dataset.progress = 0
}
async function move_caro_bar(bar){
  while(true){
    if(!is_bar_moving){
      return
    }
    if(bar.dataset.progress < 100){
    bar.dataset.progress = Number(bar.dataset.progress) + 0.5
    }else{
      let selected_btn = document.querySelector('#carousel1 .carousel_btn[data-selected="true"]')
      if(selected_btn.dataset.index < 4){
        move_image(caro1_btns[Number(selected_btn.dataset.index)+1])
      }else{
        move_image(caro1_btns[0])
      }
      bar.dataset.progress = 0
    }
    bar.style.width = bar.dataset.progress + "%"
    await delay(40)
  }
}
caro1_btns.forEach(btn => {
  btn.addEventListener("click", () => move_image(btn))
})
const carousel_observer = new IntersectionObserver(async entries =>{
  for (entry of entries) {
    if(entry.isIntersecting){
      is_bar_moving = true
      move_caro_bar(caro1_autoplayer_bar)
    }else{
      is_bar_moving = false
    }
  }
}, {threshold:0.5})
carousel_observer.observe(caro1)

let touchstartX = 0
let touchendX = 0
    
function checkDirection(){
  let selected_btn = document.querySelector('#carousel1 .carousel_btn[data-selected="true"]')
  let rswipe = document.querySelector('#carousel1 #mobile-rswipe-img')
  let lswipe = document.querySelector('#carousel1 #mobile-lswipe-img')
  rswipe.style.opacity = '0'
  lswipe.style.opacity = '0'
  if (touchendX < touchstartX){
    if(selected_btn.dataset.index < 4){
      move_image(selected_btn.nextElementSibling)}else{
        move_image(caro1_btns[0])
      }
  }
  if (touchendX > touchstartX){
    if(selected_btn.dataset.index > 0){
      move_image(selected_btn.previousElementSibling)}else{
        move_image(caro1_btns[4])
      }
  }
}

caro1.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

caro1.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  checkDirection()
})
}
//------------ Section 1 Carousel End ------------//