import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';

import User from './models/user';
import Card from './models/card'
import Location from './models/location'
Vue.use(Vuex)

const database = new VuexORM.Database()
database.register(User, {})
database.register(Card, {})
database.register(Location, {})
// Create Vuex Store and register the Vuex ORM plugin.
export default new Vuex.Store({
  plugins: [VuexORM.install(database)]
})