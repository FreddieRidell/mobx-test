import { observable, action, computed } from "mobx";

import { todosStore } from "./todosStore";

const getUserData = id => {
  fetch(`https://www.example.com/get-user/${id}`);

  return new Promise(done => {
    setTimeout(done, 500 + Math.random() * 1000, {
      name: id === "aaa" ? "Freddie" : "Marcelo"
    });
  });
};

class User {
  @observable id;
  @observable name;
  @observable loading = true;

  constructor({ id, data }) {
    if (id) {
      this.id = id;
      this.loadDataFromServer();
    } else {
      this.hydrate(data);
    }
  }

  @computed
  get todos() {
    return todosStore.getTodosByAuthorId(this.id);
  }

  @action
  loadDataFromServer = () => {
    getUserData(this.id).then(({ name }) => {
      this.name = name;

      this.loading = false;
    });
  };

  @action
  hydrate = ({ name, loading }) => {
    this.name = name;
    this.loading = loading;
  };
}

class Users {
  @observable users = new Map();

  @action
  getUserById = id => {
    if (!id) {
      return null;
    }

    return this.users.get(id) || this.users.set(id, new User({ id })).get(id);
  };

  @action
  hydrate = users => {
    users.forEach(user => {
      this.users.set(user.id, new User({ data: user }));
    });
  };
}

const usersStore = new Users();

export { User, Users, usersStore };
