import { Model } from '@vuex-orm/core';

export default class User extends Model {
  // 在 Vuex 中的名字
  static entity = 'user';

  // 文件类型
  static fields() {
    return {
      id: this.attr(0),
      mobile: this.attr(''),
    }
  }
}