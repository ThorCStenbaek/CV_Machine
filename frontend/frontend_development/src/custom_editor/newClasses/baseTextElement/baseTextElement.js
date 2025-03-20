import { ButtonElement } from "./buttonElement"
import { startingMeta } from "./startingMeta"
import { InputElement } from "./inputElement"
import { RenderElement } from "./renderElement"
import { CustomElement } from "../CustomElement"

export const BaseTextElement= new CustomElement(InputElement, ButtonElement, startingMeta, RenderElement)