<template>
  <div v-click-outside="collapseDropdown" class="filters-list">
    <label for="">{{ trans('Filter') }}:</label>
    <div
      :class="{
        'filter-dropdown' : true,
        'dropdown-expanded' : expand
      }"
    >
      <div ref="dropdown-selection" class="filter-dropdown__selection" @click="toggleDropdown">
        <span v-if="! hasSelectedFilters" class="filter-dropdown__all-results">{{ trans('All Results') }}</span>
        <ul v-else ref="dropdown-selection-list">
          <li v-for="(term, key) in selectedFiltersList" :key="key">
            {{ term.name }}
            <button type="button" class="filter-dropdown__close" @click="toggleOption(term, $event)" />
          </li>
        </ul>
        <div v-if="hiddenFilterSelectionCounter" class="filter-dropdown__hidden-selection-counter">
          +{{ hiddenFilterSelectionCounter }}
        </div>
        <button type="button" class="filter-dropdown__arrow" />
      </div>
      <div class="filter-dropdown__body">
        <button type="button" class="filter-dropdown__clear-all-btn" @click="clearFilters">
          {{ trans('Clear all filters') }}
        </button>
        <hr>
        <ul v-for="(group, groupKey) in taxonomiesList" :key="groupKey" class="filter-dropdown__options">
          <li v-for="(term, termKey) in group.terms" :key="termKey">
            <input
              :id="term.slug"
              type="checkbox"
              :value="term.slug"
              :checked="isOptionActive(term)"
              @change="toggleOption(term, $event)"
            >
            <label :for="term.slug">{{ term.name }}</label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    taxonomiesList: {
      type: Array,
      required: true
    },
    selectedFilters: {
      type: Array,
      default: () => { return []; }
    }
  },
  data() {
    return {
      expand: false,
      hiddenFilterSelectionCounter: 0
    };
  },
  computed: {
    hasSelectedFilters () {
      return this.selectedFilters.length > 0;
    },

    /**
     * List of selected filters with full term details
     */
    selectedFiltersList() {
      let list = [];

      this.selectedFilters.forEach(option => {
        for (const taxonomySlug in option) {
          const taxonomy = this.taxonomiesList.find(group => group.taxonomy.slug === taxonomySlug);

          let selectedTerms = option[taxonomySlug];

          // Updates each selected term with full details
          selectedTerms.forEach(termSlug => {
            const term = taxonomy.terms.find(term => term.slug === termSlug);
            list.push(term);
          });
        }
      });

      return list;
    }
  },
  mounted() {
    // Executes count after element is re-rendered (height changes)
    window.requestAnimationFrame(this.countHiddenSelectedItems);
  },
  methods: {
    toggleDropdown() {
      this.expand = !this.expand;

      this.triggerUpdateOperations();
    },

    collapseDropdown() {
      this.expand = false;

      this.triggerUpdateOperations();
    },

    toggleOption(term, e) {
      e.stopPropagation();

      const selectedFilters = this.selectedFilters;

      const index = selectedFilters.findIndex(optionObj => {
        return typeof optionObj[term.taxonomy] !== 'undefined';
      });

      // Found taxonomy
      if (index !== -1) {
        // Term already selected, unselect it
        if (selectedFilters[index][term.taxonomy].includes(term.slug)) {
          selectedFilters[index][term.taxonomy] = selectedFilters[index][term.taxonomy].filter(slug => {
            return slug !== term.slug;
          });

          // No more terms in taxonomy, remove it entirely
          if (selectedFilters[index][term.taxonomy].length === 0) {
            selectedFilters.splice(index, 1);
          }
        } else {
          selectedFilters[index][term.taxonomy].push(term.slug);
        }
      }

      // New taxonomy selected
      else {
        selectedFilters.push({
          [term.taxonomy]: [term.slug]
        });
      }

      this.$emit('select-filters', {
        options: selectedFilters
      });

      this.triggerUpdateOperations();
    },

    isOptionActive(term) {
      const foundOption = this.selectedFilters.find(optionObj => {
        return typeof optionObj[term.taxonomy] !== 'undefined' && optionObj[term.taxonomy].includes(term.slug);
      });

      return typeof foundOption !== 'undefined';
    },

    clearFilters () {
      // Filters already cleared
      if ( this.selectedFilters.length === 0 ) {
        return;
      }

      this.$emit('clear-filters');

      this.triggerUpdateOperations();
    },

    /**
     * Mimics updated() lifecycle hook
     *
     * This is a workaround to prevent an infinite update loop as the operations
     * change the state of a property, which trigger another updated() lifecycle hook.
     */
    triggerUpdateOperations() {
      // Executes count after element is re-rendered (height changes)
      window.requestAnimationFrame(this.countHiddenSelectedItems);
    },

    /**
     * Counts how many selected items are hidden from view (dropdown is collapsed) so we can
     * display a counter.
     *
     * Needs to be executed after $refs['dropdown-selection'] element is re-rendered as its
     * height changes. Call this function inside window.requestAnimationFrame().
     */
    countHiddenSelectedItems() {
      this.hiddenFilterSelectionCounter = 0;

      if ( this.expand || typeof this.$refs['dropdown-selection-list'] === 'undefined' ) {
        return false;
      }

      const visibleAreaHeight = this.$refs['dropdown-selection'].clientHeight;
      const filterNodes = Array.from(this.$refs['dropdown-selection-list'].children);

      filterNodes.forEach(node => {
        if ( node.offsetTop > visibleAreaHeight ) {
          this.hiddenFilterSelectionCounter ++;
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "~styles/blocks/feed/components/filters-list";
</style>