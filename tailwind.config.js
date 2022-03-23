const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        defaultKeyColor: "bg-gray-400",
        lightBgColor: "bg-gray-50",
        darkBgColor: "bg-gray-900",
        lightTextColor: "text-white",
        darkTextColor: "text-black",
        lightKeyColor: "bg-gray-200",
        darkKeyColor: "bg-gray-400",
        lightBorderColor: "border-gray-200",
        darkBorderColor: "boreder-gray-700",
        lightInputBorderColor: "border-gray-400",
        darkInputBorderColor: "border-gray-500",
        correctColor: "bg-green-500",
        presentColor: "bg-amber-500",
        absentColor: "bg-gray-500",
        samegroupColor: "border-fuchsia-500",
      },
    },
  },
  plugins: [],
};
