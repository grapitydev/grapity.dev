import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import CustomNavTitle from "./components/CustomNavTitle.vue";
import VersionBadge from "./components/VersionBadge.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "nav-bar-title-before": () => h(CustomNavTitle),
      "nav-bar-content-after": () => h(VersionBadge),
    });
  },
};
