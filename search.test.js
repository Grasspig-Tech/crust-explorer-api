const scriptSearch = require('search-keywords'); // eslint-disable-line node/no-unpublished-require
const path = require('path');
const config = {
  //配置
  rootDirPath: path.resolve(__dirname, './src'),
  keywords: ['127'],
  validExts: ['.ts', '.js'],
};

//不传配置则使用默认配置
scriptSearch(config);
