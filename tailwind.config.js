/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", ],
    theme: {
        extend: {},
        minWidth: {
            '0': '0rem',
            'none': 'none',
            'xs': '20rem',
            'sm': '24rem',
            'md': '28rem',
            'lg': '32rem',
            'xl': '36rem',
            '2xl': '42rem',
            '3xl': '48rem',
            '4xl': '56rem',
            '5xl': '64rem',
            '6xl': '72rem',
            '7xl': '80rem',
            'full': '100%',
            'min': 'min-content',
            'max': 'max-content',
            'fit': 'fit-content',
        }
    },
    plugins: [],
}