import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AnalysisResults from "../src/components/AnalysisResults.vue";

describe("AnalysisResults", () => {
  it("renders empty when no results", () => {
    const wrapper = mount(AnalysisResults, { props: { results: [] } });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toBe(""); // opcional, confirma que está vazio
  });
});
