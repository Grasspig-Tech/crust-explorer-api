/* 概览页 自身有效质押总量 */

; (() => {
    var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[1].querySelectorAll("tr > td:nth-of-type(4)"));

    // var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(8)"));
    var total = 0;
    all.forEach(it => {
        let num = (it.querySelector(".ui--FormatBalance-value").innerText);
        num = num.replace(/\s*CRU\s*/, "");
        num = num.replace(/,/g, "");

        total += Number(num);
        console.log(num)
        // console.log("==========")
        // console.log(num)
        // console.log(total)
        // console.log("==========")
    })
    console.log("总数：", total)
    console.log("总人数：", all.length)
})();

/* 概览页 总质押量 */

; (() => {
    var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[1].querySelectorAll("tr > td:nth-of-type(6)"));
    var total = 0;
    all.forEach(it => {
        let num = (it.querySelector(".ui--FormatBalance-value").innerText);
        num = num.replace(/\s*CRU\s*/, "");
        num = num.replace(/,/g, "");

        total += Number(num);
        // console.log("==========")
        // console.log(num)
        // console.log(total)
        // console.log("==========")
    })
    console.log("总数：", total)
    console.log("总人数：", all.length)
})();

/* 等待中的自身有效质押总量 */
; (() => {
    var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(4)"));
    // var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(8)"));
    var total = 0;
    all.forEach(it => {
        let num = (it.querySelector(".ui--FormatBalance-value").innerText);
        num = num.replace(/\s*CRU\s*/, "");
        num = num.replace(/,/g, "");

        total += Number(num);
        console.log(num)
        // console.log("==========")
        // console.log(num)
        // console.log(total)
        // console.log("==========")
    })
    console.log("总数：", total)
    console.log("总人数：", all.length)
})();



/* 获取目标页的数据 */
function getget() {
    /* 目标  总有效质押量 */

    function get1() {
        var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(8)"));


        // var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(8)"));
        var total = 0;
        all.forEach(it => {
            let num = (it.querySelector(".ui--FormatBalance-value").innerText);
            num = num.replace(/\s*CRU\s*/, "");
            num = num.replace(/,/g, "");

            total += Number(num);
            console.log(num)
            // console.log("==========")
            // console.log(num)
            // console.log(total)
            // console.log("==========")
        })
        console.log("目标  总有效质押量：", total)
        console.log("总人数：", all.length)
        return total;
    };
    /* 目标  自身有效质押量 */
    function get2() {
        var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(9)"));


        // var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(8)"));
        var total = 0;
        all.forEach(it => {
            let num = (it.querySelector(".ui--FormatBalance-value").innerText);
            num = num.replace(/\s*CRU\s*/, "");
            num = num.replace(/,/g, "");

            total += Number(num);
            console.log(num)
            // console.log("==========")
            // console.log(num)
            // console.log(total)
            // console.log("==========")
        })
        console.log("")
        console.log("目标  自身有效质押量：", total)
        console.log("总人数：", all.length)
        return total;
    };
    /* 目标  质押总量 */
    function get3() {
        var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(11)"));


        // var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(8)"));
        var total = 0;
        all.forEach(it => {
            let num = (it.querySelector(".ui--FormatBalance-value").innerText);
            num = num.replace(/\s*CRU\s*/, "");
            num = num.replace(/,/g, "");

            total += Number(num);
            console.log(num)
            // console.log("==========")
            // console.log(num)
            // console.log(total)
            // console.log("==========")
        })
        console.log("目标  质押总量：", total)
        console.log("总人数：", all.length)
        return total;
    };
    /* 目标  质押上限 */
    function get4() {
        var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(12)"));


        // var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr > td:nth-of-type(8)"));
        var total = 0;
        all.forEach(it => {
            let num = (it.querySelector(".ui--FormatBalance-value").innerText);
            num = num.replace(/\s*CRU\s*/, "");
            num = num.replace(/,/g, "");

            total += Number(num);
            console.log(num)
            // console.log("==========")
            // console.log(num)
            // console.log(total)
            // console.log("==========")
        })
        console.log("目标  质押总量：", total)
        console.log("总人数：", all.length)
        return total;
    };
    var all = Array.from(document.querySelectorAll(".Body-sc-1ok469p-0.ejfgQO")[0].querySelectorAll("tr"));
    return {
        '总有效质押量': get1(),
        '总有效质押量 / 平均': get1() / all.length,
        '自身有效质押量': get2(),
        '自身有效质押量 / 平均': get2() / all.length,
        '质押总量': get3(),
        '质押总量 / 平均': get3() / all.length,
        '质押上限': get4(),
        '质押上限 / 平均': get4() / all.length
    }
}

var resulttt = getget();
console.log(resulttt)
