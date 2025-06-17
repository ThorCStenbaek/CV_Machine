
import { BaseTextElement } from "./baseTextElement/baseTextElement";
import { ElementBag } from "./ElementBag";
import { ImageElement } from "./imageElement/element";
import { SkillsElement } from "./skillsElement/element";
import { SocialLinksElement } from "./socialLinksElement/element";
import { WorkTimelineElement } from "./workTimelineElement/element";
let CVE = new ElementBag()


//CVE.add(TestElement)
CVE.add(BaseTextElement)
CVE.add(ImageElement)
CVE.add(SkillsElement)
CVE.add(WorkTimelineElement)

CVE.add(SocialLinksElement)


export const CVElements=CVE