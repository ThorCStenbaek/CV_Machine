import { allRules } from "../allRules";

const workTimelineStartingMeta = {
  ID: null,
  resource_id: null,
  fileID: null,
  ordering: 0,
  html_element: "div",
  number_of_children: 0,
  specific_style: "",
  content_type: "",
  content_data: "",
  instruction: "WORK_TIMELINE",
  depth: 0,
  rules: {
    ...allRules,
    draggable: true,
    selectable: true,
    newRowButton: false
  }
};

export const startingMeta =workTimelineStartingMeta