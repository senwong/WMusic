import VueRouter from "vue-router"
import FindMusic from "../components/FindMusic/Index"
import PlayListDetail from "../components/FindMusic/PlayListDetail"
import SongDetail from "../components/FindMusic/SongDetail"
import ArtistDetail from "../components/FindMusic/ArtistDetail"
import AlbumDetail from "../components/FindMusic/AlbumDetail"
import UserDetail from "@/components/FindMusic/UserDetail"
import Playlist from "@/components/PlayList/Index"
import TopListIndex from "@/components/TopList/Index"
import MVIndex from "@/components/MV/Index"
import MVPlayer from "@/components/MV/MVPlayer"
import MVRankList from "@/components/MV/RankList"
import SearchIndex from "@/components/Search/Index"
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
    { path: "/mv", component: MVIndex },
    { path: "/mvplay/:id", component: MVPlayer },
    { path: "/mv/rank", component: MVRankList },
    { path: "/search", component: SearchIndex },
  ],
})