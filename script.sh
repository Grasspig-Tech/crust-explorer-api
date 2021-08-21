#!/usr/bin/env bash
# 说 明：定时器脚本，方便启动程序
# 作 者：花妆男
# 时 间：2021年4月9日
set -u
CRTDIR=$(pwd) # 当前目录
NAME='crust-explorer-api' # 进程
# 初始化
init(){
  # 目录
  if [ $(echo $CRTDIR |grep $NAME |wc -l) -eq 0 ];then
	  cd "/${HOME}/${NAME}"
  fi
}
# 停止
status(){
  init
  yarn status
}
# 停止
stop(){
  init
  yarn stop
}
# 启动
start(){
  init
  yarn start
}
# 安装 ubuntu
install(){
  init
  # 更新
  apt-get update -y && apt-get upgrade -y && apt-get autoclean -y
  # 安装依赖
  which node > /dev/null
  if [ $? -eq 1 ]; then
    echo 'install nvm'
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    source ~/.bashrc
    nvm install --lts && nvm use --lts
    
  fi
  which nrm > /dev/null
  if [ $? -eq 1 ]; then
    npm i -g nrm
    nrm use taobao
  fi
  local registry=$(nrm ls |grep '*' |awk '{print $4}')
  which yarn > /dev/null
  if [ $? -eq 1 ]; then
    npm i -g yarn
  fi
  yarn config set registry $registry
  yarn install
}

# 调用
if [ $# -eq 1 ]; then
  $1
else
  $1 ${@:2}
fi
