<template>
<div>
  <!-- loading animation when first time loading -->
  <div class="loading-wrapper" v-if="isLoadingFirst">
    <LoadingIcon />
  </div>
  <div class="comments" v-else>
    <CommentReplyEditor isMain />
    <div v-if="hotComments.length">
      <h3>最热评论（{{hotComments.length}}）</h3>
      <CommentItem v-for="comment in hotComments" :key="comment.commentId" :comment="comment" />
    </div>
    <div v-if="comments.length">
      <h3>最新评论（{{comments.length}}）</h3>
      <CommentItem v-for="comment in comments" :key="comment.commentId" :comment="comment" />
    </div>
    <!-- loading animation when loading more comments -->
    <div class="loading-wrapper" v-if="isLoadingMore">
      <LoadingIcon />
    </div>
    <!-- loaded all comments Sign board -->
    <div class="loaded-all-comments-sign-bard" v-if="isAllCommentsLoaded">
      <span class="loaded-all-comments-sign-bard__title">
        已加载完所有评论
      </span>
    </div>
  </div>
</div>
</template>
<script>
import { formatDay } from '@/utilitys';
import LikeIcon from '@/components/SVGIcons/LikeIcon';
import RightArrowIcon from '@/components/SVGIcons/RightArrowIcon';
import CommentItem from './CommentItem';
import CommentReplyEditor from './CommentReplyEditor';
import { getSongComment, getMVComments } from '@/service';
import LoadingIcon from '@/components/globals/Loading';

export default {
  name: "CommentList",
  data() {
    return {
      comments: [],
      hotComments: [],
      more: false,
      moreHot: false,
      isLoadingFirst: true,
      isLoadingMore: false,
      total: 0,
    };
  },
  props: {
    // 0: mv comment, 1: song comment
    type: {
      validator: val => [ 0, 1 ].indexOf(Number(val)) !== -1,
      required: true,
    },
    id: {
      type:  String,
      required: true,
    },
  },
  components: { CommentItem, CommentReplyEditor, LoadingIcon },
  created() {
    this.isLoadingFirst = true;
    this.updateData(() => this.isLoadingFirst = false);
  },
  computed: {
    isScrollBottom() {
      return this.$store.state.isScrollBottom
    },
    serviceApi() {
      let service;
      switch(Number(this.type)) {
        case 0:
          service = getMVComments;
          break;
        case 1:
          service = getSongComment;
          break;
        default:
          return;
      }
      return service;      
    },
    commentsOffset () {
      return this.comments.length;
    },
    isAllCommentsLoaded() {
      return this.comments.length >= this.total;
    },
  },
  watch: {
    isScrollBottom(val) {
      if(val === true) {
        this.loadingMoreComments();
      }
    }
  },
  methods: {
    updateData(cb) {
      if (!this.serviceApi){
        cb && cb();
        return;
      }
      
      this.serviceApi(this.id, this.commentsOffset).then(
        ({ data: {
          hotComments,
          comments,
          more,
          moreHot,
          total,
        } }) => {
          if (hotComments && hotComments.length > 0) {
            this.hotComments = this.hotComments.concat(hotComments);
          }
          if (comments && comments.length > 0) {
            this.comments = this.comments.concat(comments);
          }
          this.more = more;
          this.moreHot = moreHot;
          this.total = total;
          cb && cb();
        },
        error => {
          cb && cb();
          alert('get comments error ' + error)
        }
      );
    },
    loadingMoreComments() {
      if (this.isAllCommentsLoaded) {
        return
      }
      if (this.isLoadingMore) {
        return
      }
      if (!this.serviceApi) return;
      this.isLoadingMore = true;
      this.updateData(() => this.isLoadingMore = false);
    },
  }
}
</script>
<style lang="sass" scoped>
.loading-wrapper
  height: 2em;
  width: 2em;
  margin: 3em auto 0;
.loaded-all-comments-sign-bard
  margin: 3em auto;
  text-align: center;
  .loaded-all-comments-sign-bard__title
    display: inline-block;
    border: 1px solid #777;
    color: #777;
    padding: 0.2em 1em;
    border-radius: 9999px;
    font-size: 12px;
</style>

