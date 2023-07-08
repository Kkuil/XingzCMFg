/** @type {import("tailwindcss").Config} */
export default {
    mode: 'jit',
    darkMode: "class",
    purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    content: [],
    theme: {
        gradientColorStops: (theme) => ({
            ...theme("colors"), "primary": "#0094ff", "green": "#00ff00",
        })
    }, corePlugins: {
        container: false
    }, plugins: [], important: true, container: false
}

