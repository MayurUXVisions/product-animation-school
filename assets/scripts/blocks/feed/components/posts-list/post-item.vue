<template>
  <div class="feed-results__item">
    <a :href="post.link" class="item-link" />
    <div class="post-item-wrapper flex-height" :class="[post.colour]">
      <div class="post-content">
        <div class="item-meta">
          <span>{{ post.post_type_pretty }}</span>
          <span>{{ post.date }}</span>
        </div>
        <div class="item-image">
          <img :src="post.image" alt="">
        </div>
        <div class="item-details flex-item">
          <div class="item-title" v-html="post.title" />
          <div class="item-excerpt" v-html="post.excerpt" />
        </div>
      </div>
      <div class="item-link-container">
        <a
          v-if="post.post_type === 'case-study'"
          :href="post.link"
          class="btn btn--dark-pink"
        >Read More</a>
        <a
          v-else-if="post.post_type === 'report'"
          :href="post.link"
          class="btn btn--dark-yellow"
        >Read More</a>
        <a
          v-else-if="post.post_type === 'news'"
          :href="post.link"
          class="btn btn--dark-blue"
        >Read More</a>
        <a
          v-else-if="post.post_type === 'post'"
          :href="post.link"
          class="btn btn--dark-coral"
        >Read More</a>
        <a
          v-else-if="post.post_type === 'event'"
          :href="post.link"
          class="btn btn--dark-yellow"
        >Read More</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostListItem",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>
