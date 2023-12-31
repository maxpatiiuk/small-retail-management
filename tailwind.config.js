/*
 * This config partially overwrites and extends the default Tailwind config:
 * https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    // Disable unneeded components to reduce performance impact
    float: false,
    clear: false,
    skew: false,
    caretColor: false,
    sepia: false,
  },
  darkMode: 'media',
  plugins: [require('@tailwindcss/forms')],
};
