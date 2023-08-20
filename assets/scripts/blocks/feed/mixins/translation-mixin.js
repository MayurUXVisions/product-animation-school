/**
 * Reads and translate strings stored in Vuex store.
 * Can translate strings that contain dynamic values.
 *
 * Examples:
 *
 * // Simple translation
 * {{ trans('A message to be translated') }}
 *
 * // Translation w/ dynamic values
 * {{ trans('Step %currentStep% of %totalSteps%', {
 *   '%currentStep%': currentStep,
 *   '%totalSteps%': totalSteps
 * }) }}
 */
const translationMixin = {
  methods: {
    trans(string, params) {
      // Replaces dynamic values in string
      if ( typeof params === 'object') {
        let translation = this.$store.state.translations[string];
        for (const prop in params) {
          translation = translation.replace(prop, params[prop]);
        }
        return translation;
      }

      return this.$store.state.translations[string];
    }
  }
};

export default translationMixin;
