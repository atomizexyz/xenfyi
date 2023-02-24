const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fil", "zh", "pl", "it"],
    localePath: path.resolve("./public/locales"),
  },
};
