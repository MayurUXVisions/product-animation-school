<template>
  <div class="interactive-map__wrapper">
    <GmapMap
      ref="map"
      :zoom="zoom"
      :center="{ lat: 10, lng: 10 }"
      :options="mapOptions"
      class="interactive-map__map"
      :class="{ 'interactive-map__map--hidden': activeArea }"
      @tilesloaded="fitMapBounds"
      @zoom_changed="onMapZoomChange"
    >
      <GmapCustomMarker
        v-for="(marker, index) in markers"
        :key="index"
        :offset-y="offsetY"
        :marker="marker.position"
        class="custom-marker"
        :class="{ 'custom-marker--nearby': markerClass(marker) }"
        :alignment="alignment(marker)"
      >
        <div @click="selectMarker(marker)">
          {{ marker.label.text }}
        </div>
      </GmapCustomMarker>
    </GmapMap>
    <template v-for="(marker, index) in markers">
      <popup
        v-if="marker.label.text === activeArea"
        :key="index"
        :country="marker.label.country"
        :popup="marker.popup"
        :active-country="activeArea"
        @close="closePopup"
      />
    </template>
  </div>
</template>

<script>
import GmapCustomMarker from "vue2-gmap-custom-marker";
import mapStyles from "../styles/google-maps-styles.json";
import popup from "./Popup.vue";
export default {
  name: "GoogleMap",
  components: {
    GmapCustomMarker,
    popup,
  },
  props: {
    locations: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    mapOptions: {
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: {},
    },
    showBorders: true,
    zoom: 12,
    height: 0,
    width: 0,
    mapFitted: false,
    activeArea: "",
    activeCountry: "",
  }),
  computed: {
    maxCountryZoom() {
      return this.width > 1024 ? 8 : 5;
    },
    offsetY() {
      if (this.width >= 1840) {
        return -25;
      } else if (this.width < 1840 && this.width > 1590) {
        return -20;
      } else if (this.width <= 1590 && this.width > 767) {
        return -16;
      } else {
        return -10;
      }
    },
    markers() {
      let countryMarkers = [];
      if (this.zoom < this.maxCountryZoom) {
        this.locations.forEach((location) => {
          let country = location.country;

          let marker = {
            position: {
              lat: parseFloat(country.latitude),
              lng: parseFloat(country.longitude),
            },
            offsetY: this.offsetY,
            label: {
              isCountry: true,
              country: country.name,
              text: country.name,
              className: "map__marker",
            },
          };
          countryMarkers.push(marker);
        });
      } else {
        this.locations.forEach((location) => {
          let country = location.country;
          let areas = country.areas;
          areas.forEach((area) => {
            let marker = {
              position: {
                lat: parseFloat(area.latitude),
                lng: parseFloat(area.longitude),
              },
              offsetY: this.offsetY,
              overrideOrientation: area.override_orientation,
              label: {
                isCountry: false,
                country: country.name,
                text: area.area_name,
                className: "map__marker",
              },
              popup: area.area_popup,
            };
            countryMarkers.push(marker);
          });
        });
      }

      return countryMarkers;
    },
  },
  mounted() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    this.mapOptions.styles = mapStyles;
  },
  created() {
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  methods: {
    alignment(marker) {
      if (marker.overrideOrientation !== '') {
        if (marker.overrideOrientation === 'left') {
          return 'topleft';
        } else {
          return 'topright';
        }
      } else {
        return this.isMarkerNeaby(marker) ? 'topleft' : 'topright';
      }
    },
    markerClass(marker) {
      if (marker.overrideOrientation !== '') {
        if (marker.overrideOrientation === 'left') {
          return true;
        } else {
          return false;
        }
      } else {
        return this.isMarkerNeaby(marker);
      }
    },
    isMarkerNeaby(marker) {
      if (!marker.isCountry) {
        const proximityThreshold = 70;
        const otherMarkers = this.markers.filter(
          (m) => m.label.text !== marker.label.text && !m.isCountry
        );

        for (const otherMarker of otherMarkers) {
          const distance = this.getDistance(
            marker.position,
            otherMarker.position
          );

          if (distance < proximityThreshold) {
            return true;
          }
        }
      }

      return false;
    },
    getDistance(pos1, pos2) {
      // Calculate the distance between two positions using the Haversine formula
      const lat1 = pos1.lat;
      const lon1 = pos1.lng;
      const lat2 = pos2.lat;
      const lon2 = pos2.lng;

      const R = 6371; // Radius of the Earth in kilometers
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    getUpdatedStyles() {
      // Modify the styles from the original JSON file based on the zoom level
      const updatedStyles = mapStyles.map((style) => {
        if (style.featureType === "administrative.province") {
          // Show state/province borders if zoom level is greater than or equal to 8
          if (this.zoom > this.maxCountryZoom) {
            return {
              ...style,
              stylers: [{ visibility: "on" }],
            };
          }
          // Hide state/province borders if zoom level is less than 8
          return {
            ...style,
            stylers: [{ visibility: "off" }],
          };
        }
        return style;
      });

      return updatedStyles;
    },
    fitMapBounds() {
      if (this.mapFitted) return; // check if the map has already been fit to the bounds
      const map = this.$refs.map.$mapObject;

      if (this.activeCountry) {
        let areaMarkers = [];
        const bounds = new window.google.maps.LatLngBounds();

        map.setZoom(this.maxCountryZoom);
        map.panTo(this.activeCountry.position);

        for (const marker of this.markers) {
          if (
            this.activeCountry.label.country === marker.label.country &&
            !marker.label.isCountry
          ) {
            bounds.extend(marker.position);
            areaMarkers.push(marker);
          }
        }

        if (areaMarkers.length > 1) {
          map.fitBounds(bounds);
        } else {
          map.setZoom(this.maxCountryZoom);
          map.panTo(areaMarkers[0].position);
        }
      } else {
        const bounds = new window.google.maps.LatLngBounds();

        for (const marker of this.markers) {
          bounds.extend(marker.position);
        }

        map.fitBounds(bounds);
      }

      this.mapFitted = true;
    },
    onMapZoomChange() {
      const map = this.$refs.map.$mapObject;
      const currentZoom = map.getZoom();
      const updatedStyles = this.getUpdatedStyles();
      this.zoom = currentZoom;
      this.mapOptions.styles = updatedStyles;
    },
    closePopup() {
      this.activeArea = "";
    },
    selectMarker(marker) {
      if (this.zoom < this.maxCountryZoom) {
        this.activeCountry = marker;
        this.mapFitted = false;
        this.fitMapBounds();
      } else {
        this.activeArea = marker.label.text;
      }
    },
  },
};
</script>
