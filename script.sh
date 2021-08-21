#!/bin/bash
# des：manage node app shell
# author：huazhuangnan
# time：2021-4-9
set -u
# centos and ubunt install pkg
# $1 pkg
install_pkg(){
  local pkg = $1
  local pkgCmd = ''
  which apt-get > /dev/null
  if [ $? -eq 0 ]; then
   pkgCmd = 'apt-get'
  fi
  which yum > /dev/null
  if [ $? -eq 0 ]; then
   pkgCmd = 'yum'
  fi
  `$pkgCmd install -y $pkg`
  wait
}
# app status
status(){
  yarn status
}
# app stop
stop(){
  yarn stop
}
# app start
start(){
  yarn start
}
# app install
# if have param, set npm registry is taobao
install(){
  which curl > /dev/null
  if [ $? -eq 1 ]; then
    apt-get install
  fi
  # if not find node
  which node > /dev/null
  if [ $? -eq 1 ]; then
    echo 'install nvm'
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    wait
    export NVsource ~/.bashrcM_DIR="${XDG_CONFIG_HOME/:-$HOME/.}nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  
    nvm install --lts && nvm use --lts
  fi
  # if not find nrm
  which nrm > /dev/null
  if [ $? -ge 1 ]; then
    echo 'install nrm'
    npm i -g nrm
  fi
  # set registry
  if [ $# -eq 1 ];then
      nrm use taobao
  fi
  local registry=$(nrm ls |grep '*' |awk '{print $4}')
  # if not find yarn
  which yarn > /dev/null
  if [ $? -eq 1 ]; then
    echo 'install yarn'
    npm i -g yarn
  fi
  yarn config set registry $registry
  echo 'install dependencies'
  yarn install
}

# 调用
if [ $# -eq 1 ]; then
  $1
else
  $1 ${@:2}
fi
