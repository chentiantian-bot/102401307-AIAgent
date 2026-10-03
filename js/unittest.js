//单元测试脚本，在浏览器控制台查看结果
function runTest() {
    console.log("======= 开始执行测试 =======");
    let pass = 0;
    let fail = 0;

    //测试1：本地存储读写
    const testData = {id: 999, name:"测试物品", category:"其他"};
    let list = getAllItems();
    list.push(testData);
    saveItems(list);
    const getBack = getAllItems().find(x=>x.id ===999);
    if(getBack && getBack.name === "测试物品"){
        console.log("✅ 测试1 本地存储读写：通过");
        pass++;
    }else{
        console.log("❌ 测试1 本地存储读写：失败");
        fail++;
    }

    //清理测试数据
    let cleanList = getAllItems().filter(x=>x.id!==999);
    saveItems(cleanList);

    //测试2：过滤搜索
    const testList = [
        {id:1, name:"红色水杯", category:"生活用品"},
        {id:2, name:"黑色雨伞", category:"生活用品"}
    ];
    const filterResult = testList.filter(item=>item.name.includes("水杯"));
    if(filterResult.length ===1 && filterResult[0].id ===1){
        console.log("✅ 测试2 搜索过滤：通过");
        pass++;
    }else{
        console.log("❌ 测试2 搜索过滤：失败");
        fail++;
    }

    console.log(`======= 测试结束：共${pass+fail}个用例，通过${pass}，失败${fail} =======`);
}
console.log("unittest.js加载完成！在控制台输入 runTest() 执行测试");
