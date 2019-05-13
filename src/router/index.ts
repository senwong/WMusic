import VueRouter from "vue-router";
import FindMusic from "@/components/FindMusic/Index.vue";
import PlaylistDetail from "@/components/Playlist/PlaylistDetail.vue";
import SongDetail from "@/components/FindMusic/SongDetail.vue";
import ArtistDetail from "@/components/FindMusic/ArtistDetail.vue";
import AlbumDetail from "@/components/FindMusic/AlbumDetail.vue";
import UserDetail from "@/components/user/UserDetail.vue";
import Playlist from "@/components/Playlist/Index.vue";
import TopListIndex from "@/components/TopList/Index.vue";
import MV from "@/components/MV/Index.vue";
import MVPlayer from "@/components/MV/MVPlayer.vue";
import MVRankList from "@/components/MV/RankList.vue";
import SearchIndex from "@/components/Search/Index.vue";
import LogIn from "@/components/login/index.vue";
import UserRecord from "@/components/userRecord/index.vue";
import LikedSongs from "@/components/likedSongs/index.vue";
import UserFollows from "@/components/user/UserFollows.vue";
import UserFolloweds from "@/components/user/UserFolloweds.vue";
import UserEdit from "@/components/user/UserEdit.vue";
import Sublist from "@/components/sublist/index.vue";
import auth from "@/auth";
import NotFound from "@/components/NotFound.vue";

const router = new VueRouter({
  mode: "history",
  // base: __dirname,
  routes: [
    { path: "/", component: FindMusic },
    { path: "/playlist", component: Playlist },
    { path: "/playlist/:id", component: PlaylistDetail },
    { path: "/song/:id", component: SongDetail },
    { path: "/artist/:id", component: ArtistDetail },
    { path: "/album/:id", component: AlbumDetail },
    { path: "/user/:id", component: UserDetail },
    { path: "/toplist", component: TopListIndex },
    { path: "/mv", component: MV },
    { path: "/mvplay/:id", component: MVPlayer },
    { path: "/mv/rank", component: MVRankList },
    { path: "/search", component: SearchIndex },
    { path: "/login", component: LogIn },
    { path: "/record/:id", component: UserRecord },
    { path: "/likedsongs/:id", component: LikedSongs },
    { path: "/follows/:id", component: UserFollows },
    { path: "/followeds/:id", component: UserFolloweds },
    {
      path: "/useredit/:id",
      component: UserEdit,
      meta: { requiresAuth: true }
    },
    {
      path: "/sublist",
      component: Sublist,
      meta: { requiresAuth: true }
    }
    // { path: "*", component: NotFound }
  ]
});

router.beforeEach((to, _, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    auth.loggedIn().then(() => next(), () => next({ path: "/login" }));
  } else {
    next();
  }
});
export default router;
