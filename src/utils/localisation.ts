import { Localisation } from "../localisation";

type LocaleEntityLike = string | number | boolean | undefined | null;

export class LocalisationObject {
    get(key: keyof typeof Localisation, ...args: LocaleEntityLike[]): any {
        let txt = Localisation[key] || String(key);
        for (const arg of args) {
            txt = txt.replace(/\{[0-9a-zA-Z._]*}/, String(arg));
        }
        return txt;
    }
}
