import log4js from "log4js"
import path from "path"
const admin = "vanxizzz";
log4js.configure({
    /* 配置出口 */
    appenders: {
        mysql: {
            type: "dateFile",
            filename: path.resolve(__dirname, "../log/grant.log"),
            keepFileExt: true,//是否保存后缀格式
            maxLogSize: 1024 * 1024, //配置文件的最大字节数
            layout: {
                type: "pattern",
                pattern: `%d{yyyy-MM-dd hh:mm:ss}\n%m\n===================================\n
                `,
            },
        },
        default: {
            type: "stdout",
        },
    },
    /* 配置分类，一个分类可以对应n个出口，也可以没有出口 */
    categories: {
        /* 自定义的分类 */
        sql: {

            level: "all",
            appenders: ["mysql"],//对应出口名
        },
        /* 必须有个默认的分类 */
        default: {
            appenders: ["default"],
            level: "all",
        }
    }
});
const logger = log4js.getLogger("sql")//填分类名，比如sql，不填默认default

export default logger;