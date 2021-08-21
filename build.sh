#!/usr/bin/env bash
# # # # # # # # # # #
#   客户端打包脚本
#   Copy Right © 草猪科技
# # # # # # # # # # #
set -u

PARAMETER_COUNT=1  # 参数数量
CURRENT_DIR=$(pwd) # 当前目录
EXPORT_DIR="${CURRENT_DIR}/compile"     # 编译目录
BUILD_DIR="${CURRENT_DIR}/build"    # 输出目录
CLIENT_NAEM=$(cat ./package.json |grep 'name' |sed -e 's/[":,]//g' |awk '{print $2}')   # 包名

VIEW_LOGS=false                  # 是否显示详细日志

# 使用说明
usage() {
cat 1>&2 <<EOF
usage: build.sh <options> <value> ...
  默认构建所有插件
  <options> :
    -o  [--out]  <dir>         输出目录, 默认值 $BUILD_DIR
    -v  [--view]               显示详细打包日志
    -h  [--help]               帮助信息
EOF
}
# 构建
build(){
  local index=0                                                # 下标
  local lastCmd=''                                             # 上个指令
  # 设置参数
  for key in $@
  do
    case $key in
      '-h'|'--help') # 显示帮助信息
        usage
        exit 0
      ;;
      '-v'|'--view') # 显示帮助信息
        VIEW_LOGS=true
      ;;
      '-o'|'--out') # 输出目录
        lastCmd='-o'
      ;;
      *)
        # 赋值
        case $lastCmd in
        '-o')
          BUILD_DIR=$key
          # 清空上个 lastcmd
          lastCmd=''
        ;;
        esac
        
      ;;
    esac
  done
  # 是否构建
  if [ ! -d $EXPORT_DIR ];then
    yarn compile # 编译
  fi
  # 构建目录是否存在
  if [ ! -d $BUILD_DIR ];then
    mkdir $BUILD_DIR
  fi
  # 开始构建
  local version=$(cat ./package.json |grep 'version' |sed -e 's/[":,]//g' |awk '{print $2}') # 版本
  local tarName="${BUILD_DIR}/${CLIENT_NAEM}@${version}.tar.gz" # 包名
  # 处理目录文件
  \cp -f ./package.json $EXPORT_DIR   # 依赖
  \cp -f ./process.json $EXPORT_DIR   # pm2 配置
  sed -i 's#./src/main.ts#./main.js#g' "${EXPORT_DIR}/package.json"
  # 输出信息
  \mv -f $EXPORT_DIR $BUILD_DIR/$CLIENT_NAEM
  echo "${CLIENT_NAEM} start build ..."
  cd $BUILD_DIR
  if [ $VIEW_LOGS = true ];then
    tar -zcPvf $tarName $CLIENT_NAEM
  else
    tar -zcPf $tarName $CLIENT_NAEM
  fi
  rm -rf $BUILD_DIR/$CLIENT_NAEM
  # 输出信息
  if [ $? -eq 0 ];then
    echo "${CLIENT_NAEM} is build success, tar is on ${tarName}"
  else
    echo "${CLIENT_NAEM} is build error"
  fi
}
build $@
