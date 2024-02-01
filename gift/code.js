
var keys = 0, zq = 0, wzq = 0;//钥匙 中签 未中签
var pagesid = 1, totalPagesX = 1;//当前页 总页数
var cards = {
    "祥龙卡": 0,
    "传说卡": 0,
    "王者卡": 0,
    "英雄卡": 0,
    "道具卡": 0,
    "新春福": 0
};
var txn = ['NULL', "传说卡", "王者卡", "英雄卡", "道具卡"];
var toxlk = [0, 30, 300, 3, 30, 2, 20, 1, 10];//兑换祥龙卡
var itemsX = [];
const items_b = [0];//看是否发送或分解 0无 1发送 2分解
var pagesid = 1, totalPagesX = 1;//当前页 总页数
var allxlk = 0, XLK_cnt = 1, zq_cnt = 1;//总祥龙卡 中签次数 未中签次数
var xcflist = [0, 1, 3, 6, 10, 15, 20];//累计获得新春福星
var xcfpz = ['NULL', '5000', '10000', '15000', '30000', '60000', '120000'];//新春福星奖励

const sitem = [
    ['传说灵眸 无序列号版', 50],
    ['非觉醒版 王者芳薇', 15],
    ['M14EBR-玄武', 15],
    ['王者潘多拉', 10],
    ['觉醒版 炼狱-悦蓝', 10],
    ['裁决-流光秘银皮肤', 6],
    ['AN94-超新星', 4],
    ['M4A1-龙血', 3],
    ['蓝色艾比玩偶 （不可交易）', 2],
    ['猫耳头盔', 1],
    ['属性抽取券x1', 1]
];//分解钥匙
function updateAllCards() {

    updateDisplay_class("xlk", cards["祥龙卡"]);
    updateDisplay_class("csk", cards["传说卡"]);
    updateDisplay_class("wzk", cards["王者卡"]);
    updateDisplay_class("yxk", cards["英雄卡"]);
    updateDisplay_class("djk", cards["道具卡"]);
    updateDisplay_class("xck", cards["新春福"]);
}

function drawLottery(x, prizesX, PZX) {//x-抽奖次数 prizes-奖品列表 PZX-暂存箱列表

    const prizes = prizesX;
    // 定义一个空数组，用于存储抽中的物品
    const selectedItems = [];

    // 循环抽奖次数
    for (let i = 0; i < x; i++) {
        // 计算所有奖品的总概率
        const totalProbability = prizes.reduce((total, prize) => total + prize.probability, 0);

        // 生成一个随机概率值
        const randomProbability = Math.random() * totalProbability;

        // 初始化当前概率和选中的物品
        let currentProbability = 0;
        let selectedItem = null;

        // 遍历奖品列表，根据随机概率值确定选中的物品
        for (const prize of prizes) {
            currentProbability += prize.probability;
            if (randomProbability <= currentProbability) {
                selectedItem = prize.name;
                //注意修改

                //增加卡片
                card_name = selectedItem.substring(0, 3);

                if (cards[card_name] != undefined) { cards[card_name] += 1; if (card_name == "祥龙卡") allxlk += 1; }

                break;
            }
        }
        //进入暂存箱
        for (var j = 0; j < PZX.length; j++) {
            if (selectedItem == PZX[j]) {
                //将上次抽中的物品概率下调30%
                for (var k = 0; k < prizes.length; k++) {
                    if (prizes[k].name == selectedItem) {
                        //特判 避免重复抽到高价值道具
                        if (prizes[k].probability <= 0.5) prizes[k].probability *= 0.3;
                        else prizes[k].probability *= 0.8;
                    }
                }
                addzc(selectedItem);
                break;
            }
        }

        // 将选中的物品添加到数组中

        selectedItems.push(selectedItem);
    }


    // 调用显示函数，展示抽中的物品

    if (x == 1) {
        newshowPopup(selectedItems, 'jlname');//注意修改
        showpages("popdc");//注意修改
    }
    else {
        newshowPopup(selectedItems, 'choulist');//注意修改
        showpages("popJl");//注意修改
    }

    //showPopup(selectedItems);
}
function showPopup(items) {
    // 显示遮罩和弹窗
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';

    // 在弹窗中显示抽中的物品
    const itemList = document.getElementById('prizeList');
    itemList.innerHTML = ''; // 清空之前的内容

    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        itemList.appendChild(listItem);
    });
}
function hidePopup() {
    // 隐藏遮罩和弹窗
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}
function hidePopup1() {
    // 隐藏遮罩和弹窗
    document.getElementById('overlay1').style.display = 'none';
    document.getElementById('popup1').style.display = 'none';
}

