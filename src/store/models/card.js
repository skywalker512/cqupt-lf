import { Model } from '@vuex-orm/core';

export default class Card extends Model {
  // 在 Vuex 中的名字
  static entity = 'card';

  // 文件类型
  static fields() {
    return {
			id: this.attr(''),
      stuNum: this.attr(''),
      name: this.attr(''),
			stuId: this.attr(''),
			name: this.attr(''),
			department: this.attr({
				id: '',
				name: '',
			}),
			status: this.attr({
				lostAt: '',
				foundAt: '',
				status: '',
				location: this.attr({
					id: '',
					name: '',
				})
			})
    }
  }
}