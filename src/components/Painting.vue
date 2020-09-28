<template>
  <section @click="$emit('painting-clicked', true)">
    <SpinnerItem v-show="!loaded" key="spinner" class="spinner --mini" />
    <div style="min-width: 47px;">
      <img :src="url" @load="loaded = true" key="image" />
    </div>
    <span class="name" v-if="name.length > 0">{{ name }}</span>
    <span class="name" v-else>{{ $t('anonymous') }}</span>
    <div class="rating">
      <StarRating
        :rating="avgRating"
        :star-size="15"
        :padding="3"
        :glow="0"
        :rounded-corners="true"
        :border-width="0"
        :increment="0.5"
        :fixed-points="2"
        :show-rating="false"
        :round-start-rating="false"
        :read-only="true"
      />
      <span>{{ $t('painting.created') }} {{ calculateMoment(timestamp) }}</span>
    </div>
  </section>
</template>
<script>
import moment from 'moment';
import StarRating from 'vue-star-rating';
import SpinnerItem from './SpinnerItem';

export default {
  name: 'painting',
  components: {
    SpinnerItem,
    StarRating,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avgRating: {
      type: Number,
      default: 0
    },
    timestamp: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loaded: false,
    }
  },
  methods: {
    calculateMoment(timestamp) {
      return moment(new Date(timestamp.seconds * 1000)).fromNow();
    },
  },
}
</script>
<style lang="scss" scoped>
.vue-star-rating {
  margin-bottom: 0.2rem;
}
</style>