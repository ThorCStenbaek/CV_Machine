import { TestElement } from "./testElement/TestElement";
import { BaseTextElement } from "./baseTextElement/baseTextElement";
import { ElementBag } from "./ElementBag";
import { ImageElement } from "./imageElement/element";
import { SkillsElement } from "./skillsElement/element";
let CVE = new ElementBag()


CVE.add(TestElement)
CVE.add(BaseTextElement)
CVE.add(ImageElement)
CVE.add(SkillsElement)
console.log("CV ELEMENTS WAAAAH", CVE, TestElement)

export const CVElements=CVE