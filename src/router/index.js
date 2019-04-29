import VueRouter from "vue-router"
import FindMusic from "../components/FindMusic/Index"
import PlayListDetail from "../components/FindMusic/PlayListDetail"
import SongDetail from "../components/FindMusic/SongDetail"
import ArtistDetail from "../components/FindMusic/ArtistDetail"
import AlbumDetail from "../components/FindMusic/AlbumDetail"
import UserDetail from "@/components/user/UserDetail"
import Playlist from "@/components/Playlist/Index"
import TopListIndex from "@/components/TopList/Index"
import MV from "@/components/MV/Index"
import MVPlayer from "@/components/MV/MVPlayer"
import MVRankList from "@/components/MV/RankList"
import SearchIndex from "@/components/Search/Index";
import LogIn from '@/components/login/index';
import UserRecord from '@/components/userRecord';
import LikedSongs from '@/components/likedSongs';
import UserFollows from '@/components/user/UserFollows';
import UserFolloweds from '@/components/user/UserFolloweds';
import UserEdit from '@/components/user/UserEdit';

export default new VueRouter({
  mode: "history",
  // base: __dirname,
  routes: [
    { path: "/", component: FindMusic },
    { path: "/playlist", component: Playlist },
    { path: "/playlist/:id", component: PlayListDetail },
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
    { path: "/userrecord", component: UserRecord },
    { path: "/likedsongs", component: LikedSongs },
    { path: "/follows/:id", component: UserFollows },
    { path: "/followeds/:id", component: UserFolloweds },
    { path: "/useredit", component: UserEdit },
  ],
})