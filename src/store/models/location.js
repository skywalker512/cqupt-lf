import { Model } from '@vuex-orm/core';

export default class Location extends Model {
  // 在 Vuex 中的名字
  static entity = 'location';

  // 文件类型
  static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
    }
  }
}