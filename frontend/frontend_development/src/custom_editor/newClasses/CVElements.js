import { TestElement } from "./testElement/TestElement";
import { BaseTextElement } from "./baseTextElement/baseTextElement";
import { ElementBag } from "./ElementBag";
import { ImageElement } from "./imageElement/element";
import { SkillsElement } from "./skillsElement/element";
import { SocialLinksElement } from "./socialLinksElement/element";
let CVE = new ElementBag()


CVE.add(TestElement)
CVE.add(BaseTextElement)
CVE.add(ImageElement)
CVE.add(SkillsElement)

CVE.add(SocialLinksElement)
console.log("CV ELEMENTS WAAAAH", CVE, TestElement)

export const CVElements=CVE