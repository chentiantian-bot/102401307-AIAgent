// 存储工具函数
function getAllItems() {
    const raw = localStorage.getItem("lostFoundList");
    return raw ? JSON.parse(raw) : [];
}
function saveItems(list) {
    localStorage.setItem("lostFoundList", JSON.stringify(list));
}

// 渲染卡片列表
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const cardListEl = document.getElementById("cardList");
const emptyTip = document.getElementById("emptyTip");

function renderList() {
    const all = getAllItems();
    const kw = searchInput.value.trim().toLowerCase();
    const cat = categorySelect.value;

    const filtered = all.filter(item => {
        const matchName = item.name.toLowerCase().includes(kw);
        const matchCat = cat === "" || item.category === cat;
        return matchName && matchCat;
    });

    if(filtered.length === 0){
        cardListEl.innerHTML = "";
        emptyTip.style.display = "block";
        return;
    }
    emptyTip.style.display = "none";
    cardListEl.innerHTML = "";
    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.type==="lost"?"寻物":"招领"}</p>
            <p>地点：${item.place}</p>
            <p>状态：${item.status==="pending"?"待认领":item.status==="found"?"已找到":"已归还"}</p>
        `;
        card.onclick = () => openDetail(item);
        cardListEl.appendChild(card);
    })
}

// 发布弹窗
const publishModal = document.getElementById("publishModal");
const publishBtn = document.getElementById("publishBtn");
const publishForm = document.getElementById("publishForm");
const closeBtns = document.querySelectorAll(".close");

publishBtn.onclick = ()=> publishModal.style.display = "flex";
closeBtns.forEach(btn=>{
    btn.onclick = ()=>{
        publishModal.style.display = "none";
        detailModal.style.display = "none";
    }
})

publishForm.onsubmit = function(e){
    e.preventDefault();
    const fd = new FormData(publishForm);
    const item = {
        id: Date.now(),
        type: fd.get("type"),
        name: fd.get("name").trim(),
        category: fd.get("category"),
        desc: fd.get("desc").trim(),
        place: fd.get("place").trim(),
        contact: fd.get("contact").trim(),
        status:"pending",
        createTime: new Date().toLocaleString()
    }
    if(!item.name || !item.desc || !item.place || !item.contact){
        alert("所有内容不能为空");
        return;
    }
    const list = getAllItems();
    list.push(item);
    saveItems(list);
    publishForm.reset();
    publishModal.style.display="none";
    renderList();
}

// 详情弹窗
const detailModal = document.getElementById("detailModal");
const detailBody = document.getElementById("detailBody");
let currentItem = null;

function openDetail(item){
    currentItem = item;
    detailBody.innerHTML = `
        <h2>${item.name}</h2>
        <p>类型：${item.type==="lost"?"寻物启事":"拾物招领"}</p>
        <p>类别：${item.category}</p>
        <p>描述：${item.desc}</p>
        <p>地点：${item.place}</p>
        <p>发布时间：${item.createTime}</p>
        <p>当前状态：${item.status==="pending"?"待认领":item.status==="found"?"已找到":"已归还"}</p>
        <p>联系方式：<span id="contactText">${item.contact}</span></p>
        <button id="copyBtn">复制联系方式</button>
        <div style="margin-top:12px;">
            <label>修改状态（仅发布者可用）</label>
            <select id="statusSel">
                <option value="pending" ${item.status==="pending"?"selected":""}>待认领</option>
                <option value="found" ${item.status==="found"?"selected":""}>已找到</option>
                <option value="returned" ${item.status==="returned"?"selected":""}>已归还</option>
            </select>
            <button id="saveStatusBtn">保存状态</button>
        </div>
    `;
    detailModal.style.display="flex";
    //复制
    document.getElementById("copyBtn").onclick = async ()=>{
        await navigator.clipboard.writeText(item.contact);
        alert("复制成功");
    }
    //保存状态
    document.getElementById("saveStatusBtn").onclick = ()=>{
        const newStatus = document.getElementById("statusSel").value;
        const list = getAllItems();
        const idx = list.findIndex(x=>x.id === item.id);
        if(idx !== -1){
            list[idx].status = newStatus;
            saveItems(list);
            renderList();
            alert("状态更新成功");
            detailModal.style.display="none";
        }
    }
}

// 搜索联动
searchInput.addEventListener("input",renderList);
categorySelect.addEventListener("change",renderList);

//页面加载渲染
window.onload = renderList;
