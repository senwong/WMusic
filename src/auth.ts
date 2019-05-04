import { getLoginStatus } from '@/service';
import { User } from '@/types';

const auth = {
  loggedIn() {
    return new Promise((resolve, reject) => {
      getLoginStatus().then(
        (res: any): void => {
          if (res.data.code == 200) {
            const profile: User = res.data.profile;
            resolve(profile);
          } else {
            reject();
          }
        },
        error => reject(error)
      );
    });
  }
};
export default auth;
