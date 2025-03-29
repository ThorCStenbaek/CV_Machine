import { ButtonElement } from "./buttonElement"
import { startingMeta } from "./startingMeta"
import { InputElement } from "./inputElement"
import { RenderElement } from "./renderElement"
import { CustomElement } from "../CustomElement"

export const SocialLinksElement= new CustomElement(InputElement, ButtonElement, startingMeta, RenderElement)