function showpages(st) {//展示弹窗
    // 获取弹窗元素
    var popup = document.getElementById(st);

    // 设置弹窗可见性
    if (popup) {
        popup.style.visibility = "visible";
    }
}
function hiddenpages(st) {//隐藏弹窗
    // 获取弹窗元素
    var popup = document.getElementById(st);

    // 设置弹窗可见性
    if (popup)
        popup.style.visibility = "hidden";
}


function newshowPopup(items, id) {//id是看展示页面是什么就写什么  领奖页面
    var choulistDiv = document.getElementById(id);

    // Clear previous content in choulistDiv
    choulistDiv.innerHTML = '';

    // Loop through items and append each one in <p> tags to choulistDiv
    items.forEach(function (item) {
        var L = document.createElement('li');
        var pElement = document.createElement('p');
        pElement.textContent = item;
        L.appendChild(pElement);
        choulistDiv.appendChild(L);
    });
}


function showGiftContent(items, currentPage) {
    pagesid = currentPage;
    updateDisplay('now', pagesid);
    var container = document.getElementById('showMyGiftContent2');
    var tableContainer = document.getElementById('milo-lotteryRecordContainer2');

    // 清空现有内容
    tableContainer.innerHTML = '';

    var itemsPerPage = 6;
    var totalPages = Math.ceil(items.length / itemsPerPage);

    totalPagesX = Math.max(1, totalPages);
    updateDisplay('total', totalPagesX);


    var start = (currentPage - 1) * itemsPerPage;
    var end = Math.min(start + itemsPerPage, items.length);

    for (var i = start; i < end; i++) {
        // 创建表格行和单元格
        var row = document.createElement('tr');
        var itemNameCell = document.createElement('td');
        itemNameCell.style.width = '40%';  // 设置宽度
        row.appendChild(itemNameCell);
        itemNameCell.textContent = items[i];
        var receiveItemCell = document.createElement('td');
        receiveItemCell.style.width = '30%';  // 设置宽度
        row.appendChild(receiveItemCell);
        var decomposeItemCell = document.createElement('td');
        decomposeItemCell.style.width = '30%';  // 设置宽度
        row.appendChild(decomposeItemCell);

        if (items_b[i] == 0) {
            receiveItemCell.innerHTML = '<a href="javascript:fs(' + (i) + ');" style="color: white;">[发送]</a>';
            decomposeItemCell.innerHTML = '<a href="javascript:fj(' + (i) + ');" style="color: white;">[分解]</a>';
        } else if (items_b[i] == 1) {
            receiveItemCell.innerHTML = '<a href="javascript:void();" style="color: white;">[已发送]</a>';
            decomposeItemCell.innerHTML = '<a href="javascript:void();" style="color: white;">X</a>';
        } else if (items_b[i] == 2) {
            receiveItemCell.innerHTML = '<a href="javascript:void();" style="color: white;">X</a>';
            decomposeItemCell.innerHTML = '<a href="javascript:void();" style="color: white;">[已分解]</a>';
        }

        // 将行添加到tableContainer
        tableContainer.appendChild(row);

    }
}

function fs(id) {
    alert('【' + itemsX[id] + '】' + '已发送到仓库');
    items_b[id] = 1;
    showGiftContent(itemsX, pagesid);
}

function fj(id) {
    const sitemMap = new Map(sitem);

    alert('【' + itemsX[id] + '】' + '分解成功，获得钥匙*' + sitemMap.get(itemsX[id]));
    keys += sitemMap.get(itemsX[id]);
    updateDisplay("keys", keys);
    items_b[id] = 2;
    showGiftContent(itemsX, pagesid);
}

function updateDisplay(dis, res) {//更新指定dis文本为res
    var Display = document.getElementById(dis);
    if (Display) {
        Display.textContent = res;
    }
}

function updateDisplay_class(dis, res) {
    var elements = document.getElementsByClassName(dis);
    for (var i = 0; i < elements.length; i++) {
        elements[i].textContent = res;
    }
}

function getStr(dis) {//获取指定dis文本
    var Display = document.getElementById(dis);
    if (Display) {
        return Display.textContent;
    }
    return "NULL";
}

function addzc(its) {//暂存箱记录函数
    itemsX.unshift(its);
    items_b.unshift(0);
}

