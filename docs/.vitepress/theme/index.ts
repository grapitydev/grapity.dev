import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import CustomNavTitle from "./components/CustomNavTitle.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "nav-bar-title-before": () => h(CustomNavTitle),
    });
  },
};
