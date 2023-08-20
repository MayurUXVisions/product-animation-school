<template>
  <div class="interactive-map__popup map-popup">
    <div class="map-popup__wrapper">
      <div class="map-popup__top">
        <h4 v-if="country" class="map-popup__title h4">
          {{ country }}:
        </h4>
        <h4 v-if="popup.title" class="map-popup__title h4">
          {{ popup.title }}
        </h4>
        <button class="map-popup__close" @click="closePopup" />
      </div>
      <div class="map-popup__main">
        <div class="map-popup__list">
          <div
            v-for="(list, index) in popup.list"
            :key="index"
            class="map-popup__list-item popup-list-item"
          >
            <div class="popup-list-item__wrapper">
              <figure v-if="list.icon" class="popup-list-item__icon">
                <img :src="list.icon.sizes.popup_icon" :alt="list.icon.alt">
              </figure>
              <div class="popup-list-item__text">
                <h3 class="h1 popup-list-item__number">
                  {{ list.number }}
                </h3>
                <h4
                  class="h4 popup-list-item__title popup-list-item__title--desktop"
                >
                  {{ list.text }}
                </h4>
              </div>
            </div>
            <h4
              class="h4 popup-list-item__title popup-list-item__title--mobile"
            >
              {{ list.text }}
            </h4>
          </div>
        </div>
        <figure class="map-popup__image">
          <img :src="popup.image.sizes.popup_image" :alt="popup.image.alt">
          <caption v-if="popup.image_caption" class="map-popup__caption">
            {{
              popup.image_caption
            }}
          </caption>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popup",
  props: {
    popup: {
      type: Object,
      default: () => {},
    },
    activeCountry: {
      type: String,
      default: () => "",
    },
    country: {
      type: String,
      default: () => "",
    },
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
  },
};
</script>
