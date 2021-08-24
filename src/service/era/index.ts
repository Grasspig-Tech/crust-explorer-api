import {queryEras} from '../../api/era';
/**
 * 通过区块头获取区块，支持多个
 *
 * @export
 */
export async function getEraInfo() {
  return await queryEras()
    .then(({response: res}) => {
      return res;
    })
    .catch(err => {
      throw err;
    });
}
