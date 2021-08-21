import {ResponseInfo} from '../interface';
/*
    status: 1  //0表示操作失败，1表示操作成功
    msg: 消息,
    data: 数据
*/
export const getErr = ({msg = '操作失败'}: ResponseInfo): ResponseInfo => {
  return {
    code: '500',
    msg,
  };
};
export const getResult = ({
  msg = '操作成功',
  data = null,
}: ResponseInfo): ResponseInfo => {
  return {
    code: '200',
    msg,
    data: data || null,
  };
};